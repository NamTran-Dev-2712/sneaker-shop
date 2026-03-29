using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/payments/vnpay")]
public class VnPayController : BaseController
{
    private readonly ISender _mediator;

    public VnPayController(ISender mediator)
    {
        _mediator = mediator;
    }

    [Authorize(Roles = "CUSTOMER")]
    [HttpPost("payment-url")]
    public async Task<IActionResult> CreatePaymentUrl(
        [FromBody] CreateVnPayPaymentUrlRequest request
    )
    {
        var customerId = HttpContext.GetCustomerId();
        if (customerId == null)
        {
            return Unauthorized("Không thể xác định thông tin khách hàng.");
        }

        var command = new CreateVnPayPaymentUrlCommand
        {
            OrderId = request.OrderId,
            CustomerId = customerId.Value,
            ClientIp = ResolveClientIp(),
        };

        var result = await _mediator.Send(command);
        return OkCustom(result, "Tạo đường dẫn thanh toán VNPay thành công.");
    }

    [AllowAnonymous]
    [HttpGet("return")]
    public async Task<IActionResult> HandleReturn()
    {
        var queryParams = Request.Query.ToDictionary(x => x.Key, x => x.Value.ToString());
        var result = await _mediator.Send(
            new ProcessVnPayReturnCommand { QueryParams = queryParams }
        );
        return OkCustom(result, result.Message);
    }

    [AllowAnonymous]
    [HttpGet("ipn")]
    public async Task<IActionResult> HandleIpn()
    {
        var queryParams = Request.Query.ToDictionary(x => x.Key, x => x.Value.ToString());
        var result = await _mediator.Send(new ProcessVnPayIpnCommand { QueryParams = queryParams });

        // VNPay expects this exact acknowledgment shape.
        return new JsonResult(new { RspCode = result.RspCode, Message = result.Message });
    }

    private string ResolveClientIp()
    {
        var forwardedFor = Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(forwardedFor))
        {
            var ip = forwardedFor.Split(',').FirstOrDefault()?.Trim();
            if (!string.IsNullOrWhiteSpace(ip))
            {
                return ip;
            }
        }

        var realIp = Request.Headers["X-Real-IP"].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(realIp))
        {
            return realIp;
        }

        return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
    }
}
