using MediatR;

public record GetDetailInventoryQuery(int Id) : IRequest<GetDetailInventoryResult>;
