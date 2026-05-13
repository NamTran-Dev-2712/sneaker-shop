using MediatR;
using Microsoft.EntityFrameworkCore;

public class ValidateVoucherQueryHandler
    : IRequestHandler<ValidateVoucherQuery, ValidateVoucherResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public ValidateVoucherQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ValidateVoucherResult> Handle(
        ValidateVoucherQuery query,
        CancellationToken cancellationToken
    )
    {
        var code = query.Code.Trim().ToUpperInvariant();

        var voucher = await _unitOfWork
            .Vouchers.Query()
            .AsNoTracking()
            .Include(v => v.Redemptions)
            .FirstOrDefaultAsync(v => v.Code == code, cancellationToken);

        if (voucher == null)
            throw new NotFoundException("Mã voucher không hợp lệ.");

        // Validates all rules and throws BadException with user-facing message on violation.
        // No DB writes — safe dry-run preview.
        var discountAmount = VoucherValidationHelper.Validate(
            voucher,
            query.Subtotal,
            query.CustomerId
        );

        return new ValidateVoucherResult
        {
            VoucherCode = voucher.Code,
            DiscountType = voucher.DiscountType.ToString(),
            DiscountValue = voucher.DiscountValue,
            DiscountAmount = discountAmount,
            Message = $"Áp dụng mã giảm giá thành công. Giảm {discountAmount:N0} ₫.",
        };
    }
}
