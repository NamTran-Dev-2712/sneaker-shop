---
name: sneaker-shop-skill
description: Comprehensive skill set for Sneaker Shop fullstack development with .NET 9 + React Router 7
version: 1.0.0
---

# Sneaker Shop Agent Skill

Skill này cung cấp context và hướng dẫn cho AI agent để vibe coding hiệu quả nhất trong project Sneaker Shop.

## Quick Reference

| Category | Files |
|----------|-------|
| **Rules** | [tech-stack](rules/tech-stack.md), [architecture](rules/architecture.md), [testing](rules/testing.md) |
| **Skills** | [database](skills/database-skill.md), [api](skills/api-skill.md), [frontend](skills/frontend-skill.md) |
| **Workflows** | [feature-flow](workflows/feature-flow.md), [bug-fix-flow](workflows/bug-fix-flow.md) |

---

## Project Overview

```
Sneaker Shop - E-commerce platform for sneakers & accessories
├── backend/   → .NET 9 Clean Architecture + CQRS
├── frontend/  → React Router 7 + Redux + TanStack Query
└── docs/      → Detailed documentation
```

## Tech Stack Summary

| Layer | Stack |
|-------|-------|
| Backend | .NET 9, EF Core, PostgreSQL, MediatR, FluentValidation |
| Frontend | React 19, React Router 7, Redux Toolkit, TanStack Query, TailwindCSS 4 |
| Infrastructure | Docker, Cloudinary, JWT (HttpOnly cookies) |

---

## Critical Rules (MUST FOLLOW)

### Backend
1. **No namespace declarations** - Use file-scoped types only
2. **Clean Architecture** - Api → Application → Domain; Infrastructure → Application
3. **CQRS** - Commands (write) and Queries (read) with Handler + Validator + Result
4. **FluentValidation** - All input validation in Application layer

### Frontend
1. **Thin routes** - Only SEO meta + mount feature components
2. **Feature components** - Business logic in `components/feature/`
3. **Service layer** - All API calls through `services/` with DTOs
4. **State strategy** - React Query for server data, Redux for shared state

---

## When to Use What

### Phát triển tính năng mới
→ Xem [workflows/feature-flow.md](workflows/feature-flow.md)

### Debug và fix lỗi
→ Xem [workflows/bug-fix-flow.md](workflows/bug-fix-flow.md)

### Database operations
→ Xem [skills/database-skill.md](skills/database-skill.md)

### API design
→ Xem [skills/api-skill.md](skills/api-skill.md)

### Frontend development
→ Xem [skills/frontend-skill.md](skills/frontend-skill.md)

---

## Documentation Sources

Chi tiết hơn xem trong `docs/`:
- `docs/AI_AGENT_RULES.md` - Tổng hợp rules
- `docs/BACKEND_ARCHITECTURE_RULES.md` - Backend chi tiết
- `docs/FRONTEND_ARCHITECTURE_RULES.md` - Frontend chi tiết
- `docs/DATABASE.md` - Schema và business rules
- `docs/JWT_AUTHENTICATION.md` - Auth implementation
- `docs/CLOUDINARY_IMAGE_UPLOAD.md` - Image upload
- `docs/SHOP_API_DOCUMENTATION.md` - API reference
- `docs/CART_API_DOCUMENTATION.md` - Cart API reference
