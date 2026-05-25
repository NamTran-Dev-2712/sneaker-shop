# Shop API Documentation

API documentation for Brand/Store/Color/Size/Sneaker management in Sneaker Shop Backend.

## Authorization

| Operation | Endpoint | Authorization |
|-----------|----------|---------------|
| **Read** (GET) | All list & detail | 🌐 Public |
| **Create/Update/Delete** | POST, PUT, DELETE | 🔐 ADMIN only |

---

## Color API

Base URL: `api/colors`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get paginated list |
| POST | `/` | Create color |
| PUT | `/{id}` | Update color |
| DELETE | `/{id}` | Delete color (blocked if in use) |

### Query Parameters (GET `/`)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| pageNumber | int | 1 | Page number |
| pageSize | int | 10 | Items per page |
| search | string? | null | Search by name, hex |
| sortBy | string | "name" | Sort field: name, hex, createdAt |
| sortOrder | string | "asc" | Sort direction: asc, desc |

### Request Body

```json
{
  "name": "White",       // required
  "hex": "#FFFFFF"       // required, format: #RRGGBB
}
```

---

## Size API

Base URL: `api/sizes`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get paginated list |
| POST | `/` | Create size |
| PUT | `/{id}` | Update size |
| DELETE | `/{id}` | Delete size (blocked if in use) |

### Query Parameters (GET `/`)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| pageNumber | int | 1 | Page number |
| pageSize | int | 10 | Items per page |
| search | string? | null | Search by system, value |
| system | string? | null | Filter by system: US, UK, EU, CM |
| sortBy | string | "value" | Sort field: value, system, createdAt |

### Request Body

```json
{
  "system": "US",     // required: US, UK, EU, CM
  "value": 9.5        // required, decimal
}
```

---

## Sneaker API

Base URL: `api/sneakers`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get paginated list with filters |
| GET | `/{id}` | Get sneaker detail with colorways/variants |
| POST | `/` | Create sneaker (multipart/form-data) |
| PUT | `/{id}` | Update sneaker (multipart/form-data) |
| DELETE | `/{id}` | Soft delete sneaker |

### Query Parameters (GET `/`)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| pageNumber | int | 1 | Page number |
| pageSize | int | 10 | Items per page |
| search | string? | null | Search by name, slug |
| brandId | int? | null | Filter by brand |
| brandSeriesId | int? | null | Filter by series |
| isActive | bool? | null | Filter by status |
| minPrice | decimal? | null | Min base price |
| maxPrice | decimal? | null | Max base price |
| colorIds | int[]? | null | Filter by colors (any match) |
| sizeIds | int[]? | null | Filter by sizes (any match) |
| sortBy | string | "name" | Sort: name, price, createdAt |

### Create Sneaker Request (multipart/form-data)

```typescript
{
  brandId: number;           // required
  brandSeriesId?: number;
  name: string;              // required
  description?: string;
  mainImage: File;           // required
  colorways: [
    {
      colorId?: number;      // existing color OR
      newColor?: {           // create inline
        name: string,
        hex: string
      };
      coverImage: File;      // required
      variants: [
        {
          sizeId: number,
          retailPrice?: number,
          onlinePrice?: number
        }
      ]
    }
  ]
}
```

### Update Sneaker Request (multipart/form-data)

**Supports: Update info, add colorways, add variants, update prices**

```typescript
{
  id: number;
  brandId: number;
  brandSeriesId?: number;
  name: string;
  description?: string;
  mainImage?: File;          // optional
  isActive: boolean;
  
  // Optional: colorway changes
  colorways?: [
    {
      id?: number;           // null = new colorway
      colorId?: number;      // for new colorway (existing color)
      newColor?: {           // for new colorway (inline color creation)
        name: string,
        hex: string
      };
      coverImage?: File;     // required for new, optional for existing
      isActive?: boolean;    // update status
      
      variants?: [
        {
          id?: number;       // null = new variant
          sizeId?: number;   // required for new variant
          retailPrice?: number;
          onlinePrice?: number;
          isActive?: boolean;
        }
      ]
    }
  ]
}
```

### Update Response

```json
{
  "id": 1,
  "name": "Air Max 90",
  "slug": "air-max-90", 
  "mainImage": "https://...",
  "isActive": true,
  "updatedAt": "...",
  "colorwaysAdded": 1,
  "variantsAdded": 3,
  "variantsUpdated": 2
}
```

---

## Brand API

Base URL: `api/brands`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get paginated list |
| GET | `/{id}` | Get brand detail with series |
| POST | `/` | Create brand (multipart/form-data) |
| PUT | `/{id}` | Update brand (multipart/form-data) |
| DELETE | `/{id}` | Soft delete brand |

---

## Store API

Base URL: `api/stores`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get paginated list |
| GET | `/{id}` | Get store detail |
| POST | `/` | Create store |
| PUT | `/{id}` | Update store |
| DELETE | `/{id}` | Soft delete store |

---

## Response Format

### Paginated List

```json
{
  "totalItems": 100,
  "totalPages": 10,
  "hasPreviousPage": true,
  "hasNextPage": true,
  "items": [...]
}
```

### Error

```json
{
  "message": "Error message",
  "errors": ["Validation error 1"]
}
```

---

## Optimization Notes

- **AsNoTracking**: All GET queries for read performance
- **Projection**: Only required fields selected
- **Soft Delete**: Brand, Sneaker use soft delete
- **Hard Delete**: Color, Size delete only if no dependencies
- **Transaction**: CreateSneaker uses transaction for atomicity
- **SKU Generation**: Auto-generated format: `{BRAND}-{SNEAKER}-{COLOR}-{SIZE}`
- **SplitQuery**: Used for complex includes to avoid cartesian explosion
