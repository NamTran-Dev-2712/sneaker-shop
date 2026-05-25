using FluentValidation;

public class CreateBrandSeriesCommandValidator : AbstractValidator<CreateBrandSeriesCommand>
{
    private readonly IBrandRepository _brandRepository;
    private readonly IBrandSeriesRepository _brandSeriesRepository;

    public CreateBrandSeriesCommandValidator(
        IBrandRepository brandRepository,
        IBrandSeriesRepository brandSeriesRepository
    )
    {
        _brandRepository = brandRepository;
        _brandSeriesRepository = brandSeriesRepository;

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

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Tên dòng sản phẩm là bắt buộc.")
            .MaximumLength(100)
            .WithMessage("Tên dòng sản phẩm không được vượt quá 100 ký tự.")
            .MustAsync(
                async (command, name, cancellation) =>
                    !await _brandSeriesRepository.ExistsByNameInBrandAsync(name, command.BrandId)
            )
            .WithMessage("Tên dòng sản phẩm đã tồn tại trong thương hiệu này.");
    }
}
