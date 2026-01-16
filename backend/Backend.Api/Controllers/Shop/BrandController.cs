using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/brands")]
public class BrandController : BaseController
{
    private readonly ISender _mediator;

    public BrandController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetBrands([FromQuery] GetBrandQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllBrands()
    {
        var result = await _mediator.Send(new GetAllBrandQuery());
        return Ok(result);
    }

    [HttpGet("statistics")]
    public async Task<IActionResult> GetBrandStatistics()
    {
        var result = await _mediator.Send(new GetBrandStatisticQuery());
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetBrandDetail(int id)
    {
        var query = new GetBrandDetailQuery { Id = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateBrand([FromForm] CreateBrandCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPut("{id:int}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateBrand(int id, [FromForm] UpdateBrandCommand command)
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
    public async Task<IActionResult> DeleteBrand(int id)
    {
        var command = new DeleteBrandCommand { Id = id };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPost("{brandId:int}/series")]
    public async Task<IActionResult> CreateBrandSeries(
        int brandId,
        [FromBody] CreateBrandSeriesRequest request
    )
    {
        var command = new CreateBrandSeriesCommand { BrandId = brandId, Name = request.Name };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpPut("{brandId:int}/series/{seriesId:int}")]
    public async Task<IActionResult> UpdateBrandSeries(
        int brandId,
        int seriesId,
        [FromBody] UpdateBrandSeriesRequest request
    )
    {
        var command = new UpdateBrandSeriesCommand
        {
            Id = seriesId,
            BrandId = brandId,
            Name = request.Name,
            IsActive = request.IsActive,
        };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN")]
    [HttpDelete("{brandId:int}/series/{seriesId:int}")]
    public async Task<IActionResult> DeleteBrandSeries(int brandId, int seriesId)
    {
        var command = new DeleteBrandSeriesCommand { Id = seriesId, BrandId = brandId };
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}

// Request DTOs for cleaner API
public record CreateBrandSeriesRequest
{
    public required string Name { get; init; }
}

public record UpdateBrandSeriesRequest
{
    public required string Name { get; init; }
    public required bool IsActive { get; init; }
}
