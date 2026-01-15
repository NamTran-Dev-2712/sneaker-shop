using MediatR;

public class CreateColorCommandHandler : IRequestHandler<CreateColorCommand, CreateColorResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ISlugService _slugService;

    public CreateColorCommandHandler(IUnitOfWork unitOfWork, ISlugService slugService)
    {
        _unitOfWork = unitOfWork;
        _slugService = slugService;
    }

    public async Task<CreateColorResult> Handle(
        CreateColorCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Generate unique slug
        var slug = await _slugService.GenerateUniqueSlugAsync(
            command.Name,
            async (s) => await _unitOfWork.Colors.ExistsBySlugAsync(s)
        );

        // 2. Create color entity
        var color = new Color
        {
            Name = command.Name.Trim(),
            Slug = slug,
            Hex = command.Hex.Trim().ToUpper(),
        };

        // 3. Save to database
        await _unitOfWork.Colors.AddAsync(color, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 4. Return result
        return new CreateColorResult
        {
            Id = color.Id,
            Name = color.Name,
            Slug = color.Slug,
            Hex = color.Hex,
            CreatedAt = color.CreatedAt,
        };
    }
}
