public class Order : BaseEntity
{
    public Order() { }

    public SalesChannel Channel { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.PLACED;
    public int? StoreId { get; set; } // POS: store bán | Pickup: store nhận | Online: store xử lý
    public int? CustomerId { get; set; } // Có thể null nếu khách vãng lai POS
    public int? CreatedBy { get; set; } // Customer tạo online hoặc staff tạo POS
    public int? StaffId { get; set; } // Staff xử lý/confirm đơn online hoặc staff bán POS
    public decimal Subtotal { get; set; } = 0;
    public decimal DiscountTotal { get; set; } = 0;
    public decimal ShippingFee { get; set; } = 0;
    public decimal Total { get; set; } = 0;
    public long RedeemedPoints { get; set; } = 0;
    public decimal RedeemedAmount { get; set; } = 0;
    public string? Note { get; set; }
    public DateTime? PlacedAt { get; set; }

    /// <summary>Client-generated UUID to prevent duplicate order creation.</summary>
    public string? IdempotencyKey { get; set; }

    /// <summary>
    /// Computed column: LOWER('ord-' || id::text). Stored in DB for search index.
    /// Read-only from application — set and maintained by the database.
    /// </summary>
    public string? OrderRef { get; private set; }

    // Navigation properties
    public Store? Store { get; set; }
    public Customer? Customer { get; set; }
    public Account? Creator { get; set; }
    public Account? Staff { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public OrderFulfillment? OrderFulfillment { get; set; }
    public VoucherRedemption? VoucherRedemption { get; set; }
    public ICollection<LoyaltyTransaction> LoyaltyTransactions { get; set; } =
        new List<LoyaltyTransaction>();
    public ICollection<Return> Returns { get; set; } = new List<Return>();

    // Business logic
    public void UpdateStatus(OrderStatus newStatus)
    {
        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Place()
    {
        Status = OrderStatus.PLACED;
        PlacedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Confirm(int staffId)
    {
        Status = OrderStatus.CONFIRMED;
        StaffId = staffId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsPaid()
    {
        Status = OrderStatus.PAID;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Pack()
    {
        Status = OrderStatus.PACKED;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Ship()
    {
        Status = OrderStatus.SHIPPED;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deliver()
    {
        Status = OrderStatus.DELIVERED;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Cancel()
    {
        Status = OrderStatus.CANCELLED;
        UpdatedAt = DateTime.UtcNow;
    }

    public void CalculateTotals()
    {
        Total = Subtotal - DiscountTotal + ShippingFee - RedeemedAmount;
        if (Total < 0)
            Total = 0;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ApplyDiscount(decimal discountAmount)
    {
        DiscountTotal += discountAmount;
        CalculateTotals();
    }

    public void ApplyLoyaltyRedemption(long points, decimal amount)
    {
        RedeemedPoints = points;
        RedeemedAmount = amount;
        CalculateTotals();
    }

    public bool CanCancel()
    {
        return Status == OrderStatus.PLACED || Status == OrderStatus.CONFIRMED;
    }

    public bool CanEdit()
    {
        return Status == OrderStatus.PLACED;
    }

    public bool IsCompleted()
    {
        return Status == OrderStatus.DELIVERED
            || Status == OrderStatus.CANCELLED
            || Status == OrderStatus.REFUNDED;
    }
}
