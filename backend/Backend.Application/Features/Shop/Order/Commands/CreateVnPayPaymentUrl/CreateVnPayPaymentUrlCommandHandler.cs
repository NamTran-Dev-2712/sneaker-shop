using MediatR;
using Microsoft.EntityFrameworkCore;

public class CreateVnPayPaymentUrlCommandHandler
    : IRequestHandler<CreateVnPayPaymentUrlCommand, CreateVnPayPaymentUrlResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IVnPayService _vnPayService;

    public CreateVnPayPaymentUrlCommandHandler(IUnitOfWork unitOfWork, IVnPayService vnPayService)
    {
        _unitOfWork = unitOfWork;
        _vnPayService = vnPayService;
    }

    public async Task<CreateVnPayPaymentUrlResult> Handle(
        CreateVnPayPaymentUrlCommand command,
        CancellationToken cancellationToken
    )
    {
        if (!_vnPayService.IsEnabled)
        {
            throw new BadException("Thanh toán VNPay hiện đang tạm tắt.");
        }

        var order = await _unitOfWork
            .Orders.Query()
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == command.OrderId, cancellationToken);

        if (order == null)
        {
            throw new NotFoundException("Không tìm thấy đơn hàng.");
        }

        if (order.CustomerId != command.CustomerId)
        {
            throw new ForbiddenException("Bạn không có quyền thanh toán đơn hàng này.");
        }

        if (order.Status == OrderStatus.CANCELLED)
        {
            throw new BadException("Đơn hàng đã bị hủy, không thể tạo thanh toán VNPay.");
        }

        var payment = order.Payments.OrderByDescending(x => x.UpdatedAt).FirstOrDefault();
        if (payment == null)
        {
            throw new NotFoundException("Đơn hàng chưa có thông tin thanh toán.");
        }

        if (payment.Method != PaymentMethod.VNPAY)
        {
            throw new BadException("Đơn hàng này không sử dụng phương thức VNPay.");
        }

        if (payment.Status == PaymentStatus.PAID)
        {
            throw new BadException("Đơn hàng này đã được thanh toán.");
        }

        var txnRef = payment.ProviderTxnId;
        if (string.IsNullOrWhiteSpace(txnRef))
        {
            txnRef = $"VNPAY-ORD-{order.Id:D6}-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
            payment.UpdateProviderInfo("VNPAY", txnRef);
            _unitOfWork.Payments.Update(payment);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        var paymentUrl = _vnPayService.CreatePaymentUrl(
            txnRef,
            payment.Amount,
            $"Thanh toan don hang ORD-{order.Id:D6}",
            command.ClientIp,
            DateTime.UtcNow
        );

        return new CreateVnPayPaymentUrlResult
        {
            OrderId = order.Id,
            PaymentUrl = paymentUrl,
            TxnRef = txnRef,
        };
    }
}
