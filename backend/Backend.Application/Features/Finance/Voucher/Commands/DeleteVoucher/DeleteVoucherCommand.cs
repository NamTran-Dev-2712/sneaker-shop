using MediatR;

public record DeleteVoucherCommand(int Id) : IRequest<DeleteVoucherResult>;
