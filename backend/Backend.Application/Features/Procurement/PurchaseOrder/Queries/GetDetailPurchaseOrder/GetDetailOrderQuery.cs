using MediatR;

public record GetDetailPurchaseOrderQuery(int Id) : IRequest<GetDetailPurchaseOrderResult>;
