using MediatR;

public class UpdateStoreCommandHandler : IRequestHandler<UpdateStoreCommand, UpdateStoreResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateStoreCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateStoreResult> Handle(
        UpdateStoreCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get existing store
        var store = await _unitOfWork.Stores.GetByIdAsync(command.Id, cancellationToken);
        if (store == null || store.IsDeleted)
        {
            throw new NotFoundException("Không tìm thấy cửa hàng.");
        }

        // 2. Update using domain method
        store.UpdateInfo(command.Name.Trim(), command.Address?.Trim(), command.Phone?.Trim());
        store.IsActive = command.IsActive;

        // 3. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 4. Return result
        return new UpdateStoreResult
        {
            Id = store.Id,
            Code = store.Code,
            Name = store.Name,
            Address = store.Address,
            Phone = store.Phone,
            IsActive = store.IsActive,
            UpdatedAt = store.UpdatedAt,
        };
    }
}
