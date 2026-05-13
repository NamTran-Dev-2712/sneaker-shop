using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/vouchers")]
[Authorize(Roles = "ADMIN")]
public class VoucherController : BaseController
{
    private readonly ISender _mediator;

    public VoucherController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetVouchers([FromQuery] GetVoucherQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetVoucherDetail(int id)
    {
        var result = await _mediator.Send(new GetDetailVoucherQuery(id));
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateVoucher([FromBody] CreateVoucherCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedSuccess(nameof(GetVoucherDetail), new { id = result.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateVoucher(int id, [FromBody] UpdateVoucherCommand command)
    {
        command = command with { Id = id };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPatch("{id:int}/toggle-active")]
    public async Task<IActionResult> ToggleVoucherActive(int id)
    {
        var result = await _mediator.Send(new ToggleVoucherActiveCommand(id));
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteVoucher(int id)
    {
        var result = await _mediator.Send(new DeleteVoucherCommand(id));
        return Ok(result);
    }
}
