using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetSneakerStatisticQuery : IRequest<GetSneakerStatisticResult>;

public class GetSneakerStatisticQueryHandler
    : IRequestHandler<GetSneakerStatisticQuery, GetSneakerStatisticResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetSneakerStatisticQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetSneakerStatisticResult> Handle(
        GetSneakerStatisticQuery request,
        CancellationToken cancellationToken
    )
    {
        var sneakersQuery = _unitOfWork.Sneakers.Query().AsNoTracking();

        var totalSneakers = await sneakersQuery.CountAsync(s => !s.IsDeleted, cancellationToken);
        var activeSneakers = await sneakersQuery.CountAsync(
            s => !s.IsDeleted && s.IsActive,
            cancellationToken
        );
        var inactiveSneakers = await sneakersQuery.CountAsync(
            s => !s.IsDeleted && !s.IsActive,
            cancellationToken
        );
        var deletedSneakers = await sneakersQuery.CountAsync(s => s.IsDeleted, cancellationToken);

        var totalSellableItems = await _unitOfWork
            .SellableItems.Query()
            .AsNoTracking()
            .CountAsync(si => si.Type == SellableType.SNEAKER_VARIANT, cancellationToken);

        return new GetSneakerStatisticResult
        {
            TotalSneakers = totalSneakers,
            ActiveSneakers = activeSneakers,
            InactiveSneakers = inactiveSneakers,
            DeletedSneakers = deletedSneakers,
            TotalSellableItems = totalSellableItems,
        };
    }
}
