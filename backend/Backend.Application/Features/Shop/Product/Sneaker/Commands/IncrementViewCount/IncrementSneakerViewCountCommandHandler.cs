using MediatR;

public class IncrementSneakerViewCountCommandHandler
    : IRequestHandler<IncrementSneakerViewCountCommand, IncrementSneakerViewCountResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public IncrementSneakerViewCountCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IncrementSneakerViewCountResult> Handle(
        IncrementSneakerViewCountCommand command,
        CancellationToken cancellationToken
    )
    {
        var sneaker = await _unitOfWork.Sneakers.GetByIdAsync(command.Id);

        if (sneaker == null || sneaker.IsDeleted)
        {
            throw new NotFoundException($"Không tìm thấy sneaker với ID: {command.Id}");
        }

        // Increment view count
        sneaker.ViewCount++;
        sneaker.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync();

        return new IncrementSneakerViewCountResult
        {
            Id = sneaker.Id,
            ViewCount = sneaker.ViewCount,
        };
    }
}
