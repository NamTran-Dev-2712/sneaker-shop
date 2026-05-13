---
trigger: always_on
description: Architecture summary — chi tiết trong docs/BACKEND_ARCHITECTURE_RULES.md và docs/FRONTEND_ARCHITECTURE_RULES.md
---

# Architecture Rules (Summary)

> Chi tiết backend → [docs/BACKEND_ARCHITECTURE_RULES.md](../../docs/BACKEND_ARCHITECTURE_RULES.md)
> Chi tiết frontend → [docs/FRONTEND_ARCHITECTURE_RULES.md](../../docs/FRONTEND_ARCHITECTURE_RULES.md)

## Layer Dependencies

```
Backend.Api → Backend.Application → Backend.Domain
Backend.Infrastructure → Backend.Application → Backend.Domain
```

**BẮT BUỘC:**
- Domain KHÔNG reference bất kỳ layer nào
- Application KHÔNG reference Infrastructure
- Api KHÔNG truy cập DbContext/Repository trực tiếp

## Backend: CQRS Pattern

```
Command = 4 files: Command.cs, CommandHandler.cs, CommandValidator.cs, Result.cs
Query   = 3 files: Query.cs, QueryHandler.cs, Result.cs
```

Location: `Backend.Application/Features/{Domain}/{Commands|Queries}/{Action}/`

## Frontend: Thin-Route Pattern

```
Route file     → meta() + mount feature component. ZERO logic.
Feature comp   → components/feature/** — logic, hooks, forms
Common comp    → components/common/** — presentational, no service calls
Service layer  → services/** — API calls + DTOs
```

## No Namespace Rule (BẮT BUỘC)

```csharp
// ❌ WRONG
namespace Backend.Application.Features.Auth;
public sealed record RegisterCommand(...);

// ✅ CORRECT — file-scoped, no namespace
public sealed record RegisterCommand(...) : IRequest<RegisterResult>;
```

## State Management (Frontend)

| Data type | Use |
|-----------|-----|
| Server data (lists, details) | React Query |
| Auth, cart count | Redux + persist |
| Form data | react-hook-form + Zod |
| UI state (modals, toggles) | useState |
| URL state (filters, pagination) | searchParams |

### Component Layer Separation

| Layer | Allowed | Not Allowed |
|-------|---------|-------------|
| `routes/` | Mount features, SEO meta | API calls, business logic |
| `components/feature/` | API calls, forms, local state, Redux | N/A |
| `components/common/` | Props-based render | Service calls, Redux access |
| `services/` | HTTP calls, DTO definitions | UI rendering |
| `store/` | Shared state only | Local component state |

---

### State Management Decision Matrix

| Scenario | Use |
|----------|-----|
| Server data (lists, details) | React Query |
| Auth/User session | Redux + persist |
| Form state | react-hook-form |
| UI state (modal open/close) | React useState |
| Cross-component shared data | Redux |