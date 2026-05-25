using MediatR;

public class UpdateVoucherCommandHandler
    : IRequestHandler<UpdateVoucherCommand, UpdateVoucherResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateVoucherCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateVoucherResult> Handle(
        UpdateVoucherCommand command,
        CancellationToken cancellationToken
    )
    {
        var voucher = await _unitOfWork.Vouchers.GetByIdAsync(command.Id, cancellationToken);
        if (voucher == null)
            throw new NotFoundException("Không tìm thấy voucher.");

        voucher.DiscountType = command.DiscountType;
        voucher.DiscountValue = command.DiscountValue;
        voucher.MaxDiscount = command.MaxDiscount;
        voucher.MinOrderTotal = command.MinOrderTotal;
        voucher.Scope = command.Scope;
        voucher.UsageLimit = command.UsageLimit;
        voucher.UsagePerCustomer = command.UsagePerCustomer;
        voucher.StartsAt = command.StartsAt.HasValue
            ? DateTime.SpecifyKind(command.StartsAt.Value, DateTimeKind.Utc)
            : null;
        voucher.EndsAt = command.EndsAt.HasValue
            ? DateTime.SpecifyKind(command.EndsAt.Value, DateTimeKind.Utc)
            : null;
        voucher.IsActive = command.IsActive;
        voucher.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new UpdateVoucherResult
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
            UpdatedAt = voucher.UpdatedAt,
        };
    }
}
