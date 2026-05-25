using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/sellable-items")]
[Authorize(Roles = "ADMIN,STAFF")]
public class SellableItemController : BaseController
{
    private readonly ISender _mediator;

    public SellableItemController(ISender mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Lấy danh sách SellableItem có phân trang và lọc
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetSellableItems([FromQuery] GetSellableItemQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Lấy tất cả SellableItem (cho dropdown/select)
    /// </summary>
    [HttpGet("all")]
    public async Task<IActionResult> GetAllSellableItems([FromQuery] GetAllSellableItemQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết SellableItem theo Id
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetSellableItemDetail(int id)
    {
        var result = await _mediator.Send(new GetDetailSellableItemQuery { Id = id });
        return Ok(result);
    }
}
