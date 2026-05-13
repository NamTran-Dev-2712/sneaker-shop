public record ToggleVoucherActiveResult
{
    public required int Id { get; init; }
    public required string Code { get; init; }
    public required bool IsActive { get; init; }
    public required string ComputedStatus { get; init; }
}
