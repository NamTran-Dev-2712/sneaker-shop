using System.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, CreateOrderResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private const decimal FREE_SHIPPING_THRESHOLD = 500_000m;
    private const decimal SHIPPING_FEE = 30_000m;

    public CreateOrderCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CreateOrderResult> Handle(
        CreateOrderCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Idempotency check — return existing order if key already used
        var existingOrder = await _unitOfWork.Orders.GetByIdempotencyKeyAsync(
            command.IdempotencyKey,
            cancellationToken
        );

        if (existingOrder != null)
        {
            return MapToResult(existingOrder, "Đơn hàng đã được tạo trước đó (idempotent).");
        }

        // 2. Execute the full order creation in a serializable transaction
        //    to ensure inventory reservation is concurrency-safe
        return await _unitOfWork.ExecuteInTransactionAsync(
            async () => await ProcessCreateOrderAsync(command, cancellationToken),
            IsolationLevel.Serializable
        );
    }

    private async Task<CreateOrderResult> ProcessCreateOrderAsync(
        CreateOrderCommand command,
        CancellationToken cancellationToken
    )
    {
        var fulfillmentType = Enum.Parse<FulfillmentType>(command.FulfillmentType, true);
        var paymentMethod = Enum.Parse<PaymentMethod>(command.PaymentMethod, true);
        var isCodPayment = paymentMethod == PaymentMethod.COD;

        // 1. Validate all inventory items and reserve stock
        var orderItems = new List<OrderItem>();
        decimal subtotal = 0;
        int? resolvedStoreId = null;

        foreach (var itemDto in command.Items)
        {
            // Fetch inventory with tracking (for concurrency token)
            var inventory = await _unitOfWork
                .Inventories.Query()
                .FirstOrDefaultAsync(i => i.Id == itemDto.InventoryId, cancellationToken);

            if (inventory == null)
            {
                throw new InvalidOperationException(
                    $"Kho hàng ID {itemDto.InventoryId} không tồn tại."
                );
            }

            if (inventory.SellableItemId != itemDto.SellableItemId)
            {
                throw new InvalidOperationException(
                    $"Kho hàng ID {itemDto.InventoryId} không thuộc sản phẩm ID {itemDto.SellableItemId}."
                );
            }

            // Validate single-store constraint — all items must belong to the same store
            if (resolvedStoreId == null)
            {
                resolvedStoreId = inventory.StoreId;
            }
            else if (resolvedStoreId != inventory.StoreId)
            {
                throw new InvalidOperationException(
                    "Tất cả sản phẩm trong đơn hàng phải thuộc cùng một cửa hàng. "
                        + "Vui lòng tách đơn hàng theo cửa hàng."
                );
            }

            // Reserve inventory — this will throw if insufficient
            // RowVersion concurrency token will cause DbUpdateConcurrencyException on conflict
            inventory.Reserve(itemDto.Quantity);
            _unitOfWork.Inventories.Update(inventory);

            // Create order item with snapshot data
            var lineTotal = itemDto.UnitPrice * itemDto.Quantity;
            subtotal += lineTotal;

            orderItems.Add(
                new OrderItem
                {
                    SellableItemId = itemDto.SellableItemId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = itemDto.UnitPrice,
                    LineTotal = lineTotal,
                    ProductNameSnapshot = itemDto.ProductName,
                    SkuSnapshot = itemDto.Sku,
                    VariantNameSnapshot = itemDto.VariantName,
                    UnitPriceSnapshot = itemDto.UnitPrice,
                    PrimaryImageUrlSnapshot = itemDto.PrimaryImageUrl,
                }
            );
        }

        // 2. Calculate totals
        var shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
        var total = subtotal + shippingFee;

        // 3. Create order entity
        var order = new Order
        {
            Channel = SalesChannel.ONLINE,
            Status = OrderStatus.PLACED,
            StoreId = resolvedStoreId!.Value,
            CustomerId = command.CustomerId,
            CreatedBy = command.CustomerId,
            Subtotal = subtotal,
            ShippingFee = shippingFee,
            Total = total,
            Note = command.Note?.Trim(),
            IdempotencyKey = command.IdempotencyKey,
        };
        order.Place();

        // Prepaid online orders are auto-confirmed by system (no manual paid step before packing).
        if (!isCodPayment)
        {
            order.UpdateStatus(OrderStatus.CONFIRMED);
        }

        await _unitOfWork.Orders.AddAsync(order, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 4. Add order items (now we have order.Id)
        foreach (var item in orderItems)
        {
            item.OrderId = order.Id;
        }

        await _unitOfWork.OrderItems.AddRangeAsync(orderItems, cancellationToken);

        // 5. Create payment record
        var payment = new Payment
        {
            OrderId = order.Id,
            Method = paymentMethod,
            Status = isCodPayment ? PaymentStatus.PENDING : PaymentStatus.PAID,
            Amount = total,
            PaidAt = isCodPayment ? null : DateTime.UtcNow,
        };

        await _unitOfWork.Payments.AddAsync(payment, cancellationToken);

        if (!isCodPayment)
        {
            var hasIncomeEntry = await _unitOfWork.FinanceLedgerEntries.ExistsBySourceAsync(
                FinanceEntrySourceType.ORDER_PAYMENT,
                order.Id,
                cancellationToken
            );

            if (!hasIncomeEntry)
            {
                await _unitOfWork.FinanceLedgerEntries.AddAsync(
                    new FinanceLedgerEntry
                    {
                        Status = FinanceEntryStatus.INCOME,
                        Amount = total,
                        Category = "ORDER",
                        Description = $"Thanh toán online đơn hàng ORD-{order.Id:D6}",
                        SourceType = FinanceEntrySourceType.ORDER_PAYMENT,
                        SourceId = order.Id,
                        StoreId = order.StoreId,
                        CreatedBy = order.CreatedBy,
                        OccurredAt = payment.PaidAt ?? DateTime.UtcNow,
                    },
                    cancellationToken
                );
            }
        }

        // 6. Create fulfillment record
        var fulfillment = new OrderFulfillment { OrderId = order.Id, Type = fulfillmentType };

        if (fulfillmentType == FulfillmentType.DELIVERY)
        {
            var fullAddress = $"{command.AddressDetail}, {command.Ward}, {command.Province}";
            fulfillment.UpdateDeliveryInfo(
                command.RecipientName!,
                command.RecipientPhone!,
                fullAddress
            );
        }
        else if (fulfillmentType == FulfillmentType.PICKUP)
        {
            // Pickup store = the store that owns the inventory for this order
            fulfillment.UpdatePickupInfo(
                resolvedStoreId!.Value,
                DateTime.UtcNow.AddDays(7) // Click & collect expires in 7 days
            );

            // Save recipient info so staff can verify the person collecting
            fulfillment.RecipientName = command.RecipientName?.Trim();
            fulfillment.RecipientPhone = command.RecipientPhone?.Trim();
        }

        await _unitOfWork.OrderFulfillments.AddAsync(fulfillment, cancellationToken);

        // 7. Save everything
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToResult(order, "Đặt hàng thành công!");
    }

    private static CreateOrderResult MapToResult(Order order, string message)
    {
        return new CreateOrderResult
        {
            OrderId = order.Id,
            Status = order.Status.ToString(),
            Subtotal = order.Subtotal,
            ShippingFee = order.ShippingFee,
            Total = order.Total,
            PaymentMethod = order.Payments.FirstOrDefault()?.Method.ToString() ?? "",
            FulfillmentType = order.OrderFulfillment?.Type.ToString() ?? "",
            PlacedAt = order.PlacedAt ?? order.CreatedAt,
            Message = message,
        };
    }
}
