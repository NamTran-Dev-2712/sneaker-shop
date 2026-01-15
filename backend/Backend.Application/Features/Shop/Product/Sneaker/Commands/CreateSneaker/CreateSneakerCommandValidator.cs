using FluentValidation;

public class CreateSneakerCommandValidator : AbstractValidator<CreateSneakerCommand>
{
    private readonly IBrandRepository _brandRepository;
    private readonly IBrandSeriesRepository _brandSeriesRepository;
    private readonly ISneakerRepository _sneakerRepository;
    private readonly IColorRepository _colorRepository;
    private readonly ISizeRepository _sizeRepository;

    public CreateSneakerCommandValidator(
        IBrandRepository brandRepository,
        IBrandSeriesRepository brandSeriesRepository,
        ISneakerRepository sneakerRepository,
        IColorRepository colorRepository,
        ISizeRepository sizeRepository
    )
    {
        _brandRepository = brandRepository;
        _brandSeriesRepository = brandSeriesRepository;
        _sneakerRepository = sneakerRepository;
        _colorRepository = colorRepository;
        _sizeRepository = sizeRepository;

        RuleFor(x => x.BrandId)
            .GreaterThan(0)
            .WithMessage("BrandId không hợp lệ.")
            .MustAsync(
                async (brandId, cancellation) =>
                {
                    var brand = await _brandRepository.GetByIdAsync(brandId);
                    return brand != null && !brand.IsDeleted && brand.IsActive;
                }
            )
            .WithMessage("Thương hiệu không tồn tại hoặc không hoạt động.");

        RuleFor(x => x.BrandSeriesId)
            .GreaterThan(0)
            .WithMessage("BrandSeriesId không hợp lệ.")
            .MustAsync(
                async (command, brandSeriesId, cancellation) =>
                {
                    var series = await _brandSeriesRepository.GetByIdAsync(brandSeriesId);
                    return series != null && series.BrandId == command.BrandId;
                }
            )
            .WithMessage("Series không tồn tại hoặc không thuộc thương hiệu đã chọn.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Tên sản phẩm là bắt buộc.")
            .MaximumLength(200)
            .WithMessage("Tên sản phẩm không được vượt quá 200 ký tự.")
            .MustAsync(
                async (name, cancellation) => !await _sneakerRepository.ExistsByNameAsync(name)
            )
            .WithMessage("Tên sản phẩm đã tồn tại.");

        RuleFor(x => x.MainImage)
            .NotNull()
            .WithMessage("Ảnh chính là bắt buộc.")
            .Must(file => file.Length > 0)
            .WithMessage("File ảnh không hợp lệ.")
            .Must(file => file.ContentType.StartsWith("image/"))
            .WithMessage("File phải là định dạng hình ảnh.");

        RuleFor(x => x.Colorways).NotEmpty().WithMessage("Phải có ít nhất một màu sản phẩm.");

        RuleForEach(x => x.Colorways)
            .ChildRules(colorway =>
            {
                colorway
                    .RuleFor(c => c)
                    .Must(c => c.ColorId.HasValue || c.NewColor != null)
                    .WithMessage("Phải chọn màu hiện có hoặc tạo màu mới.");

                colorway
                    .RuleFor(c => c.CoverImage)
                    .NotNull()
                    .WithMessage("Ảnh màu là bắt buộc.")
                    .Must(file => file.Length > 0)
                    .WithMessage("File ảnh không hợp lệ.");

                colorway
                    .RuleFor(c => c.Variants)
                    .NotEmpty()
                    .WithMessage("Phải có ít nhất một size cho mỗi màu.");

                colorway.When(
                    c => c.NewColor != null,
                    () =>
                    {
                        colorway
                            .RuleFor(c => c.NewColor!.Name)
                            .NotEmpty()
                            .WithMessage("Tên màu mới là bắt buộc.");

                        colorway
                            .RuleFor(c => c.NewColor!.Hex)
                            .NotEmpty()
                            .WithMessage("Mã hex là bắt buộc.")
                            .Matches(@"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")
                            .WithMessage("Mã hex không hợp lệ.");
                    }
                );

                colorway
                    .RuleForEach(c => c.Variants)
                    .ChildRules(variant =>
                    {
                        variant
                            .RuleFor(v => v.SizeId)
                            .GreaterThan(0)
                            .WithMessage("SizeId không hợp lệ.");

                        variant
                            .RuleFor(v => v.RetailPrice)
                            .GreaterThan(0)
                            .When(v => v.RetailPrice.HasValue)
                            .WithMessage("Giá bán lẻ phải lớn hơn 0.");

                        variant
                            .RuleFor(v => v.OnlinePrice)
                            .GreaterThan(0)
                            .When(v => v.OnlinePrice.HasValue)
                            .WithMessage("Giá online phải lớn hơn 0.");
                    });
            });
    }
}
