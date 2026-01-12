# Shop API Documentation

API documentation for Brand/Store management in Sneaker Shop Backend.

## Authorization

| Operation | Endpoint | Authorization |
|-----------|----------|---------------|
| **Read** (GET) | All list & detail | 🌐 Public |
| **Create/Update/Delete** | POST, PUT, DELETE | 🔐 ADMIN only |

---

## Brand API

Base URL: `api/brands`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get paginated list with filters |
| GET | `/{id}` | Get brand detail with series |
| POST | `/` | Create brand (multipart/form-data) |
| PUT | `/{id}` | Update brand (multipart/form-data) |
| DELETE | `/{id}` | Soft delete brand |

### Query Parameters (GET `/`)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| pageNumber | int | 1 | Page number |
| pageSize | int | 10 | Items per page |
| search | string? | null | Search by name |
| isActive | bool? | null | Filter by status |
| sortBy | string | "name" | Sort field: name, createdAt, updatedAt |
| sortOrder | string | "asc" | Sort direction: asc, desc |

### Create Brand Request

```json
// multipart/form-data
name: "Nike"           // required
logo: [File]           // required, image file
```

### Update Brand Request

```json
// multipart/form-data
id: 1                  // required, in route and body
name: "Nike"           // required
logo: [File]           // optional
isActive: true         // required
```

---

## Brand Series API

Base URL: `api/brands/{brandId}/series`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create series |
| PUT | `/{seriesId}` | Update series |
| DELETE | `/{seriesId}` | Soft delete series |

### Create/Update Request

```json
{
  "name": "Air Max",    // required
  "isActive": true      // required for update only
}
```

---

## Store API

Base URL: `api/stores`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get paginated list with filters |
| GET | `/{id}` | Get store detail |
| POST | `/` | Create store |
| PUT | `/{id}` | Update store |
| DELETE | `/{id}` | Soft delete store |

### Query Parameters (GET `/`)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| pageNumber | int | 1 | Page number |
| pageSize | int | 10 | Items per page |
| search | string? | null | Search by name, code, address |
| isActive | bool? | null | Filter by status |
| sortBy | string | "name" | Sort field: name, code, createdAt |
| sortOrder | string | "asc" | Sort direction: asc, desc |

### Create Store Request

```json
{
  "code": "HN-001",     // required, uppercase
  "name": "Store Hanoi", // required
  "address": "123 Street", // optional
  "phone": "0123456789"  // optional
}
```

### Update Store Request

```json
{
  "id": 1,               // required
  "name": "Store Hanoi", // required
  "address": "123 Street", // optional
  "phone": "0123456789",  // optional
  "isActive": true       // required
}
```

---

## Response Format

### Paginated List Response

```json
{
  "totalItems": 100,
  "totalPages": 10,
  "hasPreviousPage": true,
  "hasNextPage": true,
  "items": [...]
}
```

### Error Response

```json
{
  "message": "Error message",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

---

## Optimization Notes

- **AsNoTracking**: All GET queries use AsNoTracking for better read performance
- **Projection**: Only required fields are selected (no full entity loading)
- **Soft Delete**: All deletions are soft (IsDeleted = true)
- **Unique Slug**: Auto-generated Vietnamese-friendly slugs
