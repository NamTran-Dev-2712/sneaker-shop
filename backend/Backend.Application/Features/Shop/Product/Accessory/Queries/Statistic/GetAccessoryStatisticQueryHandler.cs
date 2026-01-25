using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetAccessoryStatisticQuery : IRequest<GetAccessoryStatisticResult>;

public class GetAccessoryStatisticQueryHandler
    : IRequestHandler<GetAccessoryStatisticQuery, GetAccessoryStatisticResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAccessoryStatisticQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetAccessoryStatisticResult> Handle(
        GetAccessoryStatisticQuery request,
        CancellationToken cancellationToken
    )
    {
        var accessoryQuery = _unitOfWork.Accessories.Query().AsNoTracking();
        var sellableQuery = _unitOfWork.SellableItems.Query().AsNoTracking();
        var imageQuery = _unitOfWork.AccessoryImages.Query().AsNoTracking();

        // Accessory statistics
        var totalAccessories = await accessoryQuery.CountAsync(
            a => !a.IsDeleted,
            cancellationToken
        );
        var deletedAccessories = await accessoryQuery.CountAsync(
            a => a.IsDeleted,
            cancellationToken
        );

        // Active/Inactive based on SellableItem status
        var activeAccessories = await sellableQuery.CountAsync(
            si => si.Type == SellableType.ACCESSORY && si.IsActive,
            cancellationToken
        );
        var inactiveAccessories = await sellableQuery.CountAsync(
            si => si.Type == SellableType.ACCESSORY && !si.IsActive,
            cancellationToken
        );

        // SellableItem and Image counts
        var totalSellableItems = await sellableQuery.CountAsync(
            si => si.Type == SellableType.ACCESSORY,
            cancellationToken
        );
        var totalImages = await imageQuery.CountAsync(cancellationToken);

        return new GetAccessoryStatisticResult
        {
            TotalAccessories = totalAccessories,
            ActiveAccessories = activeAccessories,
            InactiveAccessories = inactiveAccessories,
            DeletedAccessories = deletedAccessories,
            TotalSellableItems = totalSellableItems,
            TotalImages = totalImages,
        };
    }
}
