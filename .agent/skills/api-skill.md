---
name: api-skill
description: Quy chuẩn thiết kế RESTful API, CQRS pattern, và validation
---

# API Skill

Hướng dẫn thiết kế RESTful API theo chuẩn CQRS và validation patterns.

## CQRS Command Pattern

### Complete Command Structure

```
Features/{Feature}/Commands/{Action}/
├── {Action}Command.cs
├── {Action}CommandHandler.cs
├── {Action}CommandValidator.cs
└── {Action}Result.cs
```

### Command Template

```csharp
// CreateSneakerCommand.cs
public sealed record CreateSneakerCommand : IRequest<CreateSneakerResult>
{
    public required int BrandId { get; init; }
    public int? BrandSeriesId { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required IFormFile MainImage { get; init; }
    public required List<CreateColorwayDto> Colorways { get; init; }
}

public sealed record CreateColorwayDto
{
    public int? ColorId { get; init; }
    public NewColorDto? NewColor { get; init; }
    public required IFormFile CoverImage { get; init; }
    public required List<CreateVariantDto> Variants { get; init; }
}
```

### Handler Template

```csharp
// CreateSneakerCommandHandler.cs
public sealed class CreateSneakerCommandHandler(
    IUnitOfWork unitOfWork,
    IImageService imageService)
    : IRequestHandler<CreateSneakerCommand, CreateSneakerResult>
{
    public async Task<CreateSneakerResult> Handle(
        CreateSneakerCommand command, 
        CancellationToken cancellationToken)
    {
        // 1. Validate business rules
        var brand = await unitOfWork.Repository<Brand>()
            .GetByIdAsync(command.BrandId)
            ?? throw new NotFoundException(nameof(Brand), command.BrandId);
        
        // 2. Upload images
        var mainImageUrl = await imageService.UploadImageAsync(
            command.MainImage, "sneakers/main");
        
        // 3. Create entity
        var sneaker = Sneaker.Create(
            command.Name,
            command.Description,
            mainImageUrl,
            command.BrandId,
            command.BrandSeriesId);
        
        // 4. Process colorways/variants
        foreach (var colorwayDto in command.Colorways)
        {
            // ... create colorway and variants
        }
        
        // 5. Save
        await unitOfWork.Repository<Sneaker>().AddAsync(sneaker);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        
        // 6. Return result
        return new CreateSneakerResult
        {
            Id = sneaker.Id,
            Name = sneaker.Name,
            Slug = sneaker.Slug
        };
    }
}
```

### Validator Template

```csharp
// CreateSneakerCommandValidator.cs
public sealed class CreateSneakerCommandValidator 
    : AbstractValidator<CreateSneakerCommand>
{
    public CreateSneakerCommandValidator()
    {
        RuleFor(x => x.BrandId)
            .GreaterThan(0)
            .WithMessage("Brand is required.");
        
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200)
            .WithMessage("Name is required and max 200 characters.");
        
        RuleFor(x => x.MainImage)
            .NotNull()
            .WithMessage("Main image is required.");
        
        RuleFor(x => x.Colorways)
            .NotEmpty()
            .WithMessage("At least one colorway is required.");
        
        RuleForEach(x => x.Colorways)
            .SetValidator(new CreateColorwayDtoValidator());
    }
}
```

### Result Template

```csharp
// CreateSneakerResult.cs
public sealed record CreateSneakerResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string MainImage { get; init; }
    public int ColorwaysCreated { get; init; }
    public int VariantsCreated { get; init; }
}
```

---

## CQRS Query Pattern

### Query Structure

```
Features/{Feature}/Queries/{Action}/
├── {Action}Query.cs
├── {Action}QueryHandler.cs
└── {Action}Result.cs (or {Item}Dto.cs)
```

### Query with Pagination

```csharp
// GetSneakersQuery.cs
public sealed record GetSneakersQuery : IRequest<PaginatedList<SneakerListDto>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
    public string? Search { get; init; }
    public int? BrandId { get; init; }
    public bool? IsActive { get; init; }
    public string SortBy { get; init; } = "name";
    public string SortOrder { get; init; } = "asc";
}

// GetSneakersQueryHandler.cs
public sealed class GetSneakersQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetSneakersQuery, PaginatedList<SneakerListDto>>
{
    public async Task<PaginatedList<SneakerListDto>> Handle(
        GetSneakersQuery query, 
        CancellationToken cancellationToken)
    {
        var sneakerQuery = unitOfWork.Repository<Sneaker>()
            .GetQueryable()
            .AsNoTracking()
            .Where(s => !s.IsDeleted);
        
        // Apply filters
        if (!string.IsNullOrEmpty(query.Search))
            sneakerQuery = sneakerQuery.Where(s => 
                s.Name.Contains(query.Search) || 
                s.Slug.Contains(query.Search));
        
        if (query.BrandId.HasValue)
            sneakerQuery = sneakerQuery.Where(s => s.BrandId == query.BrandId);
        
        if (query.IsActive.HasValue)
            sneakerQuery = sneakerQuery.Where(s => s.IsActive == query.IsActive);
        
        // Apply sorting
        sneakerQuery = query.SortBy.ToLower() switch
        {
            "price" => query.SortOrder == "desc" 
                ? sneakerQuery.OrderByDescending(s => s.BasePrice)
                : sneakerQuery.OrderBy(s => s.BasePrice),
            "createdat" => query.SortOrder == "desc"
                ? sneakerQuery.OrderByDescending(s => s.CreatedAt)
                : sneakerQuery.OrderBy(s => s.CreatedAt),
            _ => query.SortOrder == "desc"
                ? sneakerQuery.OrderByDescending(s => s.Name)
                : sneakerQuery.OrderBy(s => s.Name)
        };
        
        // Paginate with projection
        return await sneakerQuery
            .Select(s => new SneakerListDto
            {
                Id = s.Id,
                Name = s.Name,
                Slug = s.Slug,
                MainImage = s.MainImage,
                BasePrice = s.BasePrice,
                BrandName = s.Brand.Name,
                IsActive = s.IsActive
            })
            .ToPaginatedListAsync(query.PageNumber, query.PageSize);
    }
}
```

---

## Controller Pattern

### Thin Controller Template

```csharp
[ApiController]
[Route("api/[controller]")]
public sealed class SneakersController(ISender mediator) : ControllerBase
{
    // GET /api/sneakers
    [HttpGet]
    public async Task<IActionResult> GetSneakers([FromQuery] GetSneakersQuery query)
    {
        var result = await mediator.Send(query);
        return Ok(result);
    }
    
    // GET /api/sneakers/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetSneaker(int id)
    {
        var result = await mediator.Send(new GetSneakerDetailQuery { Id = id });
        return Ok(result);
    }
    
    // POST /api/sneakers
    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateSneaker([FromForm] CreateSneakerCommand command)
    {
        var result = await mediator.Send(command);
        return CreatedAtAction(nameof(GetSneaker), new { id = result.Id }, result);
    }
    
    // PUT /api/sneakers/{id}
    [HttpPut("{id:int}")]
    [Authorize(Roles = "ADMIN")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateSneaker(int id, [FromForm] UpdateSneakerCommand command)
    {
        if (id != command.Id)
            return BadRequest("ID mismatch");
        
        var result = await mediator.Send(command);
        return Ok(result);
    }
    
    // DELETE /api/sneakers/{id}
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> DeleteSneaker(int id)
    {
        await mediator.Send(new DeleteSneakerCommand { Id = id });
        return NoContent();
    }
}
```

---

## FluentValidation Patterns

### Common Validation Rules

```csharp
// Email validation
RuleFor(x => x.Email)
    .NotEmpty()
    .EmailAddress()
    .MaximumLength(256);

// Phone validation (VN format)
RuleFor(x => x.Phone)
    .NotEmpty()
    .Matches(@"^(\+84|84|0)[3-9]\d{8}$")
    .WithMessage("Invalid Vietnamese phone number.");

// Password validation
RuleFor(x => x.Password)
    .NotEmpty()
    .MinimumLength(8)
    .Matches(@"[A-Z]").WithMessage("Must contain uppercase.")
    .Matches(@"[a-z]").WithMessage("Must contain lowercase.")
    .Matches(@"[0-9]").WithMessage("Must contain number.")
    .Matches(@"[\!\?\*\.\@\#\$\%\^]").WithMessage("Must contain special char.");

// Positive number
RuleFor(x => x.Price)
    .GreaterThan(0)
    .WithMessage("Price must be positive.");

// Enum validation
RuleFor(x => x.Status)
    .IsInEnum()
    .WithMessage("Invalid status value.");

// Conditional validation
When(x => x.Type == FulfillmentType.DELIVERY, () =>
{
    RuleFor(x => x.Address).NotEmpty();
    RuleFor(x => x.RecipientPhone).NotEmpty();
});
```

### Nested Object Validation

```csharp
public sealed class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderCommandValidator()
    {
        RuleFor(x => x.Items)
            .NotEmpty()
            .WithMessage("Order must have at least one item.");
        
        RuleForEach(x => x.Items)
            .SetValidator(new OrderItemDtoValidator());
    }
}

public sealed class OrderItemDtoValidator : AbstractValidator<OrderItemDto>
{
    public OrderItemDtoValidator()
    {
        RuleFor(x => x.SellableItemId).GreaterThan(0);
        RuleFor(x => x.Quantity).GreaterThan(0);
    }
}
```

---

## Result Pattern

### Result Extensions

```csharp
public static class ResultExtensions
{
    public static IActionResult ToActionResult<T>(this Result<T> result)
    {
        if (result.IsSuccess)
            return new OkObjectResult(result.Value);
        
        return result.Error.Code switch
        {
            "NotFound" => new NotFoundObjectResult(result.Error.Message),
            "Validation" => new BadRequestObjectResult(result.Error.Message),
            "Unauthorized" => new UnauthorizedObjectResult(result.Error.Message),
            _ => new ObjectResult(result.Error.Message) { StatusCode = 500 }
        };
    }
}
```

---

## API Response Format

### Success Response

```json
{
  "id": 1,
  "name": "Air Max 90",
  "slug": "air-max-90"
}
```

### Paginated Response

```json
{
  "items": [...],
  "totalItems": 100,
  "totalPages": 10,
  "pageNumber": 1,
  "pageSize": 10,
  "hasPreviousPage": false,
  "hasNextPage": true
}
```

### Error Response

```json
{
  "message": "Validation failed",
  "errors": [
    "Name is required",
    "Price must be positive"
  ]
}
```

---

## File Upload Pattern

### Multipart Form Data

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
