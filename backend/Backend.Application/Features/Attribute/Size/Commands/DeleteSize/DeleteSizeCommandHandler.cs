using MediatR;

public class DeleteSizeCommandHandler : IRequestHandler<DeleteSizeCommand, DeleteSizeResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteSizeCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<DeleteSizeResult> Handle(
        DeleteSizeCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get size
        var size = await _unitOfWork.Sizes.GetByIdAsync(command.Id, cancellationToken);
        if (size == null)
        {
            throw new NotFoundException("Không tìm thấy size.");
        }

        // 2. Check for dependent products
        var hasDependents = await _unitOfWork.Sizes.HasDependentProductsAsync(command.Id);
        if (hasDependents)
        {
            throw new BadException("Không thể xóa size đang được sử dụng bởi sản phẩm.");
        }

        // 3. Hard delete (Size doesn't have IsDeleted)
        _unitOfWork.Sizes.Remove(size);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new DeleteSizeResult { Success = true, Message = "Xóa size thành công." };
    }
}
