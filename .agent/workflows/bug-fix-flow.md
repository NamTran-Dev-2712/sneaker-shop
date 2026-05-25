---
description: Quy trình debug và vá lỗi cho Backend và Frontend
---

# Bug Fix Flow

Quy trình step-by-step để debug và vá lỗi trong project Sneaker Shop.

## Step 1: Reproduce & Identify Layer

### 1.1 Reproduce the Bug

- Collect exact steps to reproduce
- Note the error message/behavior
- Identify affected endpoint/page

### 1.2 Identify Layer

```
Error Type                 → Layer to Check
──────────────────────────────────────────────
HTTP 400 Bad Request       → Validator (Application)
HTTP 401 Unauthorized      → AuthController, TokenService
HTTP 404 Not Found         → Handler, Repository
HTTP 500 Internal Error    → Handler, Infrastructure
UI not updating            → React Query cache, Redux state
Form validation error      → Zod schema, react-hook-form
Data not persisting        → DbContext, Transaction
```

---

## Step 2: Trace Data Flow

### Backend Debug Path

```
Request → Controller → MediatR → Validator → Handler → Repository → Database
              ↓                       ↓            ↓
           Logs                   Exception     Query Issue
```

**Debug Checklist:**

1. **Controller**: Check request binding
```csharp
// Add logging to see incoming data
_logger.LogInformation("Received: {@Command}", command);
```

2. **Validator**: Check validation rules
```csharp
var result = new CreateSneakerCommandValidator().Validate(command);
// Check result.Errors
```

3. **Handler**: Check business logic
```csharp
// Add breakpoint or logging before each operation
```

4. **Repository**: Check EF Core query
```csharp
// Enable EF Core logging in appsettings
"Logging": {
  "LogLevel": {
    "Microsoft.EntityFrameworkCore.Database.Command": "Information"
  }
}
```

### Frontend Debug Path

```
User Action → Event Handler → Service Call → React Query → State Update → Re-render
                   ↓               ↓              ↓
              Console log      Network tab    DevTools
```

**Debug Checklist:**

1. **Network Tab**: Check request/response
2. **React Query DevTools**: Check cache state
3. **Redux DevTools**: Check state changes
4. **Console**: Check for errors/warnings

---

## Step 3: Fix in Correct Layer

### Fix Location Rules

| Issue Type | Fix Location |
|------------|--------------|
| Wrong validation | `Application/Features/{Feature}/Commands/{Action}/{Action}CommandValidator.cs` |
| Business logic error | `Application/Features/{Feature}/Commands/{Action}/{Action}CommandHandler.cs` |
| Database query issue | Handler or Repository |
| API response format | Handler Result/DTO |
| UI display issue | `components/feature/{feature}/` |
| Form validation | Zod schema in component |
| State update issue | React Query hook or Redux slice |

### Example Fixes

**Validation Fix:**
```csharp
// Before: Missing validation
RuleFor(x => x.Email).EmailAddress();

// After: Required + format
RuleFor(x => x.Email)
    .NotEmpty().WithMessage("Email is required.")
    .EmailAddress().WithMessage("Invalid email format.");
```

**Handler Fix:**
```csharp
// Before: Not checking existence
var brand = await _unitOfWork.Repository<Brand>().GetByIdAsync(command.BrandId);
brand.Name = command.Name; // NullReferenceException!

// After: Proper null check
var brand = await _unitOfWork.Repository<Brand>().GetByIdAsync(command.BrandId)
    ?? throw new NotFoundException(nameof(Brand), command.BrandId);
```

**Frontend Fix:**
```tsx
// Before: Missing error handling
const { data } = useProducts();
return <div>{data.items.map(...)}</div>; // Error if data is undefined

// After: Proper loading/error states
const { data, isLoading, error } = useProducts();
if (isLoading) return <Loading />;
if (error) return <Error message={error.message} />;
return <div>{data?.items.map(...)}</div>;
```

---

## Step 4: Verify Fix

### Backend Verification

// turbo
1. Build check
```powershell
cd backend
dotnet build
```

2. Test with API client
```bash
# Test the fixed endpoint
curl -X POST http://localhost:5000/api/{endpoint} \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### Frontend Verification

// turbo
1. TypeScript check
```powershell
cd frontend
pnpm typecheck
```

// turbo
2. Dev server test
```powershell
pnpm dev
# Navigate to affected page and test
```

---

## Step 5: Add Regression Test (if applicable)

### Backend Test

```csharp
[Fact]
public async Task Handle_PreviouslyBuggyCase_NowWorks()
{
    // Arrange: Setup the buggy scenario
    var command = new CreateSneakerCommand
    {
        BrandId = 999, // Non-existent brand that caused bug
        Name = "Test"
    };
    
    // Act & Assert: Should throw proper exception now
    await Assert.ThrowsAsync<NotFoundException>(
        () => _handler.Handle(command, CancellationToken.None));
}
```

### Frontend Test

```tsx
it("handles empty data gracefully", () => {
  // Mock empty response that previously caused crash
  server.use(
    rest.get("/api/products", (req, res, ctx) => {
      return res(ctx.json({ items: [], totalItems: 0 }));
    })
  );
  
  render(<ProductList />);
  
  // Should show empty state, not crash
  expect(screen.getByText("No products found")).toBeInTheDocument();
});
```

---

## Common Bug Patterns & Solutions

### Pattern 1: Null Reference in Handler

```csharp
// Problem
var entity = await repo.GetByIdAsync(id);
entity.Property = value; // NullReferenceException

// Solution
var entity = await repo.GetByIdAsync(id)
    ?? throw new NotFoundException(nameof(Entity), id);
```

### Pattern 2: Missing Query Invalidation

```tsx
// Problem: List doesn't update after create
useMutation({
  mutationFn: createProduct,
  // Missing onSuccess
});

// Solution
useMutation({
  mutationFn: createProduct,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: productKeys.lists() });
  },
});
```

### Pattern 3: Race Condition in State Update

```tsx
// Problem: Stale state
const handleClick = () => {
  setCount(count + 1);
  setCount(count + 1); // Still uses old count
};

// Solution: Use updater function
const handleClick = () => {
  setCount(c => c + 1);
  setCount(c => c + 1);
};
```

### Pattern 4: Missing Async/Await

```csharp
// Problem
public void Handle(Command command)
{
    _repository.Save(entity); // Not awaited!
}

// Solution
public async Task Handle(Command command)
{
    await _repository.SaveAsync(entity);
}
```

---

## Bug Fix Checklist

- [ ] Bug reproduced locally
- [ ] Root cause identified
- [ ] Fix applied in correct layer
- [ ] No new warnings/errors introduced
- [ ] Build passes (backend + frontend)
- [ ] Manual test confirms fix
- [ ] Regression test added (if applicable)
- [ ] Related documentation updated (if needed)
