using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/sneakers")]
public class SneakerController : BaseController
{
    private readonly ISender _mediator;

    public SneakerController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetSneakers([FromQuery] GetSneakerQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetSneakerDetail(int id)
    {
        var query = new GetSneakerDetailQuery { Id = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateSneaker([FromForm] CreateSneakerCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPut("{id:int}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateSneaker(int id, [FromForm] UpdateSneakerCommand command)
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
    public async Task<IActionResult> DeleteSneaker(int id)
    {
        var command = new DeleteSneakerCommand { Id = id };
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
