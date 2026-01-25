---
name: tech-stack
description: Quy định về .NET 9, React Router 7, PostgreSQL, Docker và các công nghệ sử dụng trong project
---

# Technology Stack Rules

## Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **.NET** | 9 | Runtime & SDK |
| **ASP.NET Core** | 9 | Web API framework |
| **Entity Framework Core** | 9 | ORM |
| **PostgreSQL** | 16+ | Database |
| **MediatR** | 12+ | CQRS mediator |
| **FluentValidation** | 11+ | Request validation |
| **BCrypt.Net** | 4+ | Password hashing |
| **Cloudinary** | 1.25+ | Image storage |

### Backend Dependencies Enforcement

```
✅ ALLOWED packages:
- MediatR, FluentValidation, BCrypt.Net-Next
- Npgsql.EntityFrameworkCore.PostgreSQL
- CloudinaryDotNet
- Microsoft.AspNetCore.* (built-in)

❌ NOT ALLOWED without approval:
- AutoMapper (use manual mapping/records)
- Hangfire (use hosted services if needed)
- Dapper (use EF Core only)
```

---

## Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19 | UI library |
| **React Router** | 7 | Routing & SSR |
| **Redux Toolkit** | 2.x | Shared state |
| **TanStack Query** | 5.x | Data fetching & caching |
| **Axios** | 1.x | HTTP client |
| **Zod** | 4.x | Schema validation |
| **react-hook-form** | 7.x | Form handling |
| **TailwindCSS** | 4 | Styling |
| **ShadcnUI** | latest | Component library |

### Frontend Dependencies Enforcement

```
✅ ALLOWED packages:
- @tanstack/react-query, axios, zod
- react-hook-form, @hookform/resolvers
- @reduxjs/toolkit, react-redux, redux-persist
- lucide-react (icons)
- date-fns, lodash-es

❌ NOT ALLOWED without approval:
- moment.js (use date-fns)
- styled-components (use TailwindCSS)
- MobX (use Redux or React Query)
- formik (use react-hook-form)
```

---

## Infrastructure

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Cloudinary** | CDN & image processing |
| **JWT** | Authentication (HttpOnly cookies) |

---

## Package Manager Rules

| Layer | Package Manager |
|-------|----------------|
| Backend | `dotnet` CLI, NuGet |
| Frontend | `pnpm` (preferred) or `npm` |

---

## Version Compatibility Notes

### .NET 9 Features Used
- File-scoped types (implicit namespace)
- Records for DTOs and Commands
- Primary constructors
- Global usings via `Directory.Build.props`

### React Router 7 Features Used
- Server-side rendering (SSR)
- Type-safe routes
- Nested layouts
- Data loading patterns

### TailwindCSS v4 Features Used
- CSS-first configuration
- Native CSS variables
- Automatic content detection
