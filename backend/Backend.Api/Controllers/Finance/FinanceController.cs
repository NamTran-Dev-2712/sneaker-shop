using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/finance")]
[Authorize(Roles = "ADMIN")]
public class FinanceController : BaseController
{
    private readonly ISender _mediator;

    public FinanceController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary([FromQuery] GetFinanceSummaryQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("trend")]
    public async Task<IActionResult> GetTrend([FromQuery] GetFinanceTrendQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("ledger")]
    public async Task<IActionResult> GetLedger([FromQuery] GetFinanceLedgerQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("manual-entry")]
    public async Task<IActionResult> CreateManualEntry(
        [FromBody] CreateManualFinanceEntryCommand command
    )
    {
        var accountId = HttpContext.GetAccountId();
        command = command with { CreatedBy = accountId };

        var result = await _mediator.Send(command);
        return CreatedSuccess(nameof(GetLedger), null, result);
    }
}
