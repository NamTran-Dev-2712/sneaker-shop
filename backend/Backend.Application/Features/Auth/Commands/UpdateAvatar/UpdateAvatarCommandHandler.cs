using MediatR;

public class UpdateAvatarCommandHandler : IRequestHandler<UpdateAvatarCommand, UpdateAvatarResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IImageService _imageService;

    public UpdateAvatarCommandHandler(IUnitOfWork unitOfWork, IImageService imageService)
    {
        _unitOfWork = unitOfWork;
        _imageService = imageService;
    }

    public async Task<UpdateAvatarResult> Handle(
        UpdateAvatarCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get existing account
        var account = await _unitOfWork.Repository<Account>().GetByIdAsync(command.AccountId);
        if (account == null || !account.IsActive)
        {
            throw new NotFoundException("Tài khoản không tồn tại hoặc không hoạt động.");
        }

        // 2. Upload new avatar (auto-delete old one via ReplaceImageAsync)
        var uploadResult = await _imageService.ReplaceImageAsync(
            command.Avatar,
            CloudinaryFolder.Avatars,
            account.PublicIdAvatar
        );

        // 3. Update account avatar fields
        account.UpdateProfile(
            account.Email,
            account.Phone,
            uploadResult.Url,
            uploadResult.PublicId
        );

        // 4. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 5. Return result
        return new UpdateAvatarResult
        {
            AccountId = account.Id,
            Avatar = uploadResult.Url,
            UpdatedAt = account.UpdatedAt,
        };
    }
}
