---
name: tech-stack
description: Package constraints và version rules — chỉ đọc khi cần kiểm tra dependency
---

# Technology Stack Rules

## Backend (.NET 9)

| Tech | Version | Purpose |
|------|---------|---------|
| .NET / ASP.NET Core | 9 | Runtime + Web API |
| Entity Framework Core | 9 | ORM (PostgreSQL) |
| MediatR | 12+ | CQRS mediator |
| FluentValidation | 11+ | Request validation |
| BCrypt.Net | 4+ | Password hashing |
| Cloudinary | 1.25+ | Image storage |

### Package Policy

```
✅ ALLOWED: MediatR, FluentValidation, BCrypt.Net-Next, Npgsql.EFCore, CloudinaryDotNet
❌ NOT ALLOWED: AutoMapper (use manual mapping), Hangfire (use hosted services), Dapper (use EF Core)
```

## Frontend (React 19 + React Router 7)

| Tech | Version | Purpose |
|------|---------|---------|
| React Router | 7 | Routing + SSR |
| Redux Toolkit | 2.x | Shared state (auth, checkout) |
| TanStack Query | 5.x | Server data fetching |
| Axios | 1.x | HTTP client |
| Zod | 4.x | Schema validation |
| react-hook-form | 7.x | Form handling |
| TailwindCSS | 4 | Styling (CSS-first config) |
| ShadcnUI | latest | Radix UI components |

### Package Policy

```
✅ ALLOWED: @tanstack/react-query, axios, zod, react-hook-form, @reduxjs/toolkit, lucide-react, date-fns
❌ NOT ALLOWED: moment.js (use date-fns), styled-components (use Tailwind), MobX, formik
```

## Infrastructure

- **Docker** for containerization
- **Cloudinary** for CDN + image processing
- **JWT** in HttpOnly cookies (access + refresh tokens)
- **pnpm** for frontend package management

## Key Framework Features Used

- **.NET 9**: File-scoped types (no namespace), records for DTOs, primary constructors, global usings
- **React Router 7**: SSR enabled, type-safe routes, nested layouts
- **TailwindCSS 4**: CSS-first config, native CSS variables, auto content detection
- **EF Core**: Snake_case naming convention (`UseSnakeCaseNamingConvention()`), retry on failure
