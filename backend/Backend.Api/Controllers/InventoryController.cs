using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/inventory")]
[Authorize(Roles = "ADMIN,STAFF")]
public class InventoryController : BaseController
{
    private readonly ISender _mediator;

    public InventoryController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetInventory([FromQuery] GetInventoryQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetInventoryDetail(int id)
    {
        var result = await _mediator.Send(new GetDetailInventoryQuery(id));
        return Ok(result);
    }

    [HttpGet("statistics")]
    public async Task<IActionResult> GetInventoryStatistics(
        [FromQuery] GetInventoryStatisticQuery query
    )
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
