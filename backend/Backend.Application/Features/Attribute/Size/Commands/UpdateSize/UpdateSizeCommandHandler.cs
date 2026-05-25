using MediatR;

public class UpdateSizeCommandHandler : IRequestHandler<UpdateSizeCommand, UpdateSizeResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateSizeCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateSizeResult> Handle(
        UpdateSizeCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get existing size
        var size = await _unitOfWork.Sizes.GetByIdAsync(command.Id, cancellationToken);
        if (size == null)
        {
            throw new NotFoundException("Không tìm thấy size.");
        }

        // 2. Update using domain method
        size.UpdateInfo(command.System.Trim().ToUpper(), command.Value);

        // 3. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 4. Return result
        return new UpdateSizeResult
        {
            Id = size.Id,
            System = size.System,
            Value = size.Value,
            UpdatedAt = size.UpdatedAt,
        };
    }
}
