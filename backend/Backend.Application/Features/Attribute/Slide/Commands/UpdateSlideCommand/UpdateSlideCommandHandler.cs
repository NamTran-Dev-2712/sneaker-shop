using MediatR;

public class UpdateSlideCommandHandler : IRequestHandler<UpdateSlideCommand, UpdateSlideResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IImageService _imageService;

    public UpdateSlideCommandHandler(IUnitOfWork unitOfWork, IImageService imageService)
    {
        _unitOfWork = unitOfWork;
        _imageService = imageService;
    }

    public async Task<UpdateSlideResult> Handle(
        UpdateSlideCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get existing slide
        var slide = await _unitOfWork.Slides.GetByIdAsync(command.Id, cancellationToken);
        if (slide == null)
        {
            throw new NotFoundException("Không tìm thấy slide.");
        }

        // 2. Upload new image if provided
        var imageUrl = slide.ImageUrl;
        if (command.Image != null)
        {
            var imageResult = await _imageService.UploadImageAsync(
                command.Image,
                CloudinaryFolder.Slides
            );
            imageUrl = imageResult.Url;
        }

        // 3. Update using domain method
        slide.UpdateInfo(
            command.Title.Trim(),
            command.Subtitle.Trim(),
            command.Description.Trim(),
            imageUrl,
            command.ButtonText.Trim(),
            command.ButtonUrl.Trim()
        );

        // 4. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 5. Return result
        return new UpdateSlideResult
        {
            Id = slide.Id,
            Title = slide.Title,
            Subtitle = slide.Subtitle,
            Description = slide.description,
            ImageUrl = slide.ImageUrl,
            ButtonText = slide.ButtonText,
            ButtonUrl = slide.ButtonUrl,
            UpdatedAt = slide.UpdatedAt,
        };
    }
}
