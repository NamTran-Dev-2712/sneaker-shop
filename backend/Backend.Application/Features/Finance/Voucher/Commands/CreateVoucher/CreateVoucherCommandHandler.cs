using MediatR;

public class CreateVoucherCommandHandler
    : IRequestHandler<CreateVoucherCommand, CreateVoucherResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateVoucherCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CreateVoucherResult> Handle(
        CreateVoucherCommand command,
        CancellationToken cancellationToken
    )
    {
        var code = command.Code.Trim().ToUpper();

        var exists = await _unitOfWork.Vouchers.ExistsAsync(v => v.Code == code);
        if (exists)
            throw new ConflictException($"Mã voucher '{code}' đã tồn tại.");

        var voucher = new Voucher
        {
            Code = code,
            DiscountType = command.DiscountType,
            DiscountValue = command.DiscountValue,
            MaxDiscount = command.MaxDiscount,
            MinOrderTotal = command.MinOrderTotal,
            Scope = command.Scope,
            UsageLimit = command.UsageLimit,
            UsagePerCustomer = command.UsagePerCustomer,
            StartsAt = command.StartsAt.HasValue
                ? DateTime.SpecifyKind(command.StartsAt.Value, DateTimeKind.Utc)
                : null,
            EndsAt = command.EndsAt.HasValue
                ? DateTime.SpecifyKind(command.EndsAt.Value, DateTimeKind.Utc)
                : null,
            IsActive = command.IsActive,
        };

        await _unitOfWork.Vouchers.AddAsync(voucher, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new CreateVoucherResult
        {
            Id = voucher.Id,
            Code = voucher.Code,
            DiscountType = voucher.DiscountType.ToString(),
            DiscountValue = voucher.DiscountValue,
            MaxDiscount = voucher.MaxDiscount,
            MinOrderTotal = voucher.MinOrderTotal,
            Scope = voucher.Scope.ToString(),
            UsageLimit = voucher.UsageLimit,
            UsagePerCustomer = voucher.UsagePerCustomer,
            StartsAt = voucher.StartsAt,
            EndsAt = voucher.EndsAt,
            IsActive = voucher.IsActive,
            CreatedAt = voucher.CreatedAt,
        };
    }
}
