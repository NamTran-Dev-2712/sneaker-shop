using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/purchase-orders")]
[Authorize(Roles = "ADMIN,STAFF")]
public class PurchaseOrderController : BaseController
{
    private readonly ISender _mediator;

    public PurchaseOrderController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetPurchaseOrders([FromQuery] GetPurchaseOrderQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllPurchaseOrders(
        [FromQuery] GetAllPurchaseOrderQuery query
    )
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetPurchaseOrderDetail(int id)
    {
        var result = await _mediator.Send(new GetDetailPurchaseOrderQuery(id));
        return Ok(result);
    }

    [HttpGet("statistics")]
    public async Task<IActionResult> GetPurchaseOrderStatistics(
        [FromQuery] GetPurchaseOrderStatisticQuery query
    )
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePurchaseOrder(
        [FromBody] CreatePurchaseOrderCommand command
    )
    {
        var result = await _mediator.Send(command);
        return CreatedSuccess(nameof(GetPurchaseOrderDetail), new { id = result.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdatePurchaseOrder(
        int id,
        [FromBody] UpdatePurchaseOrderCommand command
    )
    {
        command = command with { Id = id };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdatePurchaseOrderStatus(
        int id,
        [FromBody] UpdateStatusPurchaseOrderCommand command
    )
    {
        command = command with { Id = id };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeletePurchaseOrder(int id)
    {
        var result = await _mediator.Send(new DeletePurchaseOrderCommand(id));
        return Ok(result);
    }
}
