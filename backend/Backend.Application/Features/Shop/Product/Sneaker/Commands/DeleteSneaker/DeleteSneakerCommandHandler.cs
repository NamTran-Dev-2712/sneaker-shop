using MediatR;
using Microsoft.EntityFrameworkCore;

public class DeleteSneakerCommandHandler
    : IRequestHandler<DeleteSneakerCommand, DeleteSneakerResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteSneakerCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<DeleteSneakerResult> Handle(
        DeleteSneakerCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get sneaker with related entities
        var sneaker = await _unitOfWork.Sneakers.GetWithColorwaysAndVariantsAsync(
            command.Id,
            cancellationToken
        );

        if (sneaker == null || sneaker.IsDeleted)
        {
            throw new NotFoundException("Không tìm thấy sản phẩm.");
        }

        // 2. Check if any variant has inventory (OnHand > 0)
        var sellableItemIds = sneaker
            .Colorways.SelectMany(c => c.Variants)
            .Where(v => v.SellableItem != null)
            .Select(v => v.SellableItem!.Id)
            .ToList();

        if (sellableItemIds.Any())
        {
            var hasInventory = await _unitOfWork
                .Inventories.Query()
                .AnyAsync(
                    inv => sellableItemIds.Contains(inv.SellableItemId) && inv.OnHand > 0,
                    cancellationToken
                );

            if (hasInventory)
            {
                throw new BadException(
                    "Không thể xóa sản phẩm vì vẫn còn tồn kho. Vui lòng xử lý hết hàng tồn kho trước."
                );
            }
        }

        // 3. Soft delete sneaker (use domain method)
        sneaker.SoftDelete();

        // 4. Deactivate all colorways
        foreach (var colorway in sneaker.Colorways)
        {
            colorway.Deactivate();

            // 5. Deactivate all sellable items for variants
            foreach (var variant in colorway.Variants)
            {
                if (variant.SellableItem != null)
                {
                    variant.SellableItem.Deactivate();
                }
            }
        }

        // 6. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new DeleteSneakerResult { Success = true, Message = "Xóa sản phẩm thành công." };
    }
}
