public class CustomerAccount : BaseEntity
{
    public CustomerAccount() { }

    public int AccountId { get; set; }
    public int CustomerId { get; set; }

    // Navigation properties
    public Account Account { get; set; } = null!;
    public Customer Customer { get; set; } = null!;

    // 1 customer có thể có 0 hoặc 1 account
    // 1 account CUSTOMER phải gắn 1 customer
}
