using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetBrandStatisticQuery : IRequest<GetBrandStatisticResult>;

public class GetBrandStatisticQueryHandler
    : IRequestHandler<GetBrandStatisticQuery, GetBrandStatisticResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetBrandStatisticQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetBrandStatisticResult> Handle(
        GetBrandStatisticQuery request,
        CancellationToken cancellationToken
    )
    {
        var brandsQuery = _unitOfWork.Brands.Query().AsNoTracking().Where(b => !b.IsDeleted);

        var totalBrands = await brandsQuery.CountAsync(cancellationToken);
        var activeBrands = await brandsQuery.CountAsync(b => b.IsActive, cancellationToken);

        var totalBrandSeries = await _unitOfWork
            .BrandSeries.Query()
            .AsNoTracking()
            .CountAsync(bs => !bs.IsDeleted, cancellationToken);

        return new GetBrandStatisticResult
        {
            TotalBrands = totalBrands,
            ActiveBrands = activeBrands,
            InactiveBrands = totalBrands - activeBrands,
            TotalBrandSeries = totalBrandSeries,
        };
    }
}
