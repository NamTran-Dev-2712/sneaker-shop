using MediatR;

public record DeletePurchaseOrderCommand(int Id) : IRequest<DeletePurchaseOrderResult>;
