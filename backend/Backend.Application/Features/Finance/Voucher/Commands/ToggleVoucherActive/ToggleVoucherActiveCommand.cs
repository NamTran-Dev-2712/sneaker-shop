using MediatR;

public record ToggleVoucherActiveCommand(int Id) : IRequest<ToggleVoucherActiveResult>;
