using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/staffs")]
[Authorize(Roles = "ADMIN")]
public class StaffController : BaseController
{
    private readonly ISender _mediator;

    public StaffController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetStaffs([FromQuery] GetStaffQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetStaffDetail(int id)
    {
        var query = new GetStaffDetailQuery { Id = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateStaff([FromBody] CreateStaffCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateStaff(int id, [FromBody] UpdateStaffCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest("Id không khớp.");
        }

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteStaff(int id)
    {
        var command = new DeleteStaffCommand { Id = id };
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
