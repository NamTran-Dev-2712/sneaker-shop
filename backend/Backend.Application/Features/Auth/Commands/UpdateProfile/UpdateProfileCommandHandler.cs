using MediatR;

public class UpdateProfileCommandHandler
    : IRequestHandler<UpdateProfileCommand, UpdateProfileResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IImageService _imageService;

    public UpdateProfileCommandHandler(IUnitOfWork unitOfWork, IImageService imageService)
    {
        _unitOfWork = unitOfWork;
        _imageService = imageService;
    }

    public async Task<UpdateProfileResult> Handle(
        UpdateProfileCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get existing account
        var account = await _unitOfWork.Repository<Account>().GetByIdAsync(command.AccountId);
        if (account == null || !account.IsActive)
        {
            throw new NotFoundException("Tài khoản không tồn tại hoặc không hoạt động.");
        }

        // 2. Upload new avatar if provided (auto-delete old one)
        ImageUploadResult? newAvatarUpload = null;
        if (command.Avatar != null)
        {
            newAvatarUpload = await _imageService.ReplaceImageAsync(
                command.Avatar,
                CloudinaryFolder.Avatars,
                account.PublicIdAvatar
            );
        }

        // 3. Update account profile
        account.UpdateProfile(
            command.Email,
            command.Phone,
            newAvatarUpload?.Url ?? account.Avatar,
            newAvatarUpload?.PublicId ?? account.PublicIdAvatar
        );

        // 4. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 5. Return result
        return new UpdateProfileResult
        {
            AccountId = account.Id,
            Email = account.Email,
            Phone = account.Phone,
            Avatar = account.Avatar,
            UpdatedAt = account.UpdatedAt,
        };
    }
}
