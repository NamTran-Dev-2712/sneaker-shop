using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/accessory")]
public class AccessoryController : BaseController
{
    private readonly ISender _mediator;

    public AccessoryController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAccessories([FromQuery] GetAccessoryQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("statistics")]
    public async Task<IActionResult> GetAccessoryStatistics()
    {
        var result = await _mediator.Send(new GetAccessoryStatisticQuery());
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetAccessoryDetail(int id)
    {
        var query = new GetDetailAccessoryQuery { Id = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetAccessoryBySlug(string slug)
    {
        var query = new GetAccessoryBySlugQuery { Slug = slug };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedAccessories(
        [FromQuery] GetFeaturedAccessoryQuery query
    )
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("{id:int}/view")]
    public async Task<IActionResult> IncrementViewCount(int id)
    {
        var command = new IncrementAccessoryViewCountCommand(id);
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateAccessory([FromForm] CreateAccessoryCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPut("{id:int}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateAccessory(
        int id,
        [FromForm] UpdateAccessoryCommand command
    )
    {
        if (id != command.Id)
        {
            return BadRequest("Id không khớp.");
        }

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAccessory(int id)
    {
        var command = new DeleteAccessoryCommand { Id = id };
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
