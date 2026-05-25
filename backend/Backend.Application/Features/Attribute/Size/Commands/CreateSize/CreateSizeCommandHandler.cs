using MediatR;

public class CreateSizeCommandHandler : IRequestHandler<CreateSizeCommand, CreateSizeResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateSizeCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CreateSizeResult> Handle(
        CreateSizeCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Create size entity
        var size = new Size { System = command.System.Trim().ToUpper(), Value = command.Value };

        // 2. Save to database
        await _unitOfWork.Sizes.AddAsync(size, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 3. Return result
        return new CreateSizeResult
        {
            Id = size.Id,
            System = size.System,
            Value = size.Value,
            CreatedAt = size.CreatedAt,
        };
    }
}
