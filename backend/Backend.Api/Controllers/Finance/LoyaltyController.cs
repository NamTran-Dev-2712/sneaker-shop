using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/loyalty")]
[Authorize(Roles = "CUSTOMER")]
public class LoyaltyController : BaseController
{
    private readonly ISender _mediator;

    public LoyaltyController(ISender mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// GET /api/loyalty/me — Returns the current customer's loyalty account (balance + tier).
    /// Returns a zero-balance result if the account hasn't been created yet.
    /// </summary>
    [HttpGet("me")]
    public async Task<IActionResult> GetMyLoyaltyAccount()
    {
        var customerId = HttpContext.GetCustomerId()!.Value;
        var result = await _mediator.Send(new GetMyLoyaltyAccountQuery(customerId));
        return Ok(result);
    }

    /// <summary>
    /// GET /api/loyalty/me/transactions — Returns paginated loyalty transaction history.
    /// </summary>
    [HttpGet("me/transactions")]
    public async Task<IActionResult> GetMyLoyaltyTransactions(
        [FromQuery] GetMyLoyaltyTransactionsQuery query
    )
    {
        query.CustomerId = HttpContext.GetCustomerId()!.Value;
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
