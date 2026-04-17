using MediatR;

public record GetMyLoyaltyAccountQuery(int CustomerId) : IRequest<GetMyLoyaltyAccountResult>;
