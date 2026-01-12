using MediatR;

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

        // 3. Soft delete
        brandSeries.IsDeleted = true;
        brandSeries.IsActive = false;
        brandSeries.UpdatedAt = DateTime.UtcNow;

        // 4. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new DeleteBrandSeriesResult
        {
            Success = true,
            Message = "Xóa dòng sản phẩm thành công.",
        };
    }
}
