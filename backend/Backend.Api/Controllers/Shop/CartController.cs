using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/cart")]
[Authorize(Roles = "CUSTOMER")]
public class CartController : BaseController
{
    private readonly ISender _mediator;

    public CartController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetCart(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10
    )
    {
        var customerId = HttpContext.GetCustomerId();
        if (customerId == null)
        {
            return Unauthorized(new { message = "Không thể xác định thông tin khách hàng." });
        }

        var result = await _mediator.Send(
            new GetCartQuery
            {
                CustomerId = customerId.Value,
                PageNumber = pageNumber,
                PageSize = pageSize,
            }
        );
        return Ok(result);
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartCommand command)
    {
        var customerId = HttpContext.GetCustomerId();
        if (customerId == null)
        {
            return Unauthorized(new { message = "Không thể xác định thông tin khách hàng." });
        }

        command = command with { CustomerId = customerId.Value };

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("items/{cartItemId:int}")]
    public async Task<IActionResult> UpdateCartItem(
        int cartItemId,
        [FromBody] UpdateCartItemCommand command
    )
    {
        var customerId = HttpContext.GetCustomerId();
        if (customerId == null)
        {
            return Unauthorized(new { message = "Không thể xác định thông tin khách hàng." });
        }

        if (cartItemId != command.CartItemId)
        {
            return BadRequest("CartItemId không khớp.");
        }

        command = command with { CustomerId = customerId.Value };

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("items/{cartItemId:int}")]
    public async Task<IActionResult> RemoveCartItem(int cartItemId)
    {
        var customerId = HttpContext.GetCustomerId();
        if (customerId == null)
        {
            return Unauthorized(new { message = "Không thể xác định thông tin khách hàng." });
        }

        var command = new RemoveItemCartCommand
        {
            CustomerId = customerId.Value,
            CartItemId = cartItemId,
        };

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        var customerId = HttpContext.GetCustomerId();
        if (customerId == null)
        {
            return Unauthorized(new { message = "Không thể xác định thông tin khách hàng." });
        }

        var command = new ClearCartCommand { CustomerId = customerId.Value };
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
