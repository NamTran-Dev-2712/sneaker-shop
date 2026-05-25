using MediatR;
using Microsoft.EntityFrameworkCore;

public class AddSellableItemCommandHandler
    : IRequestHandler<AddSellableItemCommand, AddSellableItemResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public AddSellableItemCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<AddSellableItemResult> Handle(
        AddSellableItemCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Verify vendor exists
        var vendor = await _unitOfWork.Vendors.GetByIdAsync(command.VendorId, cancellationToken);
        if (vendor == null || vendor.IsDeleted)
        {
            throw new NotFoundException("Không tìm thấy nhà cung cấp.");
        }

        // 2. Verify sellable item exists
        var sellableItem = await _unitOfWork.SellableItems.GetByIdAsync(
            command.SellableItemId,
            cancellationToken
        );
        if (sellableItem == null)
        {
            throw new NotFoundException("Không tìm thấy sản phẩm.");
        }

        // 3. Check for overlapping price periods
        var hasOverlap = await _unitOfWork
            .VendorPrices.Query()
            .AnyAsync(
                vp =>
                    vp.VendorId == command.VendorId
                    && vp.SellableItemId == command.SellableItemId
                    && vp.EffectiveFrom <= (command.EffectiveTo ?? DateTime.MaxValue)
                    && (vp.EffectiveTo == null || vp.EffectiveTo >= command.EffectiveFrom),
                cancellationToken
            );

        if (hasOverlap)
        {
            throw new BadException("Khoảng thời gian giá bị trùng lập với giá hiện tại.");
        }

        // 4. Create vendor price
        var vendorPrice = new VendorPrice
        {
            VendorId = command.VendorId,
            SellableItemId = command.SellableItemId,
            Price = command.Price,
            EffectiveFrom = command.EffectiveFrom,
            EffectiveTo = command.EffectiveTo,
        };

        await _unitOfWork.VendorPrices.AddAsync(vendorPrice, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new AddSellableItemResult
        {
            Id = vendorPrice.Id,
            VendorId = vendorPrice.VendorId,
            SellableItemId = vendorPrice.SellableItemId,
            Sku = sellableItem.Sku,
            Price = vendorPrice.Price,
            EffectiveFrom = vendorPrice.EffectiveFrom,
            EffectiveTo = vendorPrice.EffectiveTo,
            CreatedAt = vendorPrice.CreatedAt,
        };
    }
}
