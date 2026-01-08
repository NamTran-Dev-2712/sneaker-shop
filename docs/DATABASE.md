# Sneaker Shop (PostgreSQL)

Tài liệu này mô tả **database schema** cho dự án Sneaker Shop (PostgreSQL), gồm:
- Tổng quan domain & các luồng nghiệp vụ chính
- Enum/giá trị chuẩn hoá
- Mối quan hệ giữa các bảng (logic ERD)
- Mô tả chi tiết **từng bảng**: mục đích, quan hệ, ràng buộc, lưu ý triển khai
- Quy tắc bất biến (invariants) để code/AI triển khai đúng

> Mục tiêu: dùng làm “single source of truth” cho vibe coding (Copilot/Codex) để không lan man và giữ đúng kiến trúc dữ liệu.

---

## 1) Tổng quan domain

Hệ thống bán hàng đa kênh:
- **Online**: khách có thể có `Account`, có `Cart`, tạo `Order`, thanh toán online/COD, giao hàng hoặc pickup.
- **POS / Offline assisted**: nhân viên tạo đơn cho khách tại cửa hàng, khách có thể là **vãng lai** (không có `customer_id`), hoặc khách đã có hồ sơ `Customer` (định danh bằng phone).

Sản phẩm bán được (sellable):
- **Sneaker** quản lý theo: `Sneaker` → `Sneaker_Colorway` → `Sneaker_Variant` (size) → ánh xạ sang `Sellable_Item` để thống nhất “SKU/Barcode/Price”.
- **Accessory** quản lý riêng theo category/brand phụ kiện → ánh xạ sang `Sellable_Item`.

Tồn kho theo chi nhánh:
- `Inventory` theo `(store_id, sellable_item_id)` với `on_hand`, `reserved` (giữ chỗ).

Mua hàng từ nhà cung cấp:
- `Vendor`, `Vendor_Price`, `Purchase_Order`, `Purchase_Order_Item`.

Khuyến mãi & Loyalty:
- `Voucher`, `Voucher_Redemption`
- `Loyalty_Account`, `Loyalty_Transaction` liên kết với `Order` (earn/redeem/adjust/expire).

Hoàn trả:
- `Return`, `Return_Item`.

---

## 2) Enum

### ROLE
- `ADMIN`, `STAFF`, `CUSTOMER`

### LOYALTY_TXN_TYPE
- `EARN`, `REDEEM`, `ADJUST`, `EXPIRE`

### SELLABLE_TYPE
- `SNEAKER_VARIANT`, `ACCESSORY`

### PURCHASE_STATUS
- `CREATED`, `ORDERED`, `RECEIVED`, `CANCELLED`

### ORDER_STATUS
- `PLACED`, `CONFIRMED`, `PAID`, `PACKED`, `SHIPPED`, `DELIVERED`, `CANCELLED`,
  `RETURN_REQUESTED`, `RETURNED`, `REFUNDED`

### PAYMENT_METHOD
- `CASH`, `CARD`, `BANK_TRANSFER`, `COD`, `EWALLET`

### PAYMENT_STATUS
- `PENDING`, `PAID`, `FAILED`, `REFUNDED`, `PARTIALLY_REFUNDED`

### FULFILLMENT_TYPE
- `DELIVERY` (giao tận nhà), `PICKUP` (nhận tại shop)

### RESTOCK_STATUS
- `OPEN`, `APPROVED`, `REJECTED`, `DONE`

### SALES_CHANNEL
- `ONLINE`, `POS`, `OFFLINE_ASSISTED`

### VOUCHER_SCOPE
- `ALL`, `ONLINE`, `POS`

### DISCOUNT_TYPE
- `PERCENT`, `FIXED`

### RETURN_STATUS
- `REQUESTED`, `APPROVED`, `REJECTED`, `COMPLETED`

---

## 3) Quan hệ tổng quát (ERD logic)

### Identity / People
- `Account (role)` 1—1 `Admin_Profile` (khi role=ADMIN)
- `Account (role)` 1—1 `Staff_Profile` (khi role=STAFF) và staff thuộc 1 `Store`
- `Customer` là hồ sơ khách hàng omnichannel, định danh mạnh bằng `phone`
- `Customer_Account` liên kết **0..1 Account** ↔ **1 Customer** (khách web login)

### Product
- `Brand` 1—N `Brand_Series`
- `Brand` 1—N `Sneaker` (và `Sneaker` có thể thuộc `Brand_Series`)
- `Sneaker` 1—N `Sneaker_Colorway` (màu)
- `Sneaker_Colorway` 1—N `Sneaker_Variant` (size)
- `Category_Accessory` 1—N `Accessory`
- `Category_Accessory` 1—N `Brand_Category_Accessory`
- `Brand_Category_Accessory` 1—N `Accessory`
- `Accessory` 1—N `Accessory_Image`

### Sellable + Pricing
- `Sellable_Item` là “chuẩn bán hàng”: SKU/Barcode/giá + active
- `Sellable_Item.type = SNEAKER_VARIANT` → `sneaker_variant_id` NOT NULL
- `Sellable_Item.type = ACCESSORY` → `accessory_id` NOT NULL
- `Vendor_Price` N—1 `Vendor` và N—1 `Sellable_Item`

### Inventory + Procurement
- `Inventory` theo `(store_id, sellable_item_id)`
- `Purchase_Order` N—1 `Vendor`, N—1 `Store`
- `Purchase_Order_Item` N—1 `Purchase_Order`, N—1 `Sellable_Item`

### Sales
- `Order` N—1 `Store` (tuỳ channel/fulfillment)
- `Order` N—0..1 `Customer` (POS vãng lai có thể NULL)
- `Order` N—1 `Account` (created_by), N—0..1 `Account` (staff_id)
- `Order_Item` N—1 `Order`, N—1 `Sellable_Item`
- `Payment` N—1 `Order` (có thể nhiều payment/partial)
- `Order_Fulfillment` 1—1 `Order`

### Promotions / Loyalty / Returns
- `Voucher_Redemption` N—1 `Voucher`, 1—1 `Order`
- `Loyalty_Account` 1—1 `Customer`
- `Loyalty_Transaction` N—1 `Loyalty_Account`, (optional) N—1 `Order`
- `Return` N—1 `Order`, N—1 `Store`
- `Return_Item` N—1 `Return`, N—1 `Sellable_Item`

### Cart
- `Cart` 1—1 `Customer` (giả định mỗi customer 1 cart active)
- `Cart_Item` N—1 `Cart`, N—1 `Sellable_Item`

### Restock
- `Restock_Request` N—1 `Store`, N—1 `Sellable_Item`, created_by là `Account` (STAFF)

---

## 4) Bất biến & quy tắc nghiệp vụ quan trọng (AI/code phải tôn trọng)

### 4.1 Account / Customer
- `Account` (CUSTOMER) **phải** gắn đúng 1 `Customer` thông qua `Customer_Account`.
- `Customer` là “omnichannel identity” bằng `phone` (POS lookup bằng phone).
- `Account.email` và `Account.phone` có unique; nhưng `Account` có thể thiếu email hoặc phone (tuỳ flow).  
  Tuy nhiên comment: “ít nhất phải có email hoặc mật khẩu mới cho tạo” → nên enforce ở service layer.

### 4.2 Sellable_Item polymorphic
- `Sellable_Item` là bảng trung tâm cho bán hàng, inventory, procurement.
- Rule:
  - `type=SNEAKER_VARIANT` ⇒ `sneaker_variant_id` NOT NULL và `accessory_id` NULL
  - `type=ACCESSORY` ⇒ `accessory_id` NOT NULL và `sneaker_variant_id` NULL
- `sku` unique toàn hệ thống.

### 4.3 Inventory
- `available = on_hand - reserved` (không lưu cột, tính khi query).
- Khi tạo đơn (PLACED) nên tăng `reserved` (giữ chỗ), khi hủy/failed giảm `reserved`.
- Khi hoàn tất xuất kho (PACKED/SHIPPED hoặc theo nghiệp vụ) giảm `on_hand` và giảm `reserved`.

### 4.4 Order / Payment / Fulfillment
- `Order.total = subtotal - discount_total - redeemed_amount + shipping_fee` (nên kiểm soát ở service).
- `Payment` có thể nhiều bản ghi (split payment / partial refund).
- `Order_Fulfillment` là 1-1 với `Order`.  
  Nếu `type=PICKUP` thì dùng `pickup_store_id`, `pickup_expires_at`.  
  Nếu `type=DELIVERY` thì dùng `recipient_*`, `address`, `carrier`, `tracking_code`.

### 4.5 Voucher
- `Voucher_Redemption.order_id` unique: 1 order dùng tối đa 1 voucher.
- Khi apply voucher cần kiểm tra: `is_active`, `starts_at/ends_at`, `min_order_total`, `usage_limit`, `usage_per_customer`, `scope` theo `Order.channel`.

### 4.6 Loyalty
- `Loyalty_Account.points_balance` là snapshot, mọi thay đổi phải thông qua `Loyalty_Transaction`.
- `Loyalty_Transaction.points` dùng dấu:
  - Earn: dương
  - Redeem: âm
  - Adjust có thể +/-  
  - Expire: âm
- Nếu `Loyalty_Transaction.order_id` có, phải đảm bảo transaction khớp trạng thái đơn (vd: Earn khi PAID/DELIVERED tuỳ rule).

### 4.7 Purchase Order
- `Purchase_Order` theo store nhập hàng (store_id).
- `Purchase_Order_Item.unit_cost` là giá vốn thực tế của lô nhập.

### 4.8 Return
- `Return` gắn với `Order` và store xử lý trả.
- `Return_Item.refund_amount` là số tiền dự kiến hoàn theo item (có thể dùng để tính total refund).

---

## 5) Mô tả chi tiết từng bảng

> Quy ước: PK `id` int, timestamps `created_at`, `updated_at` (nên dùng `timestamptz` trong PostgreSQL để tránh lệch TZ).

### 5.1 Store
**Mục đích:** Quản lý chi nhánh (cửa hàng/kho).
- `code` unique để định danh ngắn
- `is_active` bật/tắt hoạt động

**Quan hệ:**
- 1 Store có nhiều: `Staff_Profile`, `Inventory`, `Purchase_Order`, `Order` (POS/Pickup/Online handling), `Return`, `Restock_Request`.

---

### 5.2 Account
**Mục đích:** Tài khoản đăng nhập & phân quyền.
- `role`: ADMIN/STAFF/CUSTOMER
- `email`, `phone` unique (có thể null tuỳ flow)
- `is_email_verified`, `is_active`

**Quan hệ:**
- 1 Account có thể có:
  - `Admin_Profile` (role=ADMIN)
  - `Staff_Profile` (role=STAFF)
  - `Customer_Account` (role=CUSTOMER)
- Được tham chiếu bởi:
  - `Order.created_by`, `Order.staff_id`
  - `Purchase_Order.created_by`
  - `Loyalty_Transaction.created_by`
  - `Return.created_by`
  - `Restock_Request.created_by`

---

### 5.3 Staff_Profile
**Mục đích:** Thông tin nhân viên + store làm việc.
- `account_id` → Account
- `store_id` → Store

**Quan hệ:** mỗi staff thuộc 1 store (hiện tại).

---

### 5.4 Admin_Profile
**Mục đích:** Thông tin admin (tách khỏi Account để tuỳ biến profile).

---

### 5.5 Customer
**Mục đích:** Hồ sơ khách hàng omnichannel (POS/Online).
- `phone` **NOT NULL, unique**: khoá định danh chính cho POS.
- `email`, `full_name`, `birthday`

**Quan hệ:**
- 1 Customer có thể có:
  - 0..1 `Customer_Account`
  - 1 `Loyalty_Account` (khuyến nghị unique trên `customer_id`)
  - 0..1 `Cart` (khuyến nghị unique trên `customer_id`)
  - N `Order`
  - N `Voucher_Redemption`

---

### 5.6 Customer_Account
**Mục đích:** Liên kết `Account` (đăng nhập web) với `Customer` (hồ sơ).
- Đảm bảo mapping “customer omnichannel” ↔ “account login”.

**Rule:**
- 1 customer có thể có 0 hoặc 1 account
- 1 account CUSTOMER phải gắn đúng 1 customer

> Gợi ý ràng buộc DB: unique (`account_id`), unique (`customer_id`)

---

### 5.7 Loyalty_Account
**Mục đích:** Ví điểm/tier theo customer.
- `points_balance`: snapshot
- `tier`: mặc định `"STANDDARD"` (chú ý typo, nếu giữ thì giữ nhất quán)

**Quan hệ:** 1—1 `Customer`; 1—N `Loyalty_Transaction`.

---

### 5.8 Loyalty_Transaction
**Mục đích:** Sổ cái điểm loyalty (audit-friendly).
- `txn_type`, `points` (+/-)
- `order_id` optional để gắn với đơn
- `created_by` người thao tác (ADMIN/STAFF/system)

**Quan hệ:**
- N—1 `Loyalty_Account`
- optional N—1 `Order`
- N—1 `Account` (created_by)

---

### 5.9 Brand
**Mục đích:** Brand giày (Nike, Adidas, Jordan…).
- `slug` unique để làm URL/SEO.

**Quan hệ:** 1—N `Brand_Series`, 1—N `Sneaker`.

---

### 5.10 Brand_Series
**Mục đích:** Dòng sản phẩm theo brand (Air Jordan 1, Air Force 1…).
- `brand_id` → Brand
- `slug` unique

---

### 5.11 Sneaker
**Mục đích:** Model giày (tên chung).
- `main_image`, `description`, `base_price` (giá tham khảo thấp nhất)
- `is_active`, `is_deleted`

**Quan hệ:**
- N—1 `Brand`
- optional N—1 `Brand_Series`
- 1—N `Sneaker_Colorway`
- 1—N `Sneaker_Variant` (thông qua colorway)

---

### 5.12 Color
**Mục đích:** Danh mục màu.
- `hex` để FE render.

---

### 5.13 Size
**Mục đích:** Size theo hệ (US/UK/EU…).
- `system` + `value`

> Gợi ý: unique (`system`, `value`) để tránh trùng.

---

### 5.14 Sneaker_Colorway
**Mục đích:** Màu của một sneaker model (có ảnh riêng theo màu).
- `sneaker_id`, `color_id`, `cover_image`
- `is_active`

**Rule:** unique (`sneaker_id`, `color_id`)

**Quan hệ:** 1—N `Sneaker_Variant`

---

### 5.15 Sneaker_Variant
**Mục đích:** Biến thể theo size cho một colorway.
- `sneaker_id` (để query nhanh theo model)
- `colorway_id`, `size_id`

**Rule:** unique (`sneaker_id`, `colorway_id`, `size_id`)

> Thực tế có thể bỏ `sneaker_id` nếu suy ra từ colorway, nhưng giữ để tối ưu truy vấn/đơn giản hoá.

---

### 5.16 Category_Accessory
**Mục đích:** Danh mục phụ kiện (mắt kính, tất, balo…).
- `slug` unique

---

### 5.17 Brand_Category_Accessory
**Mục đích:** Brand phụ kiện theo category (vd: Dior eyewear, Gucci bag…).
- `category_id` → Category_Accessory
- `slug` unique
- `thumbnail_url` not null

---

### 5.18 Accessory
**Mục đích:** Sản phẩm phụ kiện.
- `category_id`, `brand_id` (brand phụ kiện)
- `main_image`, `base_price`
- `is_deleted`

**Quan hệ:**
- 1—N `Accessory_Image`
- 1—1 (thông qua `Sellable_Item` khi đưa vào bán)

---

### 5.19 Accessory_Image
**Mục đích:** Ảnh bổ sung cho phụ kiện.

---

### 5.20 Sellable_Item
**Mục đích:** Chuẩn hoá item bán được (SKU/Barcode/giá) cho cả sneaker variant & accessory.
- `type` (SNEAKER_VARIANT/ACCESSORY)
- `sku` unique, `barcode` unique
- `retail_price`, `online_price`
- `is_active`

**Quan hệ:**
- optional → `Sneaker_Variant`
- optional → `Accessory`
- bị tham chiếu bởi: `Inventory`, `Order_Item`, `Cart_Item`, `Purchase_Order_Item`, `Vendor_Price`, `Return_Item`, `Restock_Request`.

**Invariant quan trọng:**
- (type + FK) phải đúng (xem mục 4.2)

---

### 5.21 Vendor
**Mục đích:** Nhà cung cấp.
- `is_active` để disable.

**Quan hệ:** 1—N `Vendor_Price`, 1—N `Purchase_Order`.

---

### 5.22 Vendor_Price
**Mục đích:** Bảng giá nhà cung cấp theo thời gian (price list).
- `vendor_id`, `sellable_item_id`, `price`
- `effective_from`, `effective_to` (null = còn hiệu lực)

**Rule:** unique (`vendor_id`, `sellable_item_id`, `effective_from`)

> Gợi ý query: giá hiện hành = where `effective_from <= today` and (`effective_to` is null or `effective_to >= today`) order by effective_from desc limit 1.

---

### 5.23 Purchase_Order
**Mục đích:** Đơn nhập hàng từ vendor về store.
- `vendor_id`, `store_id`
- `status` (CREATED → ORDERED → RECEIVED hoặc CANCELLED)
- `expected_at`, `note`
- `created_by` (ADMIN)

**Quan hệ:** 1—N `Purchase_Order_Item`

---

### 5.24 Purchase_Order_Item
**Mục đích:** Line items của PO.
- `sellable_item_id`, `quantity`, `unit_cost` (giá vốn thực tế)

**Rule:** unique (`purchase_order_id`, `sellable_item_id`)

---

### 5.25 Inventory
**Mục đích:** Tồn kho theo store.
- `on_hand`: tổng có sẵn
- `reserved`: giữ chỗ
- available = on_hand - reserved

**Rule:** unique (`store_id`, `sellable_item_id`)

---

### 5.26 Order
**Mục đích:** Đơn hàng bán ra (online/POS).
- `channel`, `status`
- `store_id`: store bán hoặc store xử lý
- `customer_id`: nullable (POS walk-in)
- `created_by`: account tạo đơn
- `staff_id`: staff xử lý/bán
- tiền: `subtotal`, `discount_total`, `shipping_fee`, `total`
- loyalty: `redeemed_points`, `redeemed_amount`
- `placed_at` (thời điểm đặt)

**Quan hệ:** 1—N `Order_Item`, 1—N `Payment`, 1—1 `Order_Fulfillment`, 0..1 `Voucher_Redemption`, 0..N `Loyalty_Transaction`, 0..N `Return`.

---

### 5.27 Order_Item
**Mục đích:** Line items của order.
- `sellable_item_id`, `quantity`
- `unit_price`, `discount`, `line_total`

**Rule (tuỳ chọn):** unique (`order_id`, `sellable_item_id`) nếu không cho mua cùng SKU nhiều dòng.

---

### 5.28 Payment
**Mục đích:** Giao dịch thanh toán cho order (hỗ trợ multi-payment, refund).
- `method`, `status`, `amount`
- `provider`, `provider_txn_id`, `paid_at`

---

### 5.29 Order_Fulfillment
**Mục đích:** Thông tin giao nhận / pickup cho order (1-1).
- `type`
- pickup: `pickup_store_id`, `pickup_expires_at`
- delivery: `recipient_*`, `address`, `carrier`, `tracking_code`

**Rule:** `order_id` unique.

---

### 5.30 Voucher
**Mục đích:** Mã giảm giá.
- `code` unique
- `discount_type` (PERCENT/FIXED), `discount_value`, `max_discount`
- `min_order_total`
- `scope` (ALL/ONLINE/POS)
- `usage_limit`, `usage_per_customer`
- `starts_at`, `ends_at`, `is_active`

---

### 5.31 Voucher_Redemption
**Mục đích:** Audit apply voucher.
- `voucher_id`, `order_id` (unique), `customer_id`, `redeemed_at`

---

### 5.32 Return
**Mục đích:** Phiếu trả hàng.
- `order_id`, `store_id`
- `status` (REQUESTED/APPROVED/REJECTED/COMPLETED)
- `reason`
- `created_by`

**Quan hệ:** 1—N `Return_Item`

---

### 5.33 Return_Item
**Mục đích:** Item trả trong phiếu return.
- `sellable_item_id`, `quantity`
- `condition` (NEW/USED/DAMAGED)
- `refund_amount`

---

### 5.34 Cart
**Mục đích:** Giỏ hàng của customer (online).
- `customer_id`

> Gợi ý: unique (`customer_id`) để 1 customer chỉ có 1 cart active.

---

### 5.35 Cart_Item
**Mục đích:** Line items trong cart.
- `sellable_item_id`, `quantity`

**Rule:** unique (`cart_id`, `sellable_item_id`)

---

### 5.36 Restock_Request
**Mục đích:** Staff đề xuất nhập thêm hàng (replenishment).
- `store_id`, `sellable_item_id`
- `suggested_qty`, `reason`
- `status` (OPEN/APPROVED/REJECTED/DONE)
- `created_by` (STAFF)

---

## 6) Index & constraints gợi ý (để scale + query chuẩn)

> Bạn có thể triển khai dần, nhưng các index dưới đây giúp API chạy ổn ngay từ đầu.

### 6.1 Unique / FK indexes
- Unique:
  - `Store(code)`
  - `Account(email)`, `Account(phone)`
  - `Customer(phone)`
  - `Brand(slug)`, `Brand_Series(slug)`
  - `Category_Accessory(slug)`, `Brand_Category_Accessory(slug)`
  - `Sneaker(slug)`
  - `Sellable_Item(sku)`, `Sellable_Item(barcode)`
  - `Voucher(code)`
- Composite unique:
  - `Sneaker_Colorway(sneaker_id, color_id)`
  - `Sneaker_Variant(sneaker_id, colorway_id, size_id)`
  - `Inventory(store_id, sellable_item_id)`
  - `Purchase_Order_Item(purchase_order_id, sellable_item_id)`
  - `Cart_Item(cart_id, sellable_item_id)`
  - `Vendor_Price(vendor_id, sellable_item_id, effective_from)`
  - `Voucher_Redemption(order_id)` (đã ghi unique)
  - `Customer_Account(account_id)`, `Customer_Account(customer_id)` (khuyến nghị)

### 6.2 Query indexes phổ biến
- `Order(status)`, `Order(channel)`, `Order(store_id)`, `Order(customer_id)`, `Order(created_at)`
- `Order_Item(order_id)`, `Order_Item(sellable_item_id)`
- `Payment(order_id)`, `Payment(status)`
- `Inventory(store_id)`, `Inventory(sellable_item_id)`
- `Sellable_Item(type)`, `Sellable_Item(is_active)`
- `Sneaker(brand_id)`, `Sneaker(brand_series_id)`, `Sneaker(is_active)`, `Sneaker(is_deleted)`
- `Accessory(category_id)`, `Accessory(brand_id)`, `Accessory(is_deleted)`

### 6.3 Check constraints (rất đáng làm)
- `Sellable_Item` polymorphic check:
  - `(type='SNEAKER_VARIANT' AND sneaker_variant_id IS NOT NULL AND accessory_id IS NULL)`
  - OR `(type='ACCESSORY' AND accessory_id IS NOT NULL AND sneaker_variant_id IS NULL)`
- `Inventory.on_hand >= 0`, `Inventory.reserved >= 0`, `reserved <= on_hand` (tuỳ rule)
- `Purchase_Order_Item.quantity > 0`
- `Order_Item.quantity > 0`
- `Vendor_Price.price >= 0`
- `Voucher.discount_value > 0`
- `Voucher.discount_type='PERCENT'` ⇒ `discount_value <= 100` (nếu dùng percent 0-100)

---

## 7) Gợi ý mapping trong code (để AI triển khai đúng)

### 7.1 Aggregate “Sellable”
- Trong code, nên có service/mapper:
  - `GetSellableDetails(sellable_item_id)` → join theo `type`:
    - sneaker variant: join `Sneaker_Variant` + `Sneaker_Colorway` + `Sneaker` + `Brand` + `Size` + `Color`
    - accessory: join `Accessory` + category + brand phụ kiện + images (optional)

### 7.2 Luồng đặt hàng & inventory reservation
- PLACED:
  - validate stock `available >= qty`
  - increase `Inventory.reserved`
  - tạo `Order`, `Order_Item`, `Order_Fulfillment`
- PAID/CONFIRMED/PACKED:
  - tùy rule, khi PACKED/SHIPPED: giảm `on_hand` và giảm `reserved`
- CANCELLED/FAILED:
  - giảm `reserved`

### 7.3 Voucher + Loyalty
- Apply voucher:
  - ghi `Voucher_Redemption` (khi finalize)
- Redeem loyalty:
  - set `Order.redeemed_points`, `Order.redeemed_amount`
  - tạo `Loyalty_Transaction` (REDEEM) và cập nhật balance

---

## 8) Naming & conventions

- Bảng dùng `Pascal_Snake_Case` như schema hiện tại (vd: `Purchase_Order_Item`).
- Cột FK theo mẫu `xxx_id`.
- Timestamp nên dùng `timestamptz` trong PostgreSQL, và lưu UTC.
- Soft delete:
  - `Sneaker.is_deleted`, `Accessory.is_deleted` (lọc mặc định trong query)

---

## 9) TODO mở rộng (nếu cần về sau)

- Audit log tổng quát (ai làm gì) thay vì rải `created_by` nhiều nơi.
- Price history theo kênh (online/retail) nếu cần thay đổi theo thời gian.
- Shipment events / fulfillment status history.
- Multi-store staff assignment (nếu staff làm nhiều chi nhánh).

---

## 10) Quick glossary (để AI hiểu đúng thuật ngữ)
- **Sellable_Item**: đơn vị bán hàng có SKU/Barcode (tất cả chỗ bán/nhập/tồn kho đều dùng)
- **Sneaker**: model chung
- **Colorway**: biến thể màu của sneaker
- **Variant**: biến thể size trong một colorway
- **Reserved**: giữ chỗ tồn kho cho đơn chưa hoàn tất
- **POS**: bán tại cửa hàng
- **Offlined assisted**: nhân viên hỗ trợ tạo đơn cho khách (ngoài web)

---
