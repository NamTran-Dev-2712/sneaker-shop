# Copilot Workspace Instructions

Use this file as the workspace-wide default. Keep changes inside existing project structure and prefer linking to source docs over restating full rules.

## Architecture

- Backend uses 4-layer Clean Architecture + CQRS: `Api → Application → Domain`, and `Infrastructure → Application`.
- Backend dependency boundaries are strict:
	- Domain has no external layer dependencies.
	- Application must not reference Infrastructure.
	- API controllers must not contain business logic or direct data access.
- Frontend uses React Router 7 with thin-route architecture:
	- Route files in `frontend/app/routes/**` only handle SEO/meta and mount features.
	- Feature logic belongs in `frontend/app/components/feature/**`.
	- API calls belong in `frontend/app/services/**` using typed DTOs.

## Code Style & Conventions

- Backend (.NET 9):
	- Do not add C# `namespace` declarations.
	- Keep one type per file.
	- Controllers call MediatR Commands/Queries only.
	- Use FluentValidation in Application layer.
	- Use Result pattern and DTO-based API contracts (do not expose entities).
- Frontend:
	- Prefer React Query for server-state fetching/caching.
	- Use Redux only for shared cross-feature state.
	- Keep reusable UI in `frontend/app/components/common/**` (presentational only).

## Build and Test

- Backend (from `backend/`):
	- Restore/build: `dotnet restore`, `dotnet build`
	- Run API: `dotnet run` from `backend/Backend.Api`
	- Migrations: see `backend/Backend.Infrastructure/Data/README.md`
- Frontend (from `frontend/`):
	- Install: `pnpm install`
	- Dev: `pnpm dev`
	- Build: `pnpm build`
	- Typecheck: `pnpm typecheck`
	- Format: `pnpm format`
- Tests/linting are not fully standardized at workspace root yet; if adding tests, follow existing feature patterns and document new commands.

## High-Impact Domain Invariants

- Sellable-item polymorphism must be valid (`type` must match related FK).
- Inventory math must preserve: `available = on_hand - reserved`.
- Order total formula: `subtotal - discount_total - redeemed_amount + shipping_fee`.
- Voucher/loyalty flows must enforce usage, scope, and transaction constraints.

## Source of Truth (Link-First)

- Agent index and workflow entry: `.agent/SKILL.md`, `.agent/AGENTS.md`
- Core agent rule index: `docs/AI_AGENT_RULES.md`
- Backend architecture details: `docs/BACKEND_ARCHITECTURE_RULES.md`
- Frontend architecture details: `docs/FRONTEND_ARCHITECTURE_RULES.md`
- Data model/invariants: `docs/DATABASE.md`
- Auth, media, and API docs:
	- `docs/JWT_AUTHENTICATION.md`
	- `docs/CLOUDINARY_IMAGE_UPLOAD.md`
	- `docs/SHOP_API_DOCUMENTATION.md`
	- `docs/CART_API_DOCUMENTATION.md`

## Workflows

- `/feature-flow` for new feature implementation.
- `/bug-fix-flow` for debugging and regression fixes.

## If Unsure

Add a TODO and ask for clarification rather than guessing.
