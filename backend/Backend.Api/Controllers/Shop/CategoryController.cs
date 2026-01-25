using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/category-accessory")]
public class CategoryAccessoryController : BaseController
{
    private readonly ISender _mediator;

    public CategoryAccessoryController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategoryAccessories(
        [FromQuery] GetCategoryAccessoryQuery query
    )
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllCategoryAccessories()
    {
        var result = await _mediator.Send(new GetAllCategoryAccessoryQuery());
        return Ok(result);
    }

    [HttpGet("statistics")]
    public async Task<IActionResult> GetCategoryAccessoryStatistics()
    {
        var result = await _mediator.Send(new GetCategoryAccessoryStatisticQuery());
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetCategoryAccessoryDetail(int id)
    {
        var query = new GetDetailCategoryAccessoryQuery { Id = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateCategoryAccessory(
        [FromForm] CreateCategoryAccessoryCommand command
    )
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPut("{id:int}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateCategoryAccessory(
        int id,
        [FromForm] UpdateCategoryAccessoryCommand command
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
    public async Task<IActionResult> DeleteCategoryAccessory(int id)
    {
        var command = new DeleteCategoryAccessoryCommand { Id = id };
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
