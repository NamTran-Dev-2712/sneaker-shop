using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetCustomerIdByAccountQueryHandler : IRequestHandler<GetCustomerIdByAccountQuery, int?>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetCustomerIdByAccountQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<int?> Handle(
        GetCustomerIdByAccountQuery query,
        CancellationToken cancellationToken
    )
    {
        // Get CustomerAccount by AccountId to find CustomerId
        // Account -> CustomerAccount -> CustomerId
        var customerAccount = await _unitOfWork
            .Repository<CustomerAccount>()
            .Query()
            .AsNoTracking()
            .FirstOrDefaultAsync(ca => ca.AccountId == query.AccountId, cancellationToken);

        return customerAccount?.CustomerId;
    }
}
