# Database Configuration Guide

## Tổng quan

Dự án này sử dụng Entity Framework Core với PostgreSQL database. Tất cả các entity configurations đã được định nghĩa đầy đủ với:

- ✅ Snake_case naming convention (PostgreSQL standard)
- ✅ Unique constraints và indexes được tối ưu
- ✅ Foreign key relationships với appropriate cascade behaviors
- ✅ Concurrency control (RowVersion) cho Inventory và SellableItem
- ✅ Global query filters cho soft delete (Sneaker, Accessory)
- ✅ Default values cho các fields quan trọng
- ✅ Precision cho decimal fields (18, 2)

## Cấu trúc Database

### Core Entities

#### Account & Profiles
- `accounts` - Tài khoản người dùng (Admin, Staff, Customer)
- `admin_profiles` - Profile cho Admin
- `staff_profiles` - Profile cho Staff (gắn với Store)
- `customers` - Thông tin khách hàng (omnichannel)
- `customer_accounts` - Liên kết Customer với Account

#### Store
- `stores` - Chi nhánh/cửa hàng

#### Product Domain - Sneakers
- `brands` - Thương hiệu sneaker (Nike, Adidas, etc.)
- `brand_series` - Dòng sản phẩm (Air Jordan, Yeezy, etc.)
- `colors` - Màu sắc
- `sizes` - Kích cỡ giày
- `sneakers` - Sản phẩm sneaker chính
- `sneaker_colorways` - Phối màu của sneaker
- `sneaker_variants` - Biến thể cụ thể (sneaker + colorway + size)

#### Product Domain - Accessories
- `category_accessories` - Danh mục phụ kiện
- `brand_category_accessories` - Thương hiệu phụ kiện
- `accessories` - Sản phẩm phụ kiện
- `accessory_images` - Ảnh phụ kiện

#### Inventory & Sales
- `sellable_items` - Item có thể bán (variant hoặc accessory)
- `inventories` - Quản lý tồn kho theo store (với concurrency control)

#### Orders
- `orders` - Đơn hàng (POS, Online, Pickup)
- `order_items` - Chi tiết đơn hàng
- `payments` - Thanh toán
- `order_fulfillments` - Thông tin giao hàng/nhận hàng

#### Cart
- `carts` - Giỏ hàng của customer
- `cart_items` - Sản phẩm trong giỏ

#### Loyalty & Promotions
- `loyalty_accounts` - Tài khoản tích điểm
- `loyalty_transactions` - Lịch sử giao dịch điểm
- `vouchers` - Mã giảm giá
- `voucher_redemptions` - Lịch sử sử dụng voucher

#### Purchase & Returns
- `vendors` - Nhà cung cấp
- `vendor_prices` - Giá nhập hàng theo vendor
- `purchase_orders` - Đơn nhập hàng
- `purchase_order_items` - Chi tiết đơn nhập
- `returns` - Đơn trả hàng
- `return_items` - Chi tiết trả hàng
- `restock_requests` - Yêu cầu nhập thêm hàng

## Unique Constraints quan trọng

### Business Logic Constraints
- `sneaker_variants(sneaker_id, colorway_id, size_id)` - Đảm bảo không duplicate variant
- `inventories(store_id, sellable_item_id)` - Mỗi item chỉ có 1 inventory record per store
- `order_items(order_id, sellable_item_id)` - Mỗi item chỉ xuất hiện 1 lần trong order
- `cart_items(cart_id, sellable_item_id)` - Mỗi item chỉ xuất hiện 1 lần trong cart
- `purchase_order_items(purchase_order_id, sellable_item_id)` - Tương tự order_items

### Identity Constraints
- `accounts(email)` - Email duy nhất (nếu có)
- `accounts(phone)` - Phone duy nhất (nếu có)
- `customers(phone)` - Phone khách hàng duy nhất (key cho omnichannel)
- `sellable_items(sku)` - SKU duy nhất
- `sellable_items(barcode)` - Barcode duy nhất (nếu có)
- `vouchers(code)` - Mã voucher duy nhất

### One-to-One Relationships
- `carts(customer_id)` - 1 customer = 1 cart
- `loyalty_accounts(customer_id)` - 1 customer = 1 loyalty account
- `customer_accounts(account_id)` và `(customer_id)` - Ánh xạ 1-1
- `order_fulfillments(order_id)` - 1 order = 1 fulfillment
- `voucher_redemptions(order_id)` - 1 order = 1 voucher max

## Indexes được tối ưu

### Performance Indexes
- Tất cả foreign keys đều có index
- Status fields (order.status, payment.status, etc.)
- Date fields (created_at, placed_at, paid_at, etc.)
- Slug fields cho SEO
- Email/Phone fields cho search

### Composite Indexes
- `orders(status, created_at)` - Order listing
- `orders(customer_id, status)` - Customer order history
- `inventories(store_id, on_hand, reserved)` - Available inventory queries
- `loyalty_transactions(loyalty_account_id, created_at)` - Transaction history
- `vouchers(is_active, starts_at, ends_at)` - Active voucher queries

## Concurrency Control

Hai tables quan trọng có RowVersion để tránh race conditions:

1. **inventories** - Tránh overselling khi nhiều orders cùng reserve
2. **sellable_items** - Tránh conflicts khi update prices

## Soft Delete

Các entities sau có soft delete:
- `sneakers` - IsDeleted flag
- `accessories` - IsDeleted flag

Global query filters đã được áp dụng để tự động filter các records deleted.

## Migration Commands

### Tạo migration mới
```bash
cd backend/Backend.Api
dotnet ef migrations add MigrationName --project ../Backend.Infrastructure/Backend.Infrastructure.csproj --startup-project ./Backend.Api.csproj --output-dir Data/Migrations
```

### Apply migration vào database
```bash
cd backend/Backend.Api
dotnet ef database update --project ../Backend.Infrastructure/Backend.Infrastructure.csproj --startup-project ./Backend.Api.csproj
```

### Remove migration cuối cùng
```bash
cd backend/Backend.Api
dotnet ef migrations remove --project ../Backend.Infrastructure/Backend.Infrastructure.csproj --startup-project ./Backend.Api.csproj
```

### Generate SQL script
```bash
cd backend/Backend.Api
dotnet ef migrations script --project ../Backend.Infrastructure/Backend.Infrastructure.csproj --startup-project ./Backend.Api.csproj --output migrations.sql
```

## Connection String

Cập nhật connection string trong `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=sneaker_shop_dev;Username=postgres;Password=your_password"
  }
}
```

## Lưu ý quan trọng

1. **Enums** - Tất cả enums được lưu dưới dạng string trong database
2. **Timestamps** - Tất cả timestamps sử dụng UTC
3. **Cascade Behaviors** - Được cấu hình cẩn thận để đảm bảo data integrity
4. **Decimal Precision** - Tất cả giá tiền sử dụng precision (18, 2)
5. **Snake_Case** - EFCore.NamingConventions tự động convert tất cả tên thành snake_case

## Testing Migration

Sau khi chạy migration, kiểm tra:

```sql
-- Check tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;

-- Check constraints
SELECT conname, contype, conrelid::regclass AS table_name
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace
ORDER BY conrelid::regclass::text, contype, conname;
```

## Troubleshooting

### Lỗi "Cannot set default value"
- Không thể set default value cho enum types
- Sử dụng HasDefaultValue() chỉ cho primitive types

### Lỗi "Navigation property is null"
- Kiểm tra foreign key relationships
- Đảm bảo OnDelete behaviors hợp lý

### Performance issues
- Thêm indexes cho các queries thường xuyên
- Sử dụng `.AsNoTracking()` cho read-only queries
- Consider pagination cho large datasets
