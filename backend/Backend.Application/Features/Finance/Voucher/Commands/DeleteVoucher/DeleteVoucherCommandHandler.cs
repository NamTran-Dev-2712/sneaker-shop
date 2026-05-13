using MediatR;

public class DeleteVoucherCommandHandler
    : IRequestHandler<DeleteVoucherCommand, DeleteVoucherResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteVoucherCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<DeleteVoucherResult> Handle(
        DeleteVoucherCommand command,
        CancellationToken cancellationToken
    )
    {
        var voucher = await _unitOfWork.Vouchers.GetByIdAsync(command.Id, cancellationToken);
        if (voucher == null)
            throw new NotFoundException("Không tìm thấy voucher.");

        var hasRedemptions = await _unitOfWork.VoucherRedemptions.ExistsAsync(r =>
            r.VoucherId == command.Id
        );
        if (hasRedemptions)
            throw new BadException(
                "Không thể xoá voucher đã được sử dụng. Hãy vô hiệu hoá thay thế."
            );

        _unitOfWork.Vouchers.Remove(voucher);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new DeleteVoucherResult { Id = voucher.Id, Code = voucher.Code };
    }
}
