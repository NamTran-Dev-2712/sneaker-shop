using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/orders")]
[Authorize(Roles = "CUSTOMER")]
public class OrderController : BaseController
{
    private readonly ISender _mediator;

    public OrderController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderCommand command)
    {
        var customerId = HttpContext.GetCustomerId();
        if (customerId == null)
        {
            return Unauthorized(new { message = "Không thể xác định thông tin khách hàng." });
        }

        command = command with { CustomerId = customerId.Value };

        var result = await _mediator.Send(command);
        return CreatedSuccess(nameof(CreateOrder), new { orderId = result.OrderId }, result);
    }
}
