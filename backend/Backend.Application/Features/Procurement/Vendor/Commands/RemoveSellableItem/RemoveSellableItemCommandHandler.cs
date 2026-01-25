using MediatR;

public class RemoveSellableItemCommandHandler
    : IRequestHandler<RemoveSellableItemCommand, RemoveSellableItemResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public RemoveSellableItemCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<RemoveSellableItemResult> Handle(
        RemoveSellableItemCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get vendor price
        var vendorPrice = await _unitOfWork.VendorPrices.GetByIdAsync(
            command.Id,
            cancellationToken
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

        // 3. Hard delete vendor price (no dependencies)
        _unitOfWork.VendorPrices.Remove(vendorPrice);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new RemoveSellableItemResult
        {
            Success = true,
            Message = "Xóa giá nhà cung cấp thành công.",
        };
    }
}
