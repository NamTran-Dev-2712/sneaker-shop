# AI Agent Rules — Cross-Reference Index

> File này KHÔNG chứa rule content. Tất cả rules nằm trong canonical sources bên dưới.
> Entry point chính: [.github/copilot-instructions.md](../.github/copilot-instructions.md)

## Canonical Sources

| Topic | File |
|-------|------|
| **Entry point** (critical rules, build commands, examples) | `.github/copilot-instructions.md` |
| Backend architecture | `docs/BACKEND_ARCHITECTURE_RULES.md` |
| Frontend architecture | `docs/FRONTEND_ARCHITECTURE_RULES.md` |
| Database schema & invariants | `docs/DATABASE.md` |
| JWT authentication | `docs/JWT_AUTHENTICATION.md` |
| Image upload (Cloudinary) | `docs/CLOUDINARY_IMAGE_UPLOAD.md` |
| Shop API endpoints | `docs/SHOP_API_DOCUMENTATION.md` |
| Cart API endpoints | `docs/CART_API_DOCUMENTATION.md` |

## Agent Skills (load per task)

| Task | Skill file |
|------|------------|
| Backend CQRS/Controller | `.agent/skills/api-skill.md` |
| Database/Migration/Query | `.agent/skills/database-skill.md` |
| Frontend component/hook | `.agent/skills/frontend-skill.md` |

## Agent Rules

| Rule | File |
|------|------|
| Architecture overview | `.agent/rules/architecture.md` |
| Tech stack & packages | `.agent/rules/tech-stack.md` |
| Testing conventions | `.agent/rules/testing.md` |

## Workflows

| Flow | File |
|------|------|
| New feature (full-stack) | `.agent/workflows/feature-flow.md` |
| Bug fix | `.agent/workflows/bug-fix-flow.md` |
