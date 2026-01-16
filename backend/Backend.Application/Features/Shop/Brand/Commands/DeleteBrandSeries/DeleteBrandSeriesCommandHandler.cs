using MediatR;
using Microsoft.EntityFrameworkCore;

public class DeleteBrandSeriesCommandHandler
    : IRequestHandler<DeleteBrandSeriesCommand, DeleteBrandSeriesResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteBrandSeriesCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<DeleteBrandSeriesResult> Handle(
        DeleteBrandSeriesCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get brand series
        var brandSeries = await _unitOfWork.BrandSeries.GetByIdAsync(command.Id, cancellationToken);
        if (brandSeries == null || brandSeries.IsDeleted)
        {
            throw new NotFoundException("Không tìm thấy dòng sản phẩm.");
        }

        // 2. Verify brand matches
        if (brandSeries.BrandId != command.BrandId)
        {
            throw new BadException("Dòng sản phẩm không thuộc thương hiệu này.");
        }

        // 3. Check if brand series has any non-deleted sneakers
        var hasActiveSneakers = await _unitOfWork
            .Sneakers.Query()
            .AnyAsync(s => s.BrandSeriesId == command.Id && !s.IsDeleted, cancellationToken);

        if (hasActiveSneakers)
        {
            throw new BadException(
                "Không thể xóa dòng sản phẩm này vì đang có sản phẩm liên kết. Vui lòng xóa tất cả sản phẩm trước."
            );
        }

        // 4. Soft delete
        brandSeries.IsDeleted = true;
        brandSeries.IsActive = false;
        brandSeries.UpdatedAt = DateTime.UtcNow;

        // 5. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new DeleteBrandSeriesResult
        {
            Success = true,
            Message = "Xóa dòng sản phẩm thành công.",
        };
    }
}
