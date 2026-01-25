# AI Agent Rules (Sneaker Shop)

This file is a short index and summary of project rules for AI coding assistants.

Primary sources (read when in doubt):
- docs/BACKEND_ARCHITECTURE_RULES.md
- docs/FRONTEND_ARCHITECTURE_RULES.md
- docs/DATABASE.md
- docs/JWT_AUTHENTICATION.md
- docs/CLOUDINARY_IMAGE_UPLOAD.md
- docs/SHOP_API_DOCUMENTATION.md

Global rules:
- Keep changes within the existing structure; do not invent new layers or folders.
- Follow Clean Architecture and CQRS in the backend.
- Do not add C# namespace declarations. One type per file.
- Prefer TODO and ask if a requirement is unclear.

Backend summary:
- Api layer: controllers map request to Command or Query and return Result or DTO only.
- Application: feature-first foldering; Commands and Queries have Handler, Validator, and Result or DTO.
- Use FluentValidation in Application; Domain does not validate input.
- Domain: pure entities and enums only; no DTOs; no dependencies on Application or Infrastructure.
- Infrastructure: implement Application interfaces; no business logic.

Frontend summary (Remix):
- app/routes is thin: render layout and feature component plus SEO only. No business logic or API calls.
- Feature logic lives in app/components/feature (forms, local state, validation, service calls).
- app/components/common is reusable presentational UI only; no service calls or store access.
- app/services owns API calls, DTOs, server helpers; no UI rendering.
- app/store is Redux for shared state only; prefer React Query for cached data fetch.
- Naming: kebab-case files, PascalCase components; import order external, internal, relative.

Data and domain invariants (high impact):
- Sellable_Item polymorphic rule: type must match FK (sneaker_variant or accessory); sku unique.
- Inventory available = on_hand - reserved; update reserved on order place or cancel; reduce on_hand on fulfill.
- Order total = subtotal - discount_total - redeemed_amount + shipping_fee.
- Voucher redemption: one voucher per order; enforce active window, scope, usage limits.
- Loyalty: points balance updated via transactions only; redeem uses negative points; link to order when applicable.

Auth and media:
- JWT: access and refresh tokens in HttpOnly cookies with strict validation.
- Image uploads: validate size, extension, mime type, and magic numbers before Cloudinary upload.

API and DTOs:
- Use DTOs for request and response; do not expose entities.
- Follow docs/SHOP_API_DOCUMENTATION.md for endpoints, query params, and response shape.
