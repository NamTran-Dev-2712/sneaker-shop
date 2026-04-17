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
        // Fast idempotency check — outside transaction for performance
        var existingOrder = await _unitOfWork.Orders.GetByIdempotencyKeyAsync(
            command.IdempotencyKey,
            cancellationToken
        );
        if (existingOrder != null)
            return MapToResult(existingOrder, "Đơn hàng đã được tạo trước đó (idempotent).");

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
        var customerAccount = await _unitOfWork
            .Repository<CustomerAccount>()
            .GetFirstOrDefaultAsync(ca => ca.CustomerId == command.CustomerId, ca => ca.Account);

        if (customerAccount?.Account == null || !customerAccount.Account.IsActive)
        {
            throw new ForbiddenException(
                "Tài khoản khách hàng không hợp lệ hoặc đã bị vô hiệu hóa."
            );
        }

        if (!customerAccount.Account.IsEmailVerified)
        {
            throw new ForbiddenException(
                "Email của bạn chưa được xác minh. Vui lòng xác minh email trước khi đặt hàng."
            );
        }

        var fulfillmentType = Enum.Parse<FulfillmentType>(command.FulfillmentType, true);
        var paymentMethod = Enum.Parse<PaymentMethod>(command.PaymentMethod, true);
        var isCodPayment = paymentMethod == PaymentMethod.COD;
        var isVnPayPayment = paymentMethod == PaymentMethod.VNPAY;
        var isDeferredOnlinePayment = isCodPayment || isVnPayPayment;

        // --- Batch load all inventories in a single query (eliminates N+1) ---
        var inventoryIds = command.Items.Select(i => i.InventoryId).Distinct().ToList();
        var inventoryMap = await _unitOfWork
            .Inventories.Query()
            .Where(i => inventoryIds.Contains(i.Id))
            .ToDictionaryAsync(i => i.Id, cancellationToken);

        // Validate all items before mutating any state
        int? resolvedStoreId = null;
        foreach (var itemDto in command.Items)
        {
            if (!inventoryMap.TryGetValue(itemDto.InventoryId, out var inventory))
                throw new NotFoundException($"Kho hàng ID {itemDto.InventoryId} không tồn tại.");

            if (inventory.SellableItemId != itemDto.SellableItemId)
                throw new BadException(
                    $"Kho hàng ID {itemDto.InventoryId} không thuộc sản phẩm ID {itemDto.SellableItemId}."
                );

            if (resolvedStoreId == null)
                resolvedStoreId = inventory.StoreId;
            else if (resolvedStoreId != inventory.StoreId)
                throw new BadException(
                    "Tất cả sản phẩm trong đơn hàng phải thuộc cùng một cửa hàng. "
                        + "Vui lòng tách đơn hàng theo cửa hàng."
                );
        }

        // All validations passed — now reserve inventory and build order items
        var orderItems = new List<OrderItem>();
        decimal subtotal = 0;

        foreach (var itemDto in command.Items)
        {
            var inventory = inventoryMap[itemDto.InventoryId];

            // Reserve throws InvalidOperationException if insufficient stock
            // RowVersion concurrency token will catch concurrent conflicts at SaveChanges
            inventory.Reserve(itemDto.Quantity);
            _unitOfWork.Inventories.Update(inventory);

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

        var shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

        // ============ Voucher Validation & Redemption (inside Serializable transaction) ============
        decimal discountTotal = 0;
        VoucherRedemption? voucherRedemption = null;

        if (!string.IsNullOrWhiteSpace(command.VoucherCode))
        {
            var code = command.VoucherCode.Trim().ToUpperInvariant();
            var voucher = await _unitOfWork
                .Vouchers.Query()
                .Include(v => v.Redemptions)
                .FirstOrDefaultAsync(v => v.Code == code, cancellationToken);

            if (voucher == null)
                throw new NotFoundException("Mã voucher không hợp lệ.");

            // Re-validate atomically inside Serializable transaction.
            // This catches TOCTOU races where voucher was deactivated or exhausted
            // between the dry-run preview and the actual order placement.
            discountTotal = VoucherValidationHelper.Validate(voucher, subtotal, command.CustomerId);

            voucherRedemption = new VoucherRedemption
            {
                VoucherId = voucher.Id,
                CustomerId = command.CustomerId,
                DiscountAmount = discountTotal,
            };
            voucherRedemption.Redeem();
        }

        var total = subtotal - discountTotal + shippingFee;

        // Build the complete order object graph — EF resolves all FKs at SaveChanges time
        var order = new Order
        {
            Channel = SalesChannel.ONLINE,
            Status = OrderStatus.PLACED,
            StoreId = resolvedStoreId!.Value,
            CustomerId = command.CustomerId,
            CreatedBy = customerAccount.AccountId,
            Subtotal = subtotal,
            DiscountTotal = discountTotal,
            ShippingFee = shippingFee,
            Total = total,
            Note = command.Note?.Trim(),
            IdempotencyKey = command.IdempotencyKey,
        };
        order.Place();

        if (!isDeferredOnlinePayment)
            order.UpdateStatus(OrderStatus.CONFIRMED);

        var payment = new Payment
        {
            Method = paymentMethod,
            Status = isDeferredOnlinePayment ? PaymentStatus.PENDING : PaymentStatus.PAID,
            Amount = total,
            PaidAt = isDeferredOnlinePayment ? null : DateTime.UtcNow,
            Provider = isVnPayPayment ? "VNPAY" : null,
        };

        var fulfillment = new OrderFulfillment { Type = fulfillmentType };
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
            fulfillment.UpdatePickupInfo(resolvedStoreId!.Value, DateTime.UtcNow.AddDays(7));
            fulfillment.RecipientName = command.RecipientName?.Trim();
            fulfillment.RecipientPhone = command.RecipientPhone?.Trim();
        }

        // Wire navigation properties so EF inserts everything in one SaveChanges call
        order.OrderItems = orderItems;
        order.Payments = new List<Payment> { payment };
        order.OrderFulfillment = fulfillment;
        if (voucherRedemption != null)
            order.VoucherRedemption = voucherRedemption;

        await _unitOfWork.Orders.AddAsync(order, cancellationToken);

        // Finance ledger — added before SaveChanges so it's atomic with the order insert
        if (!isDeferredOnlinePayment)
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
                        Description = $"Thanh toán online đơn hàng",
                        SourceType = FinanceEntrySourceType.ORDER_PAYMENT,
                        StoreId = order.StoreId,
                        CreatedBy = order.CreatedBy,
                        OccurredAt = payment.PaidAt ?? DateTime.UtcNow,
                    },
                    cancellationToken
                );
            }
        }

        // Single SaveChanges — EF inserts Order first (gets Id), then resolves FKs for children
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToResult(order, "Đặt hàng thành công!", payment.Method, fulfillment.Type);
    }

    private static CreateOrderResult MapToResult(
        Order order,
        string message,
        PaymentMethod? fallbackPaymentMethod = null,
        FulfillmentType? fallbackFulfillmentType = null
    )
    {
        return new CreateOrderResult
        {
            OrderId = order.Id,
            Status = order.Status.ToString(),
            Subtotal = order.Subtotal,
            DiscountTotal = order.DiscountTotal,
            ShippingFee = order.ShippingFee,
            Total = order.Total,
            VoucherCode = order.VoucherRedemption?.Voucher?.Code,
            PaymentMethod =
                order.Payments.FirstOrDefault()?.Method.ToString()
                ?? fallbackPaymentMethod?.ToString()
                ?? "",
            FulfillmentType =
                order.OrderFulfillment?.Type.ToString()
                ?? fallbackFulfillmentType?.ToString()
                ?? "",
            PlacedAt = order.PlacedAt ?? order.CreatedAt,
            Message = message,
        };
    }
}
