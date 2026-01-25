---
name: testing
description: Quy chuẩn viết Unit Test và Integration Test cho Backend và Frontend
---

# Testing Standards

## Backend Testing

### Test Project Structure

```
Backend.Tests/
├── Unit/
│   ├── Application/
│   │   ├── Commands/
│   │   └── Queries/
│   └── Domain/
├── Integration/
│   ├── Controllers/
│   └── Repositories/
└── Fixtures/
```

### Unit Test Naming Convention

```
{MethodName}_{Scenario}_{ExpectedResult}
```

Examples:
- `Handle_ValidCommand_ReturnsSuccess`
- `Handle_InvalidEmail_ThrowsValidationException`
- `Validate_EmptyPassword_HasError`

---

### Command Handler Test Template

```csharp
public sealed class CreateSneakerCommandHandlerTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IImageService> _imageServiceMock;
    private readonly CreateSneakerCommandHandler _handler;

    public CreateSneakerCommandHandlerTests()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _imageServiceMock = new Mock<IImageService>();
        _handler = new CreateSneakerCommandHandler(
            _unitOfWorkMock.Object,
            _imageServiceMock.Object
        );
    }

    [Fact]
    public async Task Handle_ValidCommand_ReturnsSneakerId()
    {
        // Arrange
        var command = new CreateSneakerCommand { /* ... */ };
        _imageServiceMock
            .Setup(x => x.UploadImageAsync(It.IsAny<IFormFile>(), "sneakers"))
            .ReturnsAsync("https://cloudinary.com/image.jpg");

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.Id > 0);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }
}
```

---

### Validator Test Template

```csharp
public sealed class CreateSneakerCommandValidatorTests
{
    private readonly CreateSneakerCommandValidator _validator;

    public CreateSneakerCommandValidatorTests()
    {
        _validator = new CreateSneakerCommandValidator();
    }

    [Fact]
    public void Validate_EmptyName_HasValidationError()
    {
        // Arrange
        var command = new CreateSneakerCommand { Name = "" };

        // Act
        var result = _validator.Validate(command);

        // Assert
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Name");
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    [InlineData("   ")]
    public void Validate_InvalidName_HasError(string name)
    {
        var command = new CreateSneakerCommand { Name = name };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
    }
}
```

---

### Integration Test Template

```csharp
public sealed class SneakerControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public SneakerControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetSneakers_ReturnsOk()
    {
        // Act
        var response = await _client.GetAsync("/api/sneakers");

        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("items", content);
    }
}
```

---

## Frontend Testing

### Test File Naming

```
{component-name}.test.tsx
{hook-name}.test.ts
{service-name}.test.ts
```

### Component Test Template

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "./product-card";

describe("ProductCard", () => {
  const mockProduct = {
    id: 1,
    name: "Air Max 90",
    price: 150,
    image: "/test.jpg",
  };

  it("renders product name", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Air Max 90")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<ProductCard product={mockProduct} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledWith(1);
  });
});
```

---

### Hook Test Template

```tsx
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProducts } from "./use-products";

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

describe("useProducts", () => {
  it("fetches products successfully", async () => {
    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(10);
  });
});
```

---

## Test Coverage Requirements

| Layer | Minimum Coverage |
|-------|-----------------|
| Command Handlers | 80% |
| Validators | 100% |
| Domain Entities | 70% |
| Controllers (Integration) | 60% |
| Frontend Components | 50% |

---

## Testing Tools

| Backend | Frontend |
|---------|----------|
| xUnit | Vitest |
| Moq | Testing Library |
| FluentAssertions | MSW (API mocking) |
| WebApplicationFactory | Playwright (E2E) |

---

## Test Data Guidelines

1. **Use Builders**: Create test data builders for complex objects
2. **Avoid Magic Numbers**: Use constants with descriptive names
3. **Isolate Tests**: Each test should be independent
4. **Mock External Services**: Never call real APIs/databases in unit tests
