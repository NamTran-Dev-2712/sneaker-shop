using MediatR;

public class DeleteStoreCommandHandler : IRequestHandler<DeleteStoreCommand, DeleteStoreResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteStoreCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<DeleteStoreResult> Handle(
        DeleteStoreCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get store
        var store = await _unitOfWork.Stores.GetByIdAsync(command.Id, cancellationToken);
        if (store == null || store.IsDeleted)
        {
            throw new NotFoundException("Không tìm thấy cửa hàng.");
        }

        // 2. Soft delete
        store.IsDeleted = true;
        store.IsActive = false;
        store.UpdatedAt = DateTime.UtcNow;

        // 3. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new DeleteStoreResult { Success = true, Message = "Xóa cửa hàng thành công." };
    }
}
