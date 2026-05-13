using FluentValidation;

public class GetStoreOrdersQueryValidator : AbstractValidator<GetStoreOrdersQuery>
{
    public GetStoreOrdersQueryValidator()
    {
        RuleFor(x => x.StoreId)
            .GreaterThan(0)
            .WithMessage("Không thể xác định chi nhánh làm việc của nhân viên.");

        RuleFor(x => x.PageNumber).GreaterThan(0).WithMessage("Số trang phải lớn hơn 0.");

        RuleFor(x => x.PageSize).GreaterThan(0).WithMessage("Kích thước trang phải lớn hơn 0.");

        RuleFor(x => x)
            .Must(x => !x.FromDate.HasValue || !x.ToDate.HasValue || x.FromDate <= x.ToDate)
            .WithMessage("Khoảng thời gian lọc không hợp lệ.");
    }
}
