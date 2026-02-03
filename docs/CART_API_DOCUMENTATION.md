# Cart API Documentation

## Overview

Cart API cho phép khách hàng quản lý giỏ hàng của họ. Tất cả các endpoint đều yêu cầu xác thực với role `CUSTOMER`.

## Base URL

```
/api/shop/cart
```

## Authentication

Tất cả các endpoint đều yêu cầu JWT token với role `CUSTOMER`.

```http
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Get Cart

Lấy thông tin giỏ hàng của khách hàng hiện tại với đầy đủ chi tiết sản phẩm và thông tin tồn kho.

```http
GET /api/shop/cart
```

**Response:**

```json
{
  "cartId": 1,
  "customerId": 123,
  "totalItems": 2,
  "totalQuantity": 5,
  "subTotal": 2500000,
  "items": [
    {
      "cartItemId": 1,
      "sellableItemId": 101,
      "inventoryId": 201,
      "quantity": 2,
      "productType": "SNEAKER_VARIANT",
      "productName": "Nike Air Max 90",
      "productSlug": "nike-air-max-90",
      "sku": "SKU001",
      "mainImage": "https://cloudinary.com/...",
      "unitPrice": 500000,
      "lineTotal": 1000000,
      "colorName": "White",
      "colorHex": "#FFFFFF",
      "sizeName": "US 10",
      "brandName": "Nike",
      "selectedInventory": {
        "inventoryId": 201,
        "storeId": 1,
        "storeName": "Store HCM",
        "onHand": 50,
        "reserved": 5,
        "available": 45
      },
      "totalAvailableAcrossStores": 150,
      "availableInventories": [
        {
          "inventoryId": 201,
          "storeId": 1,
          "storeName": "Store HCM",
          "onHand": 50,
          "reserved": 5,
          "available": 45
        },
        {
          "inventoryId": 202,
          "storeId": 2,
          "storeName": "Store HN",
          "onHand": 100,
          "reserved": 0,
          "available": 100
        }
      ],
      "isAvailable": true,
      "unavailableReason": null
    }
  ],
  "updatedAt": "2026-02-02T10:00:00Z"
}
```

**Availability Status:**
- `isAvailable: true` - Sản phẩm có sẵn với số lượng yêu cầu
- `isAvailable: false` - Sản phẩm không khả dụng, xem `unavailableReason`:
  - `"Sản phẩm đã ngừng kinh doanh."` - SellableItem.IsActive = false
  - `"Sản phẩm tạm hết hàng."` - Tổng tồn kho = 0
  - `"Chỉ còn X sản phẩm trong kho."` - Số lượng yêu cầu > tổng tồn kho

---

### 2. Add To Cart

Thêm sản phẩm vào giỏ hàng. Nếu khách hàng chưa có giỏ hàng, hệ thống sẽ tự động tạo mới.
Nếu sản phẩm đã tồn tại trong giỏ, số lượng sẽ được cộng dồn.

```http
POST /api/shop/cart/items
Content-Type: application/json
```

**Request Body:**

```json
{
  "sellableItemId": 101,
  "inventoryId": 201,
  "quantity": 2
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sellableItemId | int | Yes | ID của SellableItem (SneakerVariant hoặc Accessory) |
| inventoryId | int | Yes | ID của Inventory (xác định cửa hàng nguồn) |
| quantity | int | Yes | Số lượng (1-100) |

**Response:**

```json
{
  "cartId": 1,
  "cartItemId": 5,
  "sellableItemId": 101,
  "inventoryId": 201,
  "quantity": 4,
  "totalCartItems": 10,
  "isNewCart": false,
  "isMerged": true,
  "message": "Sản phẩm đã được cập nhật số lượng trong giỏ hàng."
}
```

**Response Fields:**
- `isNewCart: true` - Giỏ hàng mới được tạo
- `isMerged: true` - Sản phẩm đã tồn tại, số lượng được cộng dồn
- `isMerged: false` - Sản phẩm mới được thêm vào giỏ

---

### 3. Update Cart Item

Cập nhật số lượng của một sản phẩm trong giỏ hàng.

```http
PUT /api/shop/cart/items/{cartItemId}
Content-Type: application/json
```

**Request Body:**

```json
{
  "quantity": 3,
  "inventoryId": 202
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| quantity | int | Yes | Số lượng mới (1-100) |
| inventoryId | int | No | ID Inventory mới (nếu muốn đổi cửa hàng) |

**Response:**

```json
{
  "cartItemId": 5,
  "sellableItemId": 101,
  "inventoryId": 202,
  "oldQuantity": 2,
  "newQuantity": 3,
  "totalCartItems": 11,
  "totalAvailableInventory": 150,
  "message": "Cập nhật số lượng thành công."
}
```

---

### 4. Remove Cart Item

Xóa một sản phẩm khỏi giỏ hàng.

```http
DELETE /api/shop/cart/items/{cartItemId}
```

**Response:**

```json
{
  "removedCartItemId": 5,
  "sellableItemId": 101,
  "removedQuantity": 3,
  "remainingCartItems": 1,
  "totalCartItems": 8,
  "message": "Đã xóa sản phẩm khỏi giỏ hàng."
}
```

---

### 5. Clear Cart

Xóa tất cả sản phẩm trong giỏ hàng.

```http
DELETE /api/shop/cart
```

**Response:**

```json
{
  "cartId": 1,
  "removedItemsCount": 3,
  "removedTotalQuantity": 10,
  "message": "Đã xóa 3 sản phẩm khỏi giỏ hàng."
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Quantity": ["Số lượng phải lớn hơn 0."]
  }
}
```

### 401 Unauthorized

```json
{
  "message": "Không thể xác định thông tin khách hàng."
}
```

### 404 Not Found

```json
{
  "message": "Sản phẩm không tồn tại trong giỏ hàng."
}
```

### 500 Internal Server Error

```json
{
  "message": "Số lượng yêu cầu (10) vượt quá số lượng tồn kho (5)."
}
```

---

## Business Rules

### Cart Creation
- Cart được tạo tự động khi khách hàng thêm sản phẩm đầu tiên
- Mỗi Customer chỉ có 1 Cart (one-to-one relationship)

### Item Uniqueness
- Constraint: `UNIQUE(cart_id, sellable_item_id)`
- Khi thêm sản phẩm đã tồn tại, số lượng sẽ được cộng dồn (merge)

### Inventory Validation
- Số lượng yêu cầu không được vượt quá tổng tồn kho khả dụng tại tất cả cửa hàng
- Tồn kho khả dụng = OnHand - Reserved

### Quantity Limits
- Minimum: 1
- Maximum: 100 (per item)

---

## Frontend Integration Tips

### 1. Display Cart Items
- Sử dụng `totalAvailableAcrossStores` để hiển thị max quantity trong input
- Kiểm tra `isAvailable` để disable/highlight items không khả dụng
- Hiển thị `unavailableReason` cho user

### 2. Store Selection
- Sử dụng `availableInventories` để cho user chọn cửa hàng
- Khi user đổi cửa hàng, call Update API với `inventoryId` mới

### 3. Real-time Validation
- Trước khi gọi Update API, kiểm tra `quantity <= totalAvailableAcrossStores`
- Hiển thị warning nếu quantity gần đạt limit

### 4. Error Handling
- Handle 401 để redirect về login
- Handle 400 để hiển thị validation errors
- Handle inventory errors để suggest giảm quantity

---

## Related Entities

```
Cart (1) ←→ (N) CartItem
CartItem (N) → (1) SellableItem
CartItem (N) → (1) Inventory
SellableItem (1) ←→ (0..1) SneakerVariant
SellableItem (1) ←→ (0..1) Accessory
Inventory (N) → (1) Store
```
