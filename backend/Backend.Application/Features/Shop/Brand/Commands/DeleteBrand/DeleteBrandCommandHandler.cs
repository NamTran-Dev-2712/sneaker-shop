using MediatR;
using Microsoft.EntityFrameworkCore;

public class DeleteBrandCommandHandler : IRequestHandler<DeleteBrandCommand, DeleteBrandResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteBrandCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<DeleteBrandResult> Handle(
        DeleteBrandCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get brand with series
        var brand = await _unitOfWork.Brands.GetByIdAsync(command.Id, b => b.BrandSeries);
        if (brand == null || brand.IsDeleted)
        {
            throw new NotFoundException("Không tìm thấy thương hiệu.");
        }

        // 2. Check if brand has any non-deleted sneakers
        var hasActiveSneakers = await _unitOfWork
            .Sneakers.Query()
            .AnyAsync(s => s.BrandId == command.Id && !s.IsDeleted, cancellationToken);

        if (hasActiveSneakers)
        {
            throw new BadException(
                "Không thể xóa thương hiệu này vì đang có sản phẩm liên kết. Vui lòng xóa tất cả sản phẩm trước."
            );
        }

        // 3. Soft delete brand
        brand.IsDeleted = true;
        brand.IsActive = false;
        brand.UpdatedAt = DateTime.UtcNow;

        // 4. Soft delete all brand series
        foreach (var series in brand.BrandSeries)
        {
            series.IsDeleted = true;
            series.IsActive = false;
            series.UpdatedAt = DateTime.UtcNow;
        }

        // 5. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new DeleteBrandResult { Success = true, Message = "Xóa thương hiệu thành công." };
    }
}
