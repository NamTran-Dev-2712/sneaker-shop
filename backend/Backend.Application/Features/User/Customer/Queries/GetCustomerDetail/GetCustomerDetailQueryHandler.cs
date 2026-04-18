using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetCustomerDetailQueryHandler
    : IRequestHandler<GetCustomerDetailQuery, GetCustomerDetailResult?>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetCustomerDetailQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetCustomerDetailResult?> Handle(
        GetCustomerDetailQuery query,
        CancellationToken cancellationToken
    )
    {
        var customer = await _unitOfWork
            .Customers.Query()
            .AsNoTracking()
            .Include(c => c.CustomerAccount)
                .ThenInclude(ca => ca != null ? ca.Account : null)
            .Include(c => c.LoyaltyAccount)
            .Where(c =>
                c.Id == query.Id
                && (c.CustomerAccount == null || c.CustomerAccount.Account.Role == Role.CUSTOMER)
            )
            .FirstOrDefaultAsync(cancellationToken);

        if (customer == null)
            return null;

        var totalOrders = await _unitOfWork
            .Orders.Query()
            .AsNoTracking()
            .CountAsync(o => o.CustomerId == query.Id, cancellationToken);

        var totalSpent = await _unitOfWork
            .Orders.Query()
            .AsNoTracking()
            .Where(o =>
                o.CustomerId == query.Id
                && (o.Status == OrderStatus.DELIVERED || o.Status == OrderStatus.REFUNDED)
            )
            .SumAsync(o => (decimal?)o.Total ?? 0m, cancellationToken);

        var account = customer.CustomerAccount?.Account;

        return new GetCustomerDetailResult
        {
            Id = customer.Id,
            FullName = customer.FullName ?? string.Empty,
            Phone = customer.Phone,
            Email = customer.Email,
            Birthday = customer.Birthday,
            CreatedAt = customer.CreatedAt,
            AccountId = account?.Id,
            HasAccount = account != null,
            IsActive = account?.IsActive ?? false,
            IsEmailVerified = account?.IsEmailVerified ?? false,
            Avatar = account?.Avatar,
            TotalOrders = totalOrders,
            TotalSpent = totalSpent,
            LoyaltyPoints = customer.LoyaltyAccount?.PointsBalance ?? 0,
            LoyaltyTier = customer.LoyaltyAccount?.Tier ?? "STANDARD",
        };
    }
}
