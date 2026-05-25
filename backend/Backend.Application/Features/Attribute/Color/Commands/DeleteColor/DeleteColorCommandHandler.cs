using MediatR;

public class DeleteColorCommandHandler : IRequestHandler<DeleteColorCommand, DeleteColorResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteColorCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<DeleteColorResult> Handle(
        DeleteColorCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get color
        var color = await _unitOfWork.Colors.GetByIdAsync(command.Id, cancellationToken);
        if (color == null)
        {
            throw new NotFoundException("Không tìm thấy màu.");
        }

        // 2. Check for dependent products
        var hasDependents = await _unitOfWork.Colors.HasDependentProductsAsync(command.Id);
        if (hasDependents)
        {
            throw new BadException("Không thể xóa màu đang được sử dụng bởi sản phẩm.");
        }

        // 3. Hard delete (Color doesn't have IsDeleted)
        _unitOfWork.Colors.Remove(color);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new DeleteColorResult { Success = true, Message = "Xóa màu thành công." };
    }
}
