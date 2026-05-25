using MediatR;

public class IncrementAccessoryViewCountCommandHandler
    : IRequestHandler<IncrementAccessoryViewCountCommand, IncrementAccessoryViewCountResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public IncrementAccessoryViewCountCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IncrementAccessoryViewCountResult> Handle(
        IncrementAccessoryViewCountCommand command,
        CancellationToken cancellationToken
    )
    {
        var accessory = await _unitOfWork.Accessories.GetByIdAsync(command.Id);

        if (accessory == null || accessory.IsDeleted)
        {
            throw new NotFoundException($"Không tìm thấy phụ kiện với ID: {command.Id}");
        }

        // Increment view count
        accessory.ViewCount++;
        accessory.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync();

        return new IncrementAccessoryViewCountResult
        {
            Id = accessory.Id,
            ViewCount = accessory.ViewCount,
        };
    }
}
