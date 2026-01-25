---
name: database-skill
description: Kỹ năng tối ưu PostgreSQL, xử lý migration và quản lý data với EF Core
---

# Database Skill

Hướng dẫn làm việc với PostgreSQL và Entity Framework Core trong project.

## EF Core Commands

### Migration Commands

```powershell
# Tạo migration mới
dotnet ef migrations add {MigrationName} -p Backend.Infrastructure -s Backend.Api

# Apply migrations
dotnet ef database update -p Backend.Infrastructure -s Backend.Api

# Revert migration
dotnet ef database update {PreviousMigration} -p Backend.Infrastructure -s Backend.Api

# Remove last migration (chưa apply)
dotnet ef migrations remove -p Backend.Infrastructure -s Backend.Api
```

### Migration Naming Convention

```
{Action}{Entity}[Detail]
```

Examples:
- `InitialCreate`
- `AddSneakerColorway`
- `AddIndexToOrderStatus`
- `UpdateInventoryReservedColumn`

---

## Entity Configuration Pattern

### Entity Configuration File

```csharp
// Backend.Infrastructure/Data/Configurations/SneakerConfiguration.cs
public sealed class SneakerConfiguration : IEntityTypeConfiguration<Sneaker>
{
    public void Configure(EntityTypeBuilder<Sneaker> builder)
    {
        builder.ToTable("sneakers");
        
        builder.HasKey(s => s.Id);
        
        builder.Property(s => s.Name)
            .HasMaxLength(200)
            .IsRequired();
            
        builder.Property(s => s.Slug)
            .HasMaxLength(250)
            .IsRequired();
            
        builder.HasIndex(s => s.Slug)
            .IsUnique();
            
        builder.HasOne(s => s.Brand)
            .WithMany(b => b.Sneakers)
            .HasForeignKey(s => s.BrandId)
            .OnDelete(DeleteBehavior.Restrict);
            
        // Soft delete filter
        builder.HasQueryFilter(s => !s.IsDeleted);
    }
}
```

---

## Query Optimization Patterns

### AsNoTracking for Read Queries

```csharp
// ✅ CORRECT - Read-only query
var sneakers = await _dbContext.Sneakers
    .AsNoTracking()
    .Where(s => s.IsActive)
    .ToListAsync();

// ❌ WRONG - Tracking overhead for read
var sneakers = await _dbContext.Sneakers
    .Where(s => s.IsActive)
    .ToListAsync();
```

### Projection Pattern

```csharp
// ✅ CORRECT - Select only needed fields
var result = await _dbContext.Sneakers
    .AsNoTracking()
    .Select(s => new SneakerDto
    {
        Id = s.Id,
        Name = s.Name,
        MainImage = s.MainImage,
        Price = s.BasePrice
    })
    .ToListAsync();

// ❌ WRONG - Load full entity then map
var entities = await _dbContext.Sneakers.ToListAsync();
var result = entities.Select(s => new SneakerDto { ... });
```

### SplitQuery for Complex Includes

```csharp
// ✅ CORRECT - Avoid Cartesian explosion
var sneaker = await _dbContext.Sneakers
    .AsNoTracking()
    .AsSplitQuery()
    .Include(s => s.Colorways)
        .ThenInclude(c => c.Variants)
    .Include(s => s.Brand)
    .FirstOrDefaultAsync(s => s.Id == id);
```

---

## Sellable_Item Polymorphic Pattern

### Entity Structure

```csharp
public sealed class SellableItem
{
    public int Id { get; set; }
    public SellableType Type { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string? Barcode { get; set; }
    public decimal RetailPrice { get; set; }
    public decimal OnlinePrice { get; set; }
    public bool IsActive { get; set; }
    
    // Polymorphic FK - chỉ 1 trong 2 có giá trị
    public int? SneakerVariantId { get; set; }
    public int? AccessoryId { get; set; }
    
    public SneakerVariant? SneakerVariant { get; set; }
    public Accessory? Accessory { get; set; }
}
```

### Database Constraint

```sql
-- Check constraint đảm bảo đúng polymorphic
ALTER TABLE sellable_items ADD CONSTRAINT chk_sellable_type CHECK (
    (type = 'SNEAKER_VARIANT' AND sneaker_variant_id IS NOT NULL AND accessory_id IS NULL)
    OR
    (type = 'ACCESSORY' AND accessory_id IS NOT NULL AND sneaker_variant_id IS NULL)
);
```

### Query Pattern

```csharp
// Get sellable with product details
var sellable = await _dbContext.SellableItems
    .AsNoTracking()
    .Include(s => s.SneakerVariant)
        .ThenInclude(v => v.Colorway)
            .ThenInclude(c => c.Sneaker)
    .Include(s => s.Accessory)
    .FirstOrDefaultAsync(s => s.Id == id);
```

---

## Inventory Management

### Inventory Rules

```
available = on_hand - reserved
```

| Event | on_hand | reserved |
|-------|---------|----------|
| Order PLACED | — | +qty |
| Order CANCELLED | — | -qty |
| Order PACKED/SHIPPED | -qty | -qty |
| Stock received | +qty | — |
| Return COMPLETED | +qty | — |

### Inventory Update Pattern

```csharp
public async Task ReserveStock(int sellableItemId, int storeId, int quantity)
{
    var inventory = await _dbContext.Inventories
        .FirstOrDefaultAsync(i => 
            i.SellableItemId == sellableItemId && 
            i.StoreId == storeId);
    
    if (inventory == null || inventory.OnHand - inventory.Reserved < quantity)
        throw new InsufficientStockException();
    
    inventory.Reserved += quantity;
    await _dbContext.SaveChangesAsync();
}

public async Task ReleaseReservation(int sellableItemId, int storeId, int quantity)
{
    var inventory = await _dbContext.Inventories
        .FirstOrDefaultAsync(i => 
            i.SellableItemId == sellableItemId && 
            i.StoreId == storeId);
    
    inventory.Reserved -= quantity;
    await _dbContext.SaveChangesAsync();
}
```

---

## Index Best Practices

### Common Indexes

```csharp
// High-frequency filter columns
builder.HasIndex(o => o.Status);
builder.HasIndex(o => o.Channel);
builder.HasIndex(o => o.CreatedAt);

// Foreign keys (auto-created but explicit for clarity)
builder.HasIndex(o => o.CustomerId);
builder.HasIndex(o => o.StoreId);

// Composite for common queries
builder.HasIndex(o => new { o.StoreId, o.Status });
```

### Unique Constraints

```csharp
builder.HasIndex(s => s.Sku).IsUnique();
builder.HasIndex(s => s.Slug).IsUnique();
builder.HasIndex(v => new { v.SneakerId, v.ColorwayId, v.SizeId }).IsUnique();
```

---

## Transaction Pattern

```csharp
public async Task<CreateOrderResult> Handle(CreateOrderCommand command, CancellationToken ct)
{
    await using var transaction = await _dbContext.Database.BeginTransactionAsync(ct);
    
    try
    {
        // 1. Create order
        var order = new Order { /* ... */ };
        _dbContext.Orders.Add(order);
        
        // 2. Create order items
        foreach (var item in command.Items)
        {
            _dbContext.OrderItems.Add(new OrderItem { /* ... */ });
        }
        
        // 3. Reserve inventory
        await ReserveInventory(command.Items);
        
        // 4. Apply voucher if any
        if (command.VoucherCode != null)
            await ApplyVoucher(order, command.VoucherCode);
        
        await _dbContext.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);
        
        return new CreateOrderResult { OrderId = order.Id };
    }
    catch
    {
        await transaction.RollbackAsync(ct);
        throw;
    }
}
```

---

## Pagination Pattern

```csharp
public async Task<PaginatedList<SneakerDto>> GetSneakers(
    int pageNumber, 
    int pageSize,
    string? search,
    int? brandId)
{
    var query = _dbContext.Sneakers
        .AsNoTracking()
        .Where(s => s.IsActive && !s.IsDeleted);
    
    if (!string.IsNullOrEmpty(search))
        query = query.Where(s => s.Name.Contains(search));
    
    if (brandId.HasValue)
        query = query.Where(s => s.BrandId == brandId);
    
    var totalItems = await query.CountAsync();
    
    var items = await query
        .OrderBy(s => s.Name)
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize)
        .Select(s => new SneakerDto { /* ... */ })
        .ToListAsync();
    
    return new PaginatedList<SneakerDto>(items, totalItems, pageNumber, pageSize);
}
```
