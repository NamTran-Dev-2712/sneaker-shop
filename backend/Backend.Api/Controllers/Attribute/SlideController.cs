using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/slides")]
public class SlideController : BaseController
{
    private readonly ISender _mediator;

    public SlideController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetSlides([FromQuery] GetSlideQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllSlides()
    {
        var result = await _mediator.Send(new GetAllSlideQuery());
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPost]
    public async Task<IActionResult> CreateSlide([FromForm] CreateSlideCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateSlide(int id, [FromForm] UpdateSlideCommand command)
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
    public async Task<IActionResult> DeleteSlide(int id)
    {
        var command = new DeleteSlideCommand { Id = id };
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
