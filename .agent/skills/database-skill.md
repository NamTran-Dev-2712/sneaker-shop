---
name: database-skill
description: EF Core patterns, migration, query optimization — đọc khi làm database task
---

# Database Skill

> Schema chi tiết & business invariants → [docs/DATABASE.md](../../docs/DATABASE.md)
> Entity config examples → `Backend.Infrastructure/Data/Configurations/`

## EF Core Commands

```powershell
# Tạo migration
dotnet ef migrations add {MigrationName} -p Backend.Infrastructure -s Backend.Api

# Apply migrations
dotnet ef database update -p Backend.Infrastructure -s Backend.Api

# Revert migration
dotnet ef database update {PreviousMigration} -p Backend.Infrastructure -s Backend.Api

# Remove last migration (chưa apply)
dotnet ef migrations remove -p Backend.Infrastructure -s Backend.Api
```

Migration naming: `{Action}{Entity}[Detail]` — e.g. `AddSneakerColorway`, `AddIndexToOrderStatus`

## Entity Configuration Pattern

```csharp
// Backend.Infrastructure/Data/Configurations/{Entity}Configuration.cs
public sealed class SneakerConfiguration : IEntityTypeConfiguration<Sneaker>
{
    public void Configure(EntityTypeBuilder<Sneaker> builder)
    {
        builder.ToTable("sneakers");               // snake_case table name
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Name).HasMaxLength(200).IsRequired();
        builder.HasIndex(s => s.Slug).IsUnique();

        builder.HasOne(s => s.Brand)
            .WithMany(b => b.Sneakers)
            .HasForeignKey(s => s.BrandId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(s => !s.IsDeleted); // Soft delete filter
    }
}
```

## Query Patterns (BẮT BUỘC)

```csharp
// ✅ Read query — LUÔN dùng AsNoTracking + Projection
var result = await unitOfWork.Sneakers.Query()
    .AsNoTracking()
    .Where(s => s.IsActive)
    .Select(s => new SneakerDto { Id = s.Id, Name = s.Name })
    .ToListAsync(cancellationToken);

// ✅ Complex includes — dùng AsSplitQuery tránh cartesian explosion
var sneaker = await unitOfWork.Sneakers.Query()
    .AsNoTracking()
    .AsSplitQuery()
    .Include(s => s.Colorways).ThenInclude(c => c.Variants)
    .Include(s => s.Brand)
    .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
```

## Domain-Specific Patterns

### Sellable_Item Polymorphic

```csharp
// Type PHẢI match FK. DB có check constraint:
// SNEAKER_VARIANT → sneaker_variant_id NOT NULL, accessory_id NULL
// ACCESSORY → accessory_id NOT NULL, sneaker_variant_id NULL
public sealed class SellableItem : BaseEntity
{
    public SellableType Type { get; set; }
    public string Sku { get; set; } = string.Empty;
    public decimal RetailPrice { get; set; }
    public int? SneakerVariantId { get; set; }     // chỉ 1 trong 2 có giá trị
    public int? AccessoryId { get; set; }
}
```

### Inventory Management

```
available = on_hand - reserved

| Event              | on_hand | reserved |
|--------------------|---------|----------|
| Order PLACED       | —       | +qty     |
| Order CANCELLED    | —       | -qty     |
| Order PACKED/SHIPPED | -qty  | -qty     |
| Stock received     | +qty    | —        |
| Return COMPLETED   | +qty    | —        |
```

### Transaction Pattern

```csharp
// Dùng ExecuteInTransactionAsync hoặc BeginTransactionAsync
await unitOfWork.BeginTransactionAsync();
try
{
    var order = new Order { /* ... */ };
    await unitOfWork.Orders.AddAsync(order);
    await unitOfWork.SaveChangesAsync(cancellationToken);
    await unitOfWork.CommitTransactionAsync();
}
catch
{
    await unitOfWork.RollbackTransactionAsync();
    throw;
}
```

## Index Best Practices

```csharp
// High-frequency filters
builder.HasIndex(o => o.Status);
builder.HasIndex(o => o.CreatedAt);

// Unique constraints
builder.HasIndex(s => s.Sku).IsUnique();
builder.HasIndex(s => s.Slug).IsUnique();

// Composite
builder.HasIndex(v => new { v.SneakerId, v.ColorwayId, v.SizeId }).IsUnique();
builder.HasIndex(o => new { o.StoreId, o.Status });
```
