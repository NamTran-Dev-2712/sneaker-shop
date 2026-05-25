---
name: sneaker-shop-skill
description: Comprehensive skill set for Sneaker Shop fullstack development with .NET 9 + React Router 7
version: 2.0.0
---

# Sneaker Shop Agent Skill

Entry point: [.github/copilot-instructions.md](../.github/copilot-instructions.md) — đọc trước khi bắt đầu bất kỳ task nào.

## Quick Lookup

| Cần gì? | Đọc file |
|----------|----------|
| Rules + conventions | [copilot-instructions.md](../.github/copilot-instructions.md) |
| Agent routing | [AGENTS.md](AGENTS.md) |
| Backend CQRS + API | [skills/api-skill.md](skills/api-skill.md) |
| Frontend component + hook | [skills/frontend-skill.md](skills/frontend-skill.md) |
| Database + migration | [skills/database-skill.md](skills/database-skill.md) |
| Tech stack | [rules/tech-stack.md](rules/tech-stack.md) |
| Testing | [rules/testing.md](rules/testing.md) |
| New feature workflow | [workflows/feature-flow.md](workflows/feature-flow.md) |
| Bug fix workflow | [workflows/bug-fix-flow.md](workflows/bug-fix-flow.md) |

## Tech Stack (tóm tắt)

| Layer | Stack |
|-------|-------|
| Backend | .NET 9, EF Core, PostgreSQL, MediatR, FluentValidation |
| Frontend | React 19, React Router 7, Redux Toolkit, TanStack Query 5, TailwindCSS 4, ShadcnUI |
| Infrastructure | Docker, Cloudinary, JWT (HttpOnly cookies) |

## Project Structure

```
backend/
├── Backend.Api/           → Controllers, Middlewares, Extensions
├── Backend.Application/   → Features/{Domain}/Commands|Queries (CQRS)
├── Backend.Domain/        → Entities, Enums (zero dependencies)
└── Backend.Infrastructure/→ EF Core, Repositories, External Services

frontend/app/
├── routes/                → Thin routes (meta + mount only)
├── components/feature/    → Business logic + data fetching
├── components/common/     → Reusable presentational UI
├── components/ui/         → ShadcnUI primitives
├── services/              → API calls + typed DTOs
├── hooks/react-query/     → Query/mutation hooks
├── store/                 → Redux slices (auth, checkout, admin)
├── types/                 → Entity types + global types
└── lib/validation/        → Zod schemas
```
