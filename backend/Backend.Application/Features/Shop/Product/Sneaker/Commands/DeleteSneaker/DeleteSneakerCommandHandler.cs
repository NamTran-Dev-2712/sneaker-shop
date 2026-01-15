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

        // 2. Soft delete sneaker (use domain method)
        sneaker.SoftDelete();

        // 3. Deactivate all colorways
        foreach (var colorway in sneaker.Colorways)
        {
            colorway.Deactivate();

            // 4. Deactivate all sellable items for variants
            foreach (var variant in colorway.Variants)
            {
                if (variant.SellableItem != null)
                {
                    variant.SellableItem.Deactivate();
                }
            }
        }

        // 5. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new DeleteSneakerResult { Success = true, Message = "Xóa sản phẩm thành công." };
    }
}
