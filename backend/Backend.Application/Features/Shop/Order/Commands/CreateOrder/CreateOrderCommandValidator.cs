using FluentValidation;

public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderCommandValidator()
    {
        RuleFor(x => x.IdempotencyKey)
            .NotEmpty()
            .WithMessage("Idempotency key là bắt buộc.")
            .MaximumLength(72)
            .WithMessage("Idempotency key không được vượt quá 72 ký tự.");

        RuleFor(x => x.FulfillmentType)
            .NotEmpty()
            .WithMessage("Hình thức giao hàng là bắt buộc.")
            .Must(v =>
                v == nameof(global::FulfillmentType.DELIVERY)
                || v == nameof(global::FulfillmentType.PICKUP)
            )
            .WithMessage("Hình thức giao hàng phải là DELIVERY hoặc PICKUP.");

        RuleFor(x => x.PaymentMethod)
            .NotEmpty()
            .WithMessage("Phương thức thanh toán là bắt buộc.")
            .Must(v => Enum.TryParse<global::PaymentMethod>(v, true, out _))
            .WithMessage("Phương thức thanh toán không hợp lệ.");

        // Delivery-specific validations
        When(
            x => x.FulfillmentType == nameof(global::FulfillmentType.DELIVERY),
            () =>
            {
                RuleFor(x => x.RecipientName)
                    .NotEmpty()
                    .WithMessage("Tên người nhận là bắt buộc khi giao hàng.")
                    .MaximumLength(200)
                    .WithMessage("Tên người nhận không được vượt quá 200 ký tự.");

                RuleFor(x => x.RecipientPhone)
                    .NotEmpty()
                    .WithMessage("Số điện thoại người nhận là bắt buộc khi giao hàng.")
                    .Matches(@"^(\+84|0)\d{9,10}$")
                    .WithMessage("Số điện thoại không hợp lệ.");

                RuleFor(x => x.Province)
                    .NotEmpty()
                    .WithMessage("Tỉnh/thành phố là bắt buộc khi giao hàng.");

                RuleFor(x => x.Ward).NotEmpty().WithMessage("Phường/xã là bắt buộc khi giao hàng.");

                RuleFor(x => x.AddressDetail)
                    .NotEmpty()
                    .WithMessage("Địa chỉ chi tiết là bắt buộc khi giao hàng.")
                    .MaximumLength(500)
                    .WithMessage("Địa chỉ không được vượt quá 500 ký tự.");
            }
        );

        // Pickup-specific validations
        // PickupStoreId is resolved from inventory in the handler.
        // Recipient name + phone are required so staff can verify the person collecting.
        When(
            x => x.FulfillmentType == nameof(global::FulfillmentType.PICKUP),
            () =>
            {
                RuleFor(x => x.RecipientName)
                    .NotEmpty()
                    .WithMessage("Tên người nhận là bắt buộc khi nhận tại cửa hàng.")
                    .MaximumLength(200)
                    .WithMessage("Tên người nhận không được vượt quá 200 ký tự.");

                RuleFor(x => x.RecipientPhone)
                    .NotEmpty()
                    .WithMessage("Số điện thoại người nhận là bắt buộc khi nhận tại cửa hàng.")
                    .Matches(@"^(\+84|0)\d{9,10}$")
                    .WithMessage("Số điện thoại không hợp lệ.");
            }
        );

        // Items
        RuleFor(x => x.Items).NotEmpty().WithMessage("Đơn hàng phải có ít nhất 1 sản phẩm.");

        RuleForEach(x => x.Items)
            .ChildRules(item =>
            {
                item.RuleFor(i => i.SellableItemId)
                    .GreaterThan(0)
                    .WithMessage("SellableItemId không hợp lệ.");

                item.RuleFor(i => i.InventoryId)
                    .GreaterThan(0)
                    .WithMessage("InventoryId không hợp lệ.");

                item.RuleFor(i => i.Quantity)
                    .GreaterThan(0)
                    .WithMessage("Số lượng phải lớn hơn 0.");

                item.RuleFor(i => i.ProductName)
                    .NotEmpty()
                    .WithMessage("Tên sản phẩm snapshot là bắt buộc.");

                item.RuleFor(i => i.Sku).NotEmpty().WithMessage("SKU snapshot là bắt buộc.");

                item.RuleFor(i => i.UnitPrice)
                    .GreaterThan(0)
                    .WithMessage("Đơn giá phải lớn hơn 0.");
            });

        RuleFor(x => x.Note)
            .MaximumLength(1000)
            .WithMessage("Ghi chú không được vượt quá 1000 ký tự.")
            .When(x => !string.IsNullOrEmpty(x.Note));

        RuleFor(x => x.VoucherCode)
            .MaximumLength(50)
            .WithMessage("Mã voucher không được vượt quá 50 ký tự.")
            .When(x => !string.IsNullOrWhiteSpace(x.VoucherCode));
    }
}
