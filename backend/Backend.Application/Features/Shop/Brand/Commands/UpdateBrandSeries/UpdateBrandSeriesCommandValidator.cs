using FluentValidation;

public class UpdateBrandSeriesCommandValidator : AbstractValidator<UpdateBrandSeriesCommand>
{
    private readonly IBrandSeriesRepository _brandSeriesRepository;

    public UpdateBrandSeriesCommandValidator(IBrandSeriesRepository brandSeriesRepository)
    {
        _brandSeriesRepository = brandSeriesRepository;

        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id không hợp lệ.");

        RuleFor(x => x.BrandId).GreaterThan(0).WithMessage("BrandId không hợp lệ.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Tên dòng sản phẩm là bắt buộc.")
            .MaximumLength(100)
            .WithMessage("Tên dòng sản phẩm không được vượt quá 100 ký tự.")
            .MustAsync(
                async (command, name, cancellation) =>
                    !await _brandSeriesRepository.ExistsByNameInBrandAsync(
                        name,
                        command.BrandId,
                        command.Id
                    )
            )
            .WithMessage("Tên dòng sản phẩm đã tồn tại trong thương hiệu này.");
    }
}
