using MediatR;

public class CreateSlideCommandHandler : IRequestHandler<CreateSlideCommand, CreateSlideResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IImageService _imageService;

    public CreateSlideCommandHandler(IUnitOfWork unitOfWork, IImageService imageService)
    {
        _unitOfWork = unitOfWork;
        _imageService = imageService;
    }

    public async Task<CreateSlideResult> Handle(
        CreateSlideCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Upload image to Cloudinary
        var imageResult = await _imageService.UploadImageAsync(
            command.Image,
            CloudinaryFolder.Slides
        );

        // 2. Create slide entity
        var slide = new Slide
        {
            Title = command.Title.Trim(),
            Subtitle = command.Subtitle.Trim(),
            description = command.Description.Trim(),
            ImageUrl = imageResult.Url,
            ButtonText = command.ButtonText.Trim(),
            ButtonUrl = command.ButtonUrl.Trim(),
        };

        // 3. Save to database
        await _unitOfWork.Slides.AddAsync(slide, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 4. Return result
        return new CreateSlideResult
        {
            Id = slide.Id,
            Title = slide.Title,
            Subtitle = slide.Subtitle,
            Description = slide.description,
            ImageUrl = slide.ImageUrl,
            ButtonText = slide.ButtonText,
            ButtonUrl = slide.ButtonUrl,
            CreatedAt = slide.CreatedAt,
        };
    }
}
