using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/sizes")]
public class SizeController : BaseController
{
    private readonly ISender _mediator;

    public SizeController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetSizes([FromQuery] GetSizeQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPost]
    public async Task<IActionResult> CreateSize([FromBody] CreateSizeCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateSize(int id, [FromBody] UpdateSizeCommand command)
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
    public async Task<IActionResult> DeleteSize(int id)
    {
        var command = new DeleteSizeCommand { Id = id };
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
