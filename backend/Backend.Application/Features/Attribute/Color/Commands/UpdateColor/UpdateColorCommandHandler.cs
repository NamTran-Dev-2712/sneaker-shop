using MediatR;

public class UpdateColorCommandHandler : IRequestHandler<UpdateColorCommand, UpdateColorResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ISlugService _slugService;

    public UpdateColorCommandHandler(IUnitOfWork unitOfWork, ISlugService slugService)
    {
        _unitOfWork = unitOfWork;
        _slugService = slugService;
    }

    public async Task<UpdateColorResult> Handle(
        UpdateColorCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get existing color
        var color = await _unitOfWork.Colors.GetByIdAsync(command.Id, cancellationToken);
        if (color == null)
        {
            throw new NotFoundException("Không tìm thấy màu.");
        }

        // 2. Check if name changed, regenerate slug
        var newSlug = color.Slug;
        if (!color.Name.Equals(command.Name.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            newSlug = await _slugService.GenerateUniqueSlugAsync(
                command.Name,
                async (s) => await _unitOfWork.Colors.ExistsBySlugAsync(s, command.Id)
            );
        }

        // 3. Update using domain method
        color.UpdateInfo(command.Name.Trim(), newSlug, command.Hex.Trim().ToUpper());

        // 4. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 5. Return result
        return new UpdateColorResult
        {
            Id = color.Id,
            Name = color.Name,
            Slug = color.Slug,
            Hex = color.Hex,
            UpdatedAt = color.UpdatedAt,
        };
    }
}
