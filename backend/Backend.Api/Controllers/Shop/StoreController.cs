using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/stores")]
public class StoreController : BaseController
{
    private readonly ISender _mediator;

    public StoreController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetStores([FromQuery] GetStoreQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetStoreDetail(int id)
    {
        var query = new GetStoreDetailQuery { Id = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPost]
    public async Task<IActionResult> CreateStore([FromBody] CreateStoreCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateStore(int id, [FromBody] UpdateStoreCommand command)
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
    public async Task<IActionResult> DeleteStore(int id)
    {
        var command = new DeleteStoreCommand { Id = id };
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
