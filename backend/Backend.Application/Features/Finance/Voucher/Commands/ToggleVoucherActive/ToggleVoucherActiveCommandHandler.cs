using MediatR;
using Microsoft.EntityFrameworkCore;

public class ToggleVoucherActiveCommandHandler
    : IRequestHandler<ToggleVoucherActiveCommand, ToggleVoucherActiveResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public ToggleVoucherActiveCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ToggleVoucherActiveResult> Handle(
        ToggleVoucherActiveCommand command,
        CancellationToken cancellationToken
    )
    {
        var voucher = await _unitOfWork.Vouchers.GetByIdAsync(command.Id, cancellationToken);
        if (voucher == null)
            throw new NotFoundException("Không tìm thấy voucher.");

        if (voucher.IsActive)
            voucher.Deactivate();
        else
            voucher.Activate();

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var usageCount = await _unitOfWork
            .VoucherRedemptions.Query()
            .CountAsync(r => r.VoucherId == voucher.Id, cancellationToken);

        var computedStatus = GetVoucherQueryHandler.ComputeStatus(
            voucher.IsActive,
            voucher.StartsAt,
            voucher.EndsAt,
            voucher.UsageLimit,
            usageCount,
            DateTime.UtcNow
        );

        return new ToggleVoucherActiveResult
        {
            Id = voucher.Id,
            Code = voucher.Code,
            IsActive = voucher.IsActive,
            ComputedStatus = computedStatus,
        };
    }
}
