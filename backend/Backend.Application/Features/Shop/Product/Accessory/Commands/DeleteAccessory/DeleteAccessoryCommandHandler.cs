using MediatR;
using Microsoft.EntityFrameworkCore;

public class DeleteAccessoryCommandHandler
    : IRequestHandler<DeleteAccessoryCommand, DeleteAccessoryResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteAccessoryCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<DeleteAccessoryResult> Handle(
        DeleteAccessoryCommand command,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            // 1. Get existing accessory
            var accessory =
                await _unitOfWork.Accessories.GetByIdAsync(command.Id, cancellationToken)
                ?? throw new NotFoundException("Không tìm thấy sản phẩm phụ kiện.");

            // 2. Get SellableItem for this accessory
            var sellableItem = await _unitOfWork.SellableItems.GetByAccessoryIdAsync(
                accessory.Id,
                cancellationToken
            );

            // 3. Check if there is inventory for this sellable item
            if (sellableItem != null)
            {
                var hasInventory = await _unitOfWork
                    .Inventories.Query()
                    .AnyAsync(
                        inv => inv.SellableItemId == sellableItem.Id && inv.OnHand > 0,
                        cancellationToken
                    );

                if (hasInventory)
                {
                    throw new BadException(
                        "Không thể xóa sản phẩm vì vẫn còn tồn kho. Vui lòng xử lý hết hàng tồn kho trước."
                    );
                }

                // 4. Deactivate SellableItem
                sellableItem.Deactivate();
            }

            // 5. Soft delete the accessory
            accessory.SoftDelete();

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new DeleteAccessoryResult
            {
                Id = accessory.Id,
                Message = $"Đã xóa sản phẩm '{accessory.Name}' thành công.",
            };
        });
    }
}
