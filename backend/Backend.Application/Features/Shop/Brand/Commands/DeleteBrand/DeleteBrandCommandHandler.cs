using MediatR;

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

        // 2. Soft delete brand
        brand.IsDeleted = true;
        brand.IsActive = false;
        brand.UpdatedAt = DateTime.UtcNow;

        // 3. Soft delete all brand series
        foreach (var series in brand.BrandSeries)
        {
            series.IsDeleted = true;
            series.IsActive = false;
            series.UpdatedAt = DateTime.UtcNow;
        }

        // 4. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new DeleteBrandResult { Success = true, Message = "Xóa thương hiệu thành công." };
    }
}
