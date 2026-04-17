# Copilot Workspace Instructions

**Sneaker Shop** — fullstack e-commerce (.NET 9 + React Router 7 + PostgreSQL).

> **Nguyên tắc context**: Chỉ load file chi tiết khi cần. File này là entry-point duy nhất — đọc nó trước, rồi follow link khi task yêu cầu.

---

## Context Loading Strategy

Không load tất cả docs cùng lúc. Chọn đúng file theo task:

| Task type | Load files |
|-----------|------------|
| Backend feature | [docs/BACKEND_ARCHITECTURE_RULES.md](docs/BACKEND_ARCHITECTURE_RULES.md), [.agent/skills/api-skill.md](.agent/skills/api-skill.md) |
| Frontend feature | [docs/FRONTEND_ARCHITECTURE_RULES.md](docs/FRONTEND_ARCHITECTURE_RULES.md), [.agent/skills/frontend-skill.md](.agent/skills/frontend-skill.md) |
| Database/schema | [docs/DATABASE.md](docs/DATABASE.md), [.agent/skills/database-skill.md](.agent/skills/database-skill.md) |
| Auth/JWT | [docs/JWT_AUTHENTICATION.md](docs/JWT_AUTHENTICATION.md) |
| Image upload | [docs/CLOUDINARY_IMAGE_UPLOAD.md](docs/CLOUDINARY_IMAGE_UPLOAD.md) |
| API endpoints | [docs/SHOP_API_DOCUMENTATION.md](docs/SHOP_API_DOCUMENTATION.md), [docs/CART_API_DOCUMENTATION.md](docs/CART_API_DOCUMENTATION.md) |
| New feature (full-stack) | [.agent/workflows/feature-flow.md](.agent/workflows/feature-flow.md) |
| Bug fix | [.agent/workflows/bug-fix-flow.md](.agent/workflows/bug-fix-flow.md) |
| Testing | [.agent/rules/testing.md](.agent/rules/testing.md) |
| Tech stack check | [.agent/rules/tech-stack.md](.agent/rules/tech-stack.md) |

---

## Critical Rules (ALWAYS apply)

### Backend (.NET 9)
- **No `namespace` declarations** — file-scoped types only.
- **Clean Architecture**: `Api → Application → Domain`; `Infrastructure → Application`. Domain has zero dependencies.
- **CQRS**: Controllers call MediatR only. Command = 4 files (Command, Handler, Validator, Result). Query = 3 files.
- **FluentValidation** in Application layer. Validators auto-registered. Error messages in Vietnamese.
- **No entity exposure** — always return records/DTOs. Use `AsNoTracking()` for read queries.
- **IUnitOfWork** for all data access. Transaction via `ExecuteInTransactionAsync` or `BeginTransactionAsync`.
- **BaseEntity** (Id, CreatedAt, UpdatedAt) — all entities inherit this.
- **BaseGetRequest** (PageNumber, PageSize, Search) — all list queries inherit this.

### Frontend (React Router 7)
- **Thin routes**: `app/routes/**` only export `meta()` + mount a feature component. Zero logic.
- **Feature components**: `app/components/feature/**` — business logic, data fetching, forms.
- **Common components**: `app/components/common/**` — presentational only, no service calls.
- **Services**: `app/services/**` — typed DTOs + API calls via Axios. Always return `ApiResponse<T>`.
- **React Query** for server-state. **Redux** only for auth, checkout, admin UI state.
- **Forms**: react-hook-form + Zod validation. Schemas in `app/lib/validation/`.
- **Import alias**: `~/` = `app/`. Import order: external → `~/` absolute → relative.

### Domain Invariants (break these = production bug)
- `SellableItem`: type must match FK — `SNEAKER_VARIANT` ↔ `sneaker_variant_id`, `ACCESSORY` ↔ `accessory_id`.
- Inventory: `available = on_hand - reserved`. Update reserved on order place/cancel, on_hand on fulfill/return.
- Order total: `subtotal - discount_total - redeemed_amount + shipping_fee`.
- Voucher: one per order, enforce active window + scope + usage limits.
- Loyalty: balance via transactions only, redeem = negative points.

---

## Build & Run

```bash
# Backend (from backend/)
dotnet restore && dotnet build
dotnet run --project Backend.Api          # API at https://localhost:7xxx
dotnet ef migrations add {Name} -p Backend.Infrastructure -s Backend.Api
dotnet ef database update -p Backend.Infrastructure -s Backend.Api

# Frontend (from frontend/)
pnpm install
pnpm dev                                  # Dev server
pnpm build                                # Production build
pnpm typecheck                            # Type check + route generation
pnpm format                               # Prettier
```

---

## Find Real Examples (don't guess patterns)

| Pattern | Example file to read |
|---------|---------------------|
| Controller | `Backend.Api/Controllers/Shop/SneakerController.cs` |
| Command + Handler | `Backend.Application/Features/Shop/Product/Sneaker/Commands/CreateSneaker/` |
| Query + Handler | `Backend.Application/Features/Shop/Product/Sneaker/Queries/GetSneaker/` |
| Validator | Any `*Validator.cs` in `Backend.Application/Features/` |
| Entity | `Backend.Domain/Entities/Shop/Sneaker.cs` |
| Entity Config | `Backend.Infrastructure/Data/Configurations/` |
| Frontend service | `frontend/app/services/shop/sneaker/sneaker.service.ts` |
| React Query hook | `frontend/app/hooks/react-query/use-sneaker.query.tsx` |
| Feature component | `frontend/app/components/feature/shop/sneaker/sneaker-list/` |
| Route file | `frontend/app/routes/shop/sneaker/list.tsx` |
| Redux slice | `frontend/app/store/auth/auth.slice.ts` |
| Zod schema | `frontend/app/lib/validation/auth/login.schema.ts` |
| Route config | `frontend/app/routes.ts` |

---

## Common Pitfalls

- **Forgot `AsNoTracking()`** on read queries → performance waste + tracking bugs.
- **Forgot `CancellationToken`** parameter in handlers → unresponsive under load.
- **Logic in controller** → must be in Handler. Controller = 1 line `mediator.Send()`.
- **Logic in route file** → must be in feature component. Route = mount + meta only.
- **Missing `queryClient.invalidateQueries`** after mutation → stale UI.
- **Using `useState` for server data** → use React Query instead.
- **Exposing entity in API response** → always map to DTO/record.
- **Missing validator for command** → validation pipeline skips silently.
- **Using `namespace` in C#** → project uses file-scoped types exclusively.

---

## If Unsure

Add a `// TODO:` comment and ask for clarification rather than guessing.
