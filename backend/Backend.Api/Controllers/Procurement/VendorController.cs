using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/vendors")]
[Authorize(Roles = "ADMIN,STAFF")]
public class VendorController : BaseController
{
    private readonly ISender _mediator;

    public VendorController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetVendors([FromQuery] GetVendorQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllVendors([FromQuery] GetAllVendorQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetVendorDetail(int id)
    {
        var result = await _mediator.Send(new GetDetailVendorQuery { Id = id });
        return Ok(result);
    }

    [HttpGet("statistics")]
    public async Task<IActionResult> GetVendorStatistics()
    {
        var result = await _mediator.Send(new GetVendorStatisticQuery());
        return Ok(result);
    }

    [HttpGet("{vendorId:int}/sellable-items")]
    public async Task<IActionResult> GetVendorSellableItems(
        int vendorId,
        [FromQuery] GetVendorSellableItemsQuery query
    )
    {
        query = query with { VendorId = vendorId };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateVendor([FromBody] CreateVendorCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedSuccess(nameof(GetVendorDetail), new { id = result.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateVendor(int id, [FromBody] UpdateVendorCommand command)
    {
        command = command with { Id = id };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteVendor(int id)
    {
        var result = await _mediator.Send(new DeleteVendorCommand { Id = id });
        return Ok(result);
    }

    [HttpPost("{vendorId:int}/sellable-items")]
    public async Task<IActionResult> AddSellableItem(
        int vendorId,
        [FromBody] AddSellableItemCommand command
    )
    {
        command = command with { VendorId = vendorId };
        var result = await _mediator.Send(command);
        return CreatedSuccess(nameof(GetVendorDetail), new { id = vendorId }, result);
    }

    [HttpPut("{vendorId:int}/sellable-items/{id:int}")]
    public async Task<IActionResult> UpdateSellableItem(
        int vendorId,
        int id,
        [FromBody] UpdateSellableItemCommand command
    )
    {
        command = command with { Id = id, VendorId = vendorId };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{vendorId:int}/sellable-items/{id:int}")]
    public async Task<IActionResult> RemoveSellableItem(int vendorId, int id)
    {
        var result = await _mediator.Send(
            new RemoveSellableItemCommand { Id = id, VendorId = vendorId }
        );
        return Ok(result);
    }
}
