using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/vouchers")]
[Authorize(Roles = "CUSTOMER")]
public class CustomerVoucherController : BaseController
{
    private readonly ISender _mediator;

    public CustomerVoucherController(ISender mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// GET /api/vouchers/me/available — Returns vouchers available for the current customer.
    /// </summary>
    [HttpGet("me/available")]
    public async Task<IActionResult> GetMyAvailableVouchers(CancellationToken cancellationToken)
    {
        var customerId = HttpContext.GetCustomerId()!.Value;
        var result = await _mediator.Send(
            new GetMyAvailableVouchersQuery(customerId),
            cancellationToken
        );
        return Ok(result);
    }

    /// <summary>
    /// GET /api/vouchers/me/redeemed — Returns paginated redeemed vouchers for the current customer.
    /// </summary>
    [HttpGet("me/redeemed")]
    public async Task<IActionResult> GetMyRedeemedVouchers(
        [FromQuery] GetMyRedeemedVouchersQuery query,
        CancellationToken cancellationToken
    )
    {
        query.CustomerId = HttpContext.GetCustomerId()!.Value;
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }
}
