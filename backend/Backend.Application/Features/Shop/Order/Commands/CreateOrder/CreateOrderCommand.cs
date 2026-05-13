using MediatR;

public record CreateOrderCommand : IRequest<CreateOrderResult>
{
    // Set by controller from JWT — not from client body
    public int CustomerId { get; init; }

    /// <summary>Client-generated UUID for idempotent order creation.</summary>
    public required string IdempotencyKey { get; init; }

    // Fulfillment info
    public required string FulfillmentType { get; init; } // DELIVERY | PICKUP
    public string? RecipientName { get; init; }
    public string? RecipientPhone { get; init; }
    public string? Province { get; init; }
    public string? Ward { get; init; }
    public string? AddressDetail { get; init; }
    public int? PickupStoreId { get; init; }

    // Payment info
    public required string PaymentMethod { get; init; } // COD, BANK_TRANSFER, etc.

    // Optional voucher code — validated & redeemed atomically in the transaction
    public string? VoucherCode { get; init; }

    // Items
    public required List<CreateOrderItemDto> Items { get; init; }

    // Optional
    public string? Note { get; init; }
}

public record CreateOrderItemDto
{
    public required int SellableItemId { get; init; }
    public required int InventoryId { get; init; }
    public required int Quantity { get; init; }

    // Snapshot data sent from the client (captured at checkout time)
    public required string ProductName { get; init; }
    public required string Sku { get; init; }
    public string? VariantName { get; init; }
    public required decimal UnitPrice { get; init; }
    public string? PrimaryImageUrl { get; init; }
}
