---
name: api-skill
description: CQRS pattern, Controller, Validator — đọc khi implement backend feature
---

# API Skill

> Xem real examples trước khi viết code:
> - Controller: `Backend.Api/Controllers/Shop/SneakerController.cs`
> - Command: `Backend.Application/Features/Shop/Product/Sneaker/Commands/CreateSneaker/`
> - Query: `Backend.Application/Features/Shop/Product/Sneaker/Queries/GetSneaker/`
> - Validator: bất kỳ `*Validator.cs` trong `Backend.Application/Features/`

## File Structure (BẮT BUỘC)

```
# Command (write operation) = 4 files
Features/{Domain}/Commands/{Action}/
├── {Action}Command.cs           # sealed record : IRequest<{Action}Result>
├── {Action}CommandHandler.cs    # sealed class : IRequestHandler<...>
├── {Action}CommandValidator.cs  # sealed class : AbstractValidator<...>
└── {Action}Result.cs            # sealed record

# Query (read operation) = 3 files
Features/{Domain}/Queries/{Action}/
├── {Action}Query.cs             # sealed record : BaseGetRequest, IRequest<BaseGetResponse<{Action}Result>>
├── {Action}QueryHandler.cs      # sealed class : IRequestHandler<...>
└── {Action}Result.cs            # sealed record
```

## Command Template

```csharp
// {Action}Command.cs — không có namespace
public sealed record CreateSneakerCommand : IRequest<CreateSneakerResult>
{
    public required int BrandId { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required IFormFile MainImage { get; init; }
    public required List<CreateColorwayDto> Colorways { get; init; }
}
```

## Handler Template

```csharp
// {Action}CommandHandler.cs
public sealed class CreateSneakerCommandHandler(
    IUnitOfWork unitOfWork,
    IImageService imageService)
    : IRequestHandler<CreateSneakerCommand, CreateSneakerResult>
{
    public async Task<CreateSneakerResult> Handle(
        CreateSneakerCommand command,
        CancellationToken cancellationToken)       // ← LUÔN có CancellationToken
    {
        // 1. Validate business rules (throw NotFoundException nếu không tìm thấy)
        var brand = await unitOfWork.Brands.GetByIdAsync(command.BrandId)
            ?? throw new NotFoundException(nameof(Brand), command.BrandId);

        // 2. Upload images
        var mainImageUrl = await imageService.UploadImageAsync(command.MainImage, "sneakers/main");

        // 3. Create entity
        var sneaker = new Sneaker { Name = command.Name, /* ... */ };

        // 4. Save
        await unitOfWork.Sneakers.AddAsync(sneaker);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // 5. Return DTO (không return entity)
        return new CreateSneakerResult { Id = sneaker.Id, Name = sneaker.Name };
    }
}
```

## Query Handler Template

```csharp
public sealed class GetSneakerQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetSneakerQuery, BaseGetResponse<GetSneakerResult>>
{
    public async Task<BaseGetResponse<GetSneakerResult>> Handle(
        GetSneakerQuery query,
        CancellationToken cancellationToken)
    {
        var baseQuery = unitOfWork.Sneakers.Query()
            .AsNoTracking()                                    // ← BẮT BUỘC cho read
            .Where(s => !s.IsDeleted);

        // Apply filters
        if (!string.IsNullOrWhiteSpace(query.Search))
            baseQuery = baseQuery.Where(s => s.Name.ToLower().Contains(query.Search.ToLower()));

        var totalItems = await baseQuery.CountAsync(cancellationToken);

        // Pagination + Projection
        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(s => new GetSneakerResult { Id = s.Id, Name = s.Name /* ... */ })
            .ToListAsync(cancellationToken);

        return new BaseGetResponse<GetSneakerResult>
        {
            TotalItems = totalItems,
            TotalPages = (totalItems + query.PageSize - 1) / query.PageSize,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber * query.PageSize < totalItems,
            Items = items
        };
    }
}
```

## Validator Template

```csharp
public sealed class CreateSneakerCommandValidator : AbstractValidator<CreateSneakerCommand>
{
    public CreateSneakerCommandValidator(ISneakerRepository sneakerRepository)
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên sản phẩm là bắt buộc.")       // ← Vietnamese messages
            .MaximumLength(200).WithMessage("Tên không được vượt quá 200 ký tự.")
            .MustAsync(async (cmd, name, ct) =>
                !await sneakerRepository.ExistsByNameAsync(name, cmd.Id))
            .WithMessage("Tên sản phẩm đã tồn tại.");

        RuleFor(x => x.MainImage)
            .NotNull().WithMessage("Ảnh chính là bắt buộc.")
            .Must(f => f!.ContentType.StartsWith("image/"))
            .WithMessage("File phải là hình ảnh.");

        RuleForEach(x => x.Colorways)
            .SetValidator(new CreateColorwayDtoValidator());    // ← Nested validation
    }
}
```

## Controller Template

```csharp
// Không có namespace. Kế thừa BaseController.
[ApiController]
[Route("api/sneakers")]
public sealed class SneakerController(ISender mediator) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetSneakers([FromQuery] GetSneakerQuery query)
        => Ok(await mediator.Send(query));

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateSneaker([FromForm] CreateSneakerCommand command)
    {
        var result = await mediator.Send(command);
        return CreatedSuccess(nameof(CreateSneaker), new { id = result.Id }, result);
    }
}
```

## Common Validation Patterns

```csharp
// Vietnamese phone
RuleFor(x => x.Phone).Matches(@"^(\+84|84|0)[3-9]\d{8}$").WithMessage("Số điện thoại không hợp lệ.");

// Enum
RuleFor(x => x.Status).IsInEnum().WithMessage("Trạng thái không hợp lệ.");

// Conditional
When(x => x.Type == FulfillmentType.DELIVERY, () => {
    RuleFor(x => x.Address).NotEmpty().WithMessage("Địa chỉ giao hàng là bắt buộc.");
});
```

## API Response Format

BaseController auto-wrap response:
```json
// Success: { "success": true, "statusCode": 200, "data": {...}, "message": "..." }
// Paginated: { "success": true, "data": { "items": [...], "totalItems": 100, ... } }
// Error: { "success": false, "statusCode": 400, "message": "...", "errors": ["..."] }
```

```csharp
[HttpPost]
[Consumes("multipart/form-data")]
public async Task<IActionResult> Create([FromForm] CreateCommand command)
{
    // IFormFile automatically bound
}
```

### Image Validation

```csharp
RuleFor(x => x.MainImage)
    .NotNull()
    .Must(BeValidImage)
    .WithMessage("Invalid image. Allowed: JPG, PNG, WebP. Max: 5MB.");

private static bool BeValidImage(IFormFile? file)
{
    if (file == null) return false;
    if (file.Length > 5 * 1024 * 1024) return false;
    
    var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
    return allowedTypes.Contains(file.ContentType);
}
```
