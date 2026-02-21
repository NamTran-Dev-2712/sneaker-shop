using FluentValidation;

public class UpdateAvatarCommandValidator : AbstractValidator<UpdateAvatarCommand>
{
    private static readonly string[] AllowedContentTypes =
    [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
    ];

    private const long MaxFileSize = 5 * 1024 * 1024; // 5MB

    public UpdateAvatarCommandValidator()
    {
        RuleFor(x => x.AccountId).GreaterThan(0).WithMessage("Id tài khoản không hợp lệ.");

        RuleFor(x => x.Avatar)
            .NotNull()
            .WithMessage("Ảnh đại diện là bắt buộc.")
            .Must(file => file.Length > 0)
            .WithMessage("Tệp ảnh đại diện không hợp lệ.")
            .Must(file => file.Length <= MaxFileSize)
            .WithMessage("Kích thước ảnh không được vượt quá 5MB.")
            .Must(file => AllowedContentTypes.Contains(file.ContentType.ToLowerInvariant()))
            .WithMessage("Chỉ chấp nhận file ảnh định dạng JPG, PNG, WEBP, GIF.");
    }
}
