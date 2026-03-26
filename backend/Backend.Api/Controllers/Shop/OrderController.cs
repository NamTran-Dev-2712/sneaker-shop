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

    [HttpGet]
    public async Task<IActionResult> GetMyOrders([FromQuery] GetMyOrdersQuery query)
    {
        var customerId = HttpContext.GetCustomerId();
        if (customerId == null)
        {
            return Unauthorized(new { message = "Không thể xác định thông tin khách hàng." });
        }

        query.CustomerId = customerId.Value;

        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOrderDetail(int id)
    {
        var customerId = HttpContext.GetCustomerId();
        if (customerId == null)
        {
            return Unauthorized(new { message = "Không thể xác định thông tin khách hàng." });
        }

        var query = new GetOrderDetailQuery { CustomerId = customerId.Value, OrderId = id };

        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("{id:int}/confirm-received")]
    public async Task<IActionResult> ConfirmReceived(int id)
    {
        var customerId = HttpContext.GetCustomerId();
        if (customerId == null)
        {
            return Unauthorized(new { message = "Không thể xác định thông tin khách hàng." });
        }

        var command = new ConfirmOrderReceivedCommand
        {
            OrderId = id,
            CustomerId = customerId.Value,
        };

        var result = await _mediator.Send(command);
        return OkCustom(result, "Xác nhận đã nhận hàng thành công.");
    }
}
