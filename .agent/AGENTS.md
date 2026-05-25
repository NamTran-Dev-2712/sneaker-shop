# AGENTS.md

Project: **Sneaker Shop** — fullstack e-commerce (.NET 9 + React Router 7 + PostgreSQL)

> Entry point: [.github/copilot-instructions.md](../.github/copilot-instructions.md) — luôn đọc file đó trước.

## Agent Routing Table

Khi nhận task, đọc đúng file cần thiết — không load tất cả.

| Task | Load file(s) |
|------|-------------|
| Tạo tính năng mới (full-stack) | [workflows/feature-flow.md](workflows/feature-flow.md) |
| Fix bug | [workflows/bug-fix-flow.md](workflows/bug-fix-flow.md) |
| Backend CQRS / API | [skills/api-skill.md](skills/api-skill.md) |
| Frontend component / hook | [skills/frontend-skill.md](skills/frontend-skill.md) |
| Database / migration / query | [skills/database-skill.md](skills/database-skill.md) |
| Tech stack / dependency check | [rules/tech-stack.md](rules/tech-stack.md) |
| Testing | [rules/testing.md](rules/testing.md) |

## Structure

```
.agent/
├── rules/              # Constraints & standards
│   ├── tech-stack.md   # Allowed packages, versions
│   └── testing.md      # Test patterns & coverage targets
├── skills/             # Domain expertise (code patterns)
│   ├── api-skill.md    # CQRS, Controller, Validator templates
│   ├── database-skill.md  # EF Core, migration, query optimization
│   └── frontend-skill.md  # Component, service, hook patterns
└── workflows/          # Step-by-step guides
    ├── feature-flow.md # Full-stack feature implementation
    └── bug-fix-flow.md # Debug & regression fix
```

## Detailed Docs (in `docs/`)

Chỉ đọc khi cần context sâu:

| Doc | Nội dung |
|-----|----------|
| [BACKEND_ARCHITECTURE_RULES.md](../docs/BACKEND_ARCHITECTURE_RULES.md) | Clean Architecture, CQRS rules chi tiết, layer boundaries |
| [FRONTEND_ARCHITECTURE_RULES.md](../docs/FRONTEND_ARCHITECTURE_RULES.md) | Route/component/service layer rules chi tiết |
| [DATABASE.md](../docs/DATABASE.md) | Full ERD, business invariants, table descriptions |
| [JWT_AUTHENTICATION.md](../docs/JWT_AUTHENTICATION.md) | Auth flow, token handling, cookie security |
| [CLOUDINARY_IMAGE_UPLOAD.md](../docs/CLOUDINARY_IMAGE_UPLOAD.md) | Image upload validation & Cloudinary integration |
| [SHOP_API_DOCUMENTATION.md](../docs/SHOP_API_DOCUMENTATION.md) | API endpoint reference |
| [CART_API_DOCUMENTATION.md](../docs/CART_API_DOCUMENTATION.md) | Cart API reference |

## Rules Summary (tham chiếu nhanh)

> Chi tiết → [copilot-instructions.md](../.github/copilot-instructions.md#critical-rules-always-apply)

- **Không `namespace`** trong C#. File-scoped types only.
- **Controller chỉ gọi MediatR**. Zero logic.
- **Route chỉ mount feature component** + meta. Zero logic.
- **Domain invariants**: SellableItem polymorphic, Inventory formula, Order total formula.
- **Ưu tiên TODO** hoặc hỏi thay vì đoán.
