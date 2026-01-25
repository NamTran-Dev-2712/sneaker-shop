---
description: Luồng phát triển một tính năng mới từ Domain đến Frontend
---

# Feature Development Flow

Quy trình step-by-step để phát triển một tính năng mới trong project Sneaker Shop.

## Prerequisites

Trước khi bắt đầu, đảm bảo đã đọc:
- `.agent/rules/architecture.md` - Hiểu cấu trúc layers
- `.agent/skills/api-skill.md` - CQRS pattern
- `.agent/skills/frontend-skill.md` - Component pattern

---

## Step 1: Domain Layer (if needed)

**Khi nào cần**: Thêm entity mới hoặc sửa entity hiện có.

```powershell
# Location: Backend.Domain/Entities/
```

1. Tạo/update Entity class
2. Không dùng namespace
3. Không phụ thuộc vào Application/Infrastructure

```csharp
// Backend.Domain/Entities/Voucher.cs
public sealed class Voucher
{
    public int Id { get; private set; }
    public string Code { get; private set; } = string.Empty;
    public DiscountType DiscountType { get; private set; }
    public decimal DiscountValue { get; private set; }
    
    public static Voucher Create(string code, DiscountType type, decimal value)
    {
        return new Voucher
        {
            Code = code.ToUpperInvariant(),
            DiscountType = type,
            DiscountValue = value
        };
    }
}
```

---

## Step 2: Infrastructure Layer (if new entity)

**Location**: `Backend.Infrastructure/`

// turbo
1. Tạo Entity Configuration

```csharp
// Data/Configurations/VoucherConfiguration.cs
public sealed class VoucherConfiguration : IEntityTypeConfiguration<Voucher>
{
    public void Configure(EntityTypeBuilder<Voucher> builder)
    {
        builder.ToTable("vouchers");
        builder.HasKey(v => v.Id);
        builder.HasIndex(v => v.Code).IsUnique();
    }
}
```

// turbo
2. Thêm DbSet vào AppDbContext

```csharp
public DbSet<Voucher> Vouchers => Set<Voucher>();
```

// turbo
3. Tạo Migration

```powershell
dotnet ef migrations add AddVoucher -p Backend.Infrastructure -s Backend.Api
```

---

## Step 3: Application Layer - Command/Query

**Location**: `Backend.Application/Features/{Feature}/`

### For Write Operations (Commands)

Tạo 4 files trong `Commands/{Action}/`:

1. **Command** - Input record
```csharp
public sealed record CreateVoucherCommand : IRequest<CreateVoucherResult>
{
    public required string Code { get; init; }
    public required DiscountType DiscountType { get; init; }
    public required decimal DiscountValue { get; init; }
}
```

2. **Validator** - FluentValidation
```csharp
public sealed class CreateVoucherCommandValidator : AbstractValidator<CreateVoucherCommand>
{
    public CreateVoucherCommandValidator()
    {
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50);
        RuleFor(x => x.DiscountValue).GreaterThan(0);
    }
}
```

3. **Handler** - Business logic
```csharp
public sealed class CreateVoucherCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<CreateVoucherCommand, CreateVoucherResult>
{
    public async Task<CreateVoucherResult> Handle(
        CreateVoucherCommand command, 
        CancellationToken cancellationToken)
    {
        var voucher = Voucher.Create(
            command.Code, 
            command.DiscountType, 
            command.DiscountValue);
        
        await unitOfWork.Repository<Voucher>().AddAsync(voucher);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        
        return new CreateVoucherResult { Id = voucher.Id };
    }
}
```

4. **Result** - Output record
```csharp
public sealed record CreateVoucherResult
{
    public required int Id { get; init; }
}
```

### For Read Operations (Queries)

Tạo 3 files trong `Queries/{Action}/`:
- Query, QueryHandler, Result/DTO

---

## Step 4: API Layer - Controller

**Location**: `Backend.Api/Controllers/`

```csharp
[ApiController]
[Route("api/[controller]")]
public sealed class VouchersController(ISender mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetVouchers([FromQuery] GetVouchersQuery query)
        => Ok(await mediator.Send(query));
    
    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> CreateVoucher(CreateVoucherCommand command)
    {
        var result = await mediator.Send(command);
        return CreatedAtAction(nameof(GetVoucher), new { id = result.Id }, result);
    }
}
```

---

## Step 5: Frontend - Service Layer

**Location**: `frontend/app/services/{feature}/`

// turbo
1. Tạo DTOs

```tsx
// dto/voucher.request.ts
export interface CreateVoucherRequest {
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
}

// dto/voucher.response.ts
export interface VoucherDto {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
}
```

// turbo
2. Tạo Service

```tsx
// voucher.service.ts
export const voucherService = {
  getVouchers: async (params: GetVouchersRequest) => {
    const response = await axiosClient.get("/api/vouchers", { params });
    return response.data;
  },
  
  createVoucher: async (data: CreateVoucherRequest) => {
    const response = await axiosClient.post("/api/vouchers", data);
    return response.data;
  },
};
```

---

## Step 6: Frontend - React Query Hook

**Location**: `frontend/app/hooks/react-query/`

```tsx
// use-voucher.query.ts
export const voucherKeys = {
  all: ["vouchers"] as const,
  list: (filters: any) => [...voucherKeys.all, "list", filters] as const,
};

export function useVouchers(filters: GetVouchersRequest) {
  return useQuery({
    queryKey: voucherKeys.list(filters),
    queryFn: () => voucherService.getVouchers(filters),
  });
}

export function useCreateVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: voucherService.createVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voucherKeys.all });
    },
  });
}
```

---

## Step 7: Frontend - Feature Component

**Location**: `frontend/app/components/feature/{feature}/`

```tsx
// voucher.form.tsx
export function VoucherForm() {
  const { mutate, isPending } = useCreateVoucher();
  const form = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherSchema),
  });

  const onSubmit = (data: VoucherFormValues) => {
    mutate(data, {
      onSuccess: () => toast.success("Voucher created!"),
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
}
```

---

## Step 8: Frontend - Route

**Location**: `frontend/app/routes/`

```tsx
// routes/admin/vouchers.tsx
export default function VouchersPage() {
  return (
    <AdminLayout>
      <VoucherList />
    </AdminLayout>
  );
}

export function meta() {
  return [{ title: "Vouchers | Admin" }];
}
```

---

## Checklist Summary

| Layer | Files Created | Verified |
|-------|--------------|----------|
| Domain | Entity | ☐ |
| Infrastructure | Config, Migration | ☐ |
| Application | Command/Query + Handler + Validator + Result | ☐ |
| API | Controller endpoint | ☐ |
| Frontend Service | DTO + Service | ☐ |
| Frontend Hook | React Query hook | ☐ |
| Frontend Component | Feature component | ☐ |
| Frontend Route | Page route | ☐ |

---

## Verification Steps

1. **Backend**: Run `dotnet build` - no errors
2. **Migration**: Run `dotnet ef database update`
3. **API Test**: Test endpoint with Postman/Thunder Client
4. **Frontend**: Run `pnpm dev` - no errors
5. **Integration**: Test full flow from UI to database
