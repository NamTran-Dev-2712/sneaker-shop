using MediatR;

public class CreateStoreCommandHandler : IRequestHandler<CreateStoreCommand, CreateStoreResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateStoreCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CreateStoreResult> Handle(
        CreateStoreCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Create store entity
        var store = new Store
        {
            Code = command.Code.Trim().ToUpper(),
            Name = command.Name.Trim(),
            Address = command.Address?.Trim(),
            Phone = command.Phone?.Trim(),
            IsActive = true,
            IsDeleted = false,
        };

        // 2. Save to database
        await _unitOfWork.Stores.AddAsync(store, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 3. Return result
        return new CreateStoreResult
        {
            Id = store.Id,
            Code = store.Code,
            Name = store.Name,
            Address = store.Address,
            Phone = store.Phone,
            IsActive = store.IsActive,
            CreatedAt = store.CreatedAt,
        };
    }
}
