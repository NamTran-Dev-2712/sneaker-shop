public record ToggleCustomerActiveResult
{
    public required int CustomerId { get; init; }
    public required int AccountId { get; init; }
    public required bool IsActive { get; init; }
    public required string Message { get; init; }
}
