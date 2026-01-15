using FluentValidation;

public class UpdateSneakerCommandValidator : AbstractValidator<UpdateSneakerCommand>
{
    private readonly IBrandRepository _brandRepository;
    private readonly IBrandSeriesRepository _brandSeriesRepository;
    private readonly ISneakerRepository _sneakerRepository;

    public UpdateSneakerCommandValidator(
        IBrandRepository brandRepository,
        IBrandSeriesRepository brandSeriesRepository,
        ISneakerRepository sneakerRepository
    )
    {
        _brandRepository = brandRepository;
        _brandSeriesRepository = brandSeriesRepository;
        _sneakerRepository = sneakerRepository;

        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id không hợp lệ.");

        RuleFor(x => x.BrandId)
            .GreaterThan(0)
            .WithMessage("BrandId không hợp lệ.")
            .MustAsync(
                async (brandId, cancellation) =>
                {
                    var brand = await _brandRepository.GetByIdAsync(brandId);
                    return brand != null && !brand.IsDeleted;
                }
            )
            .WithMessage("Thương hiệu không tồn tại.");

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
                async (command, name, cancellation) =>
                    !await _sneakerRepository.ExistsByNameAsync(name, command.Id)
            )
            .WithMessage("Tên sản phẩm đã tồn tại.");

        When(
            x => x.MainImage != null,
            () =>
            {
                RuleFor(x => x.MainImage)
                    .Must(file => file!.Length > 0)
                    .WithMessage("File ảnh không hợp lệ.")
                    .Must(file => file!.ContentType.StartsWith("image/"))
                    .WithMessage("File phải là định dạng hình ảnh.");
            }
        );

        // Validate colorways if provided
        When(
            x => x.Colorways != null && x.Colorways.Count > 0,
            () =>
            {
                RuleForEach(x => x.Colorways)
                    .ChildRules(colorway =>
                    {
                        // New colorway requires color info
                        colorway.When(
                            c => c.Id == null,
                            () =>
                            {
                                colorway
                                    .RuleFor(c => c)
                                    .Must(c => c.ColorId.HasValue || c.NewColor != null)
                                    .WithMessage("Colorway mới phải có ColorId hoặc NewColor.");

                                colorway
                                    .RuleFor(c => c.CoverImage)
                                    .NotNull()
                                    .WithMessage("Colorway mới phải có ảnh bìa.");
                            }
                        );

                        // Validate new color if provided
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

                        // Validate variants if provided
                        colorway.When(
                            c => c.Variants != null && c.Variants.Count > 0,
                            () =>
                            {
                                colorway
                                    .RuleForEach(c => c.Variants)
                                    .ChildRules(variant =>
                                    {
                                        // New variant requires sizeId
                                        variant.When(
                                            v => v.Id == null,
                                            () =>
                                            {
                                                variant
                                                    .RuleFor(v => v.SizeId)
                                                    .NotNull()
                                                    .WithMessage("Variant mới phải có SizeId.")
                                                    .GreaterThan(0)
                                                    .WithMessage("SizeId không hợp lệ.");
                                            }
                                        );

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
                            }
                        );
                    });
            }
        );
    }
}
