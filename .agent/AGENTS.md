# AGENTS.md

Project: **Sneaker Shop** (fullstack e-commerce platform)

## Entry Points

| Document | Purpose |
|----------|---------|
| [SKILL.md](SKILL.md) | Main skill definition & quick reference |
| [docs/AI_AGENT_RULES.md](../docs/AI_AGENT_RULES.md) | Detailed rules index |

## Structure

```
.agent/
├── rules/           # Core constraints
│   ├── tech-stack.md
│   ├── architecture.md
│   └── testing.md
├── skills/          # Domain expertise
│   ├── database-skill.md
│   ├── api-skill.md
│   └── frontend-skill.md
└── workflows/       # Step-by-step guides
    ├── feature-flow.md
    └── bug-fix-flow.md
```

---

## Critical Rules Summary

### Backend (.NET 9)
- **No namespace declarations** - File-scoped types only
- **Clean Architecture** - Api → Application → Domain
- **CQRS** - Command/Query with Handler + Validator + Result
- **FluentValidation** - Validate in Application layer
- **No logic in Controllers** - Only call MediatR

### Frontend (React Router 7)
- **Thin routes** - Only SEO + mount feature component
- **Feature logic** - In `components/feature/**`
- **API calls** - Only via `services/**` with DTOs
- **Common components** - Presentational only, no service calls
- **State** - React Query for data, Redux for shared state

### Data Invariants
- `Sellable_Item` polymorphic: type must match FK
- Inventory: `available = on_hand - reserved`
- Order: `total = subtotal - discount_total - redeemed_amount + shipping_fee`
- Voucher: One per order, check scope/limits

---

## Workflow Shortcuts

| Action | Workflow |
|--------|----------|
| New feature | `/feature-flow` |
| Fix bug | `/bug-fix-flow` |

---

## When Unsure

> **Ưu tiên TODO hoặc hỏi thay vì đoán**

If a request conflicts with these rules, ask for clarification or add a TODO comment.
