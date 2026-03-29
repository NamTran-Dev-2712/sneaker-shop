using FluentValidation;

public class ShipStoreOrderCommandValidator : AbstractValidator<ShipStoreOrderCommand>
{
    public ShipStoreOrderCommandValidator()
    {
        RuleFor(x => x.OrderId).GreaterThan(0).WithMessage("Mã đơn hàng không hợp lệ.");

        When(
            x => !string.IsNullOrEmpty(x.Carrier),
            () =>
            {
                RuleFor(x => x.Carrier)
                    .MaximumLength(100)
                    .WithMessage(
                        "Tên đơn vị vận chuyển không hợp lệ (tối đa 100 ký tự, không chứa ký tự đặc biệt)."
                    )
                    .Matches(@"^[\w\s\-\.]{1,100}$")
                    .WithMessage(
                        "Tên đơn vị vận chuyển không hợp lệ (tối đa 100 ký tự, không chứa ký tự đặc biệt)."
                    );
            }
        );

        When(
            x => !string.IsNullOrEmpty(x.TrackingCode),
            () =>
            {
                RuleFor(x => x.TrackingCode)
                    .MaximumLength(50)
                    .WithMessage(
                        "Mã vận đơn không hợp lệ (tối đa 50 ký tự, chỉ chứa chữ cái, số và dấu gạch ngang)."
                    )
                    .Matches(@"^[A-Za-z0-9\-]{1,50}$")
                    .WithMessage(
                        "Mã vận đơn không hợp lệ (tối đa 50 ký tự, chỉ chứa chữ cái, số và dấu gạch ngang)."
                    );
            }
        );
    }
}
