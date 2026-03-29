using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

[ApiController]
[Route("api/staff/orders")]
[Authorize(Roles = "STAFF")]
public class StaffOrderController : BaseController
{
    private readonly ISender _mediator;

    public StaffOrderController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [DisableRateLimiting]
    public async Task<IActionResult> GetStoreOrders([FromQuery] GetStoreOrdersQuery query)
    {
        var storeId = HttpContext.GetStoreId();
        if (storeId == null)
        {
            return Unauthorized("Không thể xác định chi nhánh làm việc của nhân viên.");
        }

        query.StoreId = storeId.Value;
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [DisableRateLimiting]
    public async Task<IActionResult> GetOrderDetail(int id)
    {
        var storeId = HttpContext.GetStoreId();
        if (storeId == null)
        {
            return Unauthorized("Không thể xác định chi nhánh làm việc của nhân viên.");
        }

        var query = new GetStaffOrderDetailQuery { StoreId = storeId.Value, OrderId = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("{id:int}/confirm")]
    [EnableRateLimiting("staff-mutations")]
    public async Task<IActionResult> ConfirmOrder(int id)
    {
        var (storeId, staffAccountId, unauthorized) = ResolveStaffContext();
        if (unauthorized != null)
            return unauthorized;

        var command = new ConfirmStoreOrderCommand
        {
            StoreId = storeId!.Value,
            StaffAccountId = staffAccountId!.Value,
            OrderId = id,
        };

        var result = await _mediator.Send(command);
        return OkCustom(result, "Xác nhận đơn hàng thành công.");
    }

    [HttpPost("{id:int}/mark-paid")]
    [EnableRateLimiting("staff-mutations")]
    public async Task<IActionResult> MarkAsPaid(int id)
    {
        var (storeId, staffAccountId, unauthorized) = ResolveStaffContext();
        if (unauthorized != null)
            return unauthorized;

        var command = new MarkStoreOrderPaidCommand
        {
            StoreId = storeId!.Value,
            StaffAccountId = staffAccountId!.Value,
            OrderId = id,
        };

        var result = await _mediator.Send(command);
        return OkCustom(result, "Cập nhật thanh toán thành công.");
    }

    [HttpPost("{id:int}/pack")]
    [EnableRateLimiting("staff-mutations")]
    public async Task<IActionResult> PackOrder(int id)
    {
        var (storeId, staffAccountId, unauthorized) = ResolveStaffContext();
        if (unauthorized != null)
            return unauthorized;

        var command = new PackStoreOrderCommand
        {
            StoreId = storeId!.Value,
            StaffAccountId = staffAccountId!.Value,
            OrderId = id,
        };

        var result = await _mediator.Send(command);
        return OkCustom(result, "Đóng gói đơn hàng thành công.");
    }

    [HttpPost("{id:int}/ship")]
    [EnableRateLimiting("staff-mutations")]
    public async Task<IActionResult> ShipOrder(int id, [FromBody] ShipStoreOrderRequest request)
    {
        var (storeId, staffAccountId, unauthorized) = ResolveStaffContext();
        if (unauthorized != null)
            return unauthorized;

        var command = new ShipStoreOrderCommand
        {
            StoreId = storeId!.Value,
            StaffAccountId = staffAccountId!.Value,
            OrderId = id,
            Carrier = request.Carrier,
            TrackingCode = request.TrackingCode,
        };

        var result = await _mediator.Send(command);
        return OkCustom(result, "Bàn giao vận chuyển thành công.");
    }

    [HttpPost("{id:int}/deliver")]
    [EnableRateLimiting("staff-mutations")]
    public async Task<IActionResult> DeliverOrder(int id)
    {
        var (storeId, staffAccountId, unauthorized) = ResolveStaffContext();
        if (unauthorized != null)
            return unauthorized;

        var command = new DeliverStoreOrderCommand
        {
            StoreId = storeId!.Value,
            StaffAccountId = staffAccountId!.Value,
            OrderId = id,
        };

        var result = await _mediator.Send(command);
        return OkCustom(result, "Hoàn tất đơn hàng thành công.");
    }

    [HttpPost("{id:int}/cancel")]
    [EnableRateLimiting("staff-mutations")]
    public async Task<IActionResult> CancelOrder(int id, [FromBody] CancelStoreOrderRequest request)
    {
        var (storeId, staffAccountId, unauthorized) = ResolveStaffContext();
        if (unauthorized != null)
            return unauthorized;

        var command = new CancelStoreOrderCommand
        {
            StoreId = storeId!.Value,
            StaffAccountId = staffAccountId!.Value,
            OrderId = id,
            Reason = request.Reason,
        };

        var result = await _mediator.Send(command);
        return OkCustom(result, "Hủy đơn hàng thành công.");
    }

    private (int? storeId, int? staffAccountId, IActionResult? unauthorized) ResolveStaffContext()
    {
        var storeId = HttpContext.GetStoreId();
        var staffAccountId = HttpContext.GetAccountId();

        if (storeId == null || staffAccountId == null)
        {
            return (null, null, Unauthorized("Không thể xác định thông tin nhân viên."));
        }

        return (storeId, staffAccountId, null);
    }
}

public record ShipStoreOrderRequest
{
    public string? Carrier { get; init; }
    public string? TrackingCode { get; init; }
}

public record CancelStoreOrderRequest
{
    public string? Reason { get; init; }
}
