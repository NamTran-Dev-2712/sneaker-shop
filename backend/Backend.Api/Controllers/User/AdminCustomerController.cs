using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/admin/customers")]
[Authorize(Roles = "ADMIN")]
public class AdminCustomerController : BaseController
{
    private readonly ISender _mediator;

    public AdminCustomerController(ISender mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// GET /api/admin/customers — Paginated customer list with optional filters.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetCustomers([FromQuery] GetCustomersQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// GET /api/admin/customers/{id} — Customer detail with stats.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetCustomerDetail(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetCustomerDetailQuery(id), cancellationToken);
        if (result == null)
            return NotFound($"Không tìm thấy khách hàng #{id}.");
        return Ok(result);
    }

    /// <summary>
    /// PATCH /api/admin/customers/{id}/toggle-active — Toggle customer account active status.
    /// </summary>
    [HttpPatch("{id:int}/toggle-active")]
    public async Task<IActionResult> ToggleCustomerActive(
        int id,
        CancellationToken cancellationToken
    )
    {
        var result = await _mediator.Send(new ToggleCustomerActiveCommand(id), cancellationToken);
        return Ok(result);
    }
}
