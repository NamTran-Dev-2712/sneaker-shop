using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetCategoryAccessoryStatisticQuery : IRequest<GetCategoryAccessoryStatisticResult>;

public class GetCategoryAccessoryStatisticQueryHandler
    : IRequestHandler<GetCategoryAccessoryStatisticQuery, GetCategoryAccessoryStatisticResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetCategoryAccessoryStatisticQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetCategoryAccessoryStatisticResult> Handle(
        GetCategoryAccessoryStatisticQuery request,
        CancellationToken cancellationToken
    )
    {
        var categoryQuery = _unitOfWork.CategoryAccessories.Query().AsNoTracking();
        var brandQuery = _unitOfWork.BrandCategoryAccessories.Query().AsNoTracking();
        var accessoryQuery = _unitOfWork.Accessories.Query().AsNoTracking();

        // Category statistics
        var totalCategories = await categoryQuery.CountAsync(c => !c.IsDeleted, cancellationToken);
        var deletedCategories = await categoryQuery.CountAsync(c => c.IsDeleted, cancellationToken);

        // Brand statistics
        var totalBrands = await brandQuery.CountAsync(b => !b.IsDeleted, cancellationToken);
        var deletedBrands = await brandQuery.CountAsync(b => b.IsDeleted, cancellationToken);

        // Accessory count
        var totalAccessories = await accessoryQuery.CountAsync(
            a => !a.IsDeleted,
            cancellationToken
        );

        return new GetCategoryAccessoryStatisticResult
        {
            TotalCategories = totalCategories,
            ActiveCategories = totalCategories, // Categories don't have IsActive, so Active = Total
            DeletedCategories = deletedCategories,
            TotalBrands = totalBrands,
            ActiveBrands = totalBrands, // Brands don't have IsActive, so Active = Total
            DeletedBrands = deletedBrands,
            TotalAccessories = totalAccessories,
        };
    }
}
