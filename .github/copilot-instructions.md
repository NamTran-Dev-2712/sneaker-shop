# Copilot Instructions

> See `.agent/SKILL.md` and `docs/AI_AGENT_RULES.md` for complete details.

## Quick Rules

### Backend (.NET 9)
- Clean Architecture + CQRS; **no C# namespaces**
- Controllers only call Commands/Queries via MediatR
- Application must NOT reference Infrastructure
- Use FluentValidation, Result pattern, and DTOs

### Frontend (React Router 7)
- Routes are thin (SEO + mount feature only)
- Feature logic in `app/components/feature/**`
- API calls only in `app/services/**` with typed DTOs
- React Query for data fetching, Redux for shared state

### Data
- Sellable_Item polymorphic rule
- Inventory reserve logic
- Order total formula
- Voucher and loyalty constraints

## Workflows

- `/feature-flow` - New feature development
- `/bug-fix-flow` - Debug and fix issues

## If Unsure

Add TODO and ask rather than guessing.
