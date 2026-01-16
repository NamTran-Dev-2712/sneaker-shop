using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetStoreStatisticQuery : IRequest<GetStoreStatisticResult>;

public class GetStoreStatisticQueryHandler
    : IRequestHandler<GetStoreStatisticQuery, GetStoreStatisticResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetStoreStatisticQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetStoreStatisticResult> Handle(
        GetStoreStatisticQuery request,
        CancellationToken cancellationToken
    )
    {
        var storesQuery = _unitOfWork.Stores.Query().AsNoTracking().Where(s => !s.IsDeleted);

        var totalStores = await storesQuery.CountAsync(cancellationToken);
        var activeStores = await storesQuery.CountAsync(s => s.IsActive, cancellationToken);

        var totalStaff = await _unitOfWork
            .Repository<StaffProfile>()
            .Query()
            .AsNoTracking()
            .CountAsync(cancellationToken);

        return new GetStoreStatisticResult
        {
            TotalStores = totalStores,
            ActiveStores = activeStores,
            InactiveStores = totalStores - activeStores,
            TotalStaff = totalStaff,
        };
    }
}
