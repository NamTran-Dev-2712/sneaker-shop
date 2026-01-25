using MediatR;
using Microsoft.EntityFrameworkCore;

public class UpdateSellableItemCommandHandler
    : IRequestHandler<UpdateSellableItemCommand, UpdateSellableItemResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateSellableItemCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateSellableItemResult> Handle(
        UpdateSellableItemCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get vendor price
        var vendorPrice = await _unitOfWork.VendorPrices.GetByIdAsync(
            command.Id,
            vp => vp.SellableItem
        );

        if (vendorPrice == null)
        {
            throw new NotFoundException("Không tìm thấy giá nhà cung cấp.");
        }

        // 2. Verify vendor matches
        if (vendorPrice.VendorId != command.VendorId)
        {
            throw new BadException("Giá không thuộc nhà cung cấp này.");
        }

        // 3. Check for overlapping price periods (exclude current)
        var hasOverlap = await _unitOfWork
            .VendorPrices.Query()
            .AnyAsync(
                vp =>
                    vp.Id != command.Id
                    && vp.VendorId == command.VendorId
                    && vp.SellableItemId == vendorPrice.SellableItemId
                    && vp.EffectiveFrom <= (command.EffectiveTo ?? DateTime.MaxValue)
                    && (vp.EffectiveTo == null || vp.EffectiveTo >= command.EffectiveFrom),
                cancellationToken
            );

        if (hasOverlap)
        {
            throw new BadException("Khoảng thời gian giá bị trùng lập với giá khác.");
        }

        // 4. Update vendor price
        vendorPrice.UpdatePrice(command.Price);
        vendorPrice.EffectiveFrom = command.EffectiveFrom;
        vendorPrice.EffectiveTo = command.EffectiveTo;
        vendorPrice.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new UpdateSellableItemResult
        {
            Id = vendorPrice.Id,
            VendorId = vendorPrice.VendorId,
            SellableItemId = vendorPrice.SellableItemId,
            Sku = vendorPrice.SellableItem.Sku,
            Price = vendorPrice.Price,
            EffectiveFrom = vendorPrice.EffectiveFrom,
            EffectiveTo = vendorPrice.EffectiveTo,
            UpdatedAt = vendorPrice.UpdatedAt,
        };
    }
}
