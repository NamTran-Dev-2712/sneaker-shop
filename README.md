# 👟 Sneaker Shop – Omnichannel Retail System

## 📌 Giới thiệu dự án

**Sneaker Shop** là một hệ thống bán lẻ giày sneaker và phụ kiện theo mô hình **Omnichannel** (Online – POS – Offline Assisted), được thiết kế nhằm:

- Quản lý tập trung sản phẩm, tồn kho, đơn hàng và khách hàng
- Đồng bộ trải nghiệm mua sắm giữa Website và cửa hàng vật lý (POS)
- Hỗ trợ vận hành chuỗi cửa hàng (multi-store)
- Dễ mở rộng cho các nghiệp vụ bán lẻ nâng cao trong tương lai

Dự án hướng tới kiến trúc **Backend-first**, dữ liệu làm trung tâm, đảm bảo:
- Tính nhất quán dữ liệu
- Khả năng mở rộng hệ thống
- Dễ tích hợp các kênh bán hàng & dịch vụ bên thứ ba

---

## 🎯 Phạm vi & đối tượng sử dụng

### Người dùng hệ thống
- **Admin**: Quản lý toàn hệ thống
- **Staff**: Nhân viên cửa hàng / POS
- **Customer**: Khách mua hàng online hoặc tại cửa hàng

### Kênh bán hàng (Sales Channel)
- **ONLINE**: Website
- **POS**: Bán trực tiếp tại cửa hàng
- **OFFLINE_ASSISTED**: Nhân viên hỗ trợ khách (đặt hộ, tư vấn…)

---

## 🧩 Các phân hệ & tính năng chính

### 1️⃣ Quản lý người dùng & phân quyền
- Account đa vai trò: `ADMIN`, `STAFF`, `CUSTOMER`
- Tách hồ sơ:
  - `Admin_Profile`
  - `Staff_Profile` (gắn với Store)
  - `Customer`
- Hỗ trợ:
  - Khách vãng lai (POS không cần account)
  - Customer có/không có tài khoản đăng nhập
- Omnichannel key: **Phone number**

### 2️⃣ Quản lý cửa hàng (Store Management)
- Hỗ trợ **nhiều chi nhánh**
- Mỗi Store có:
  - Inventory riêng
  - Đơn bán POS
  - Nhận hàng, trả hàng, pickup

### 3️⃣ Quản lý sản phẩm (Product Catalog)

#### 👟 Sneaker
- Brand → Brand Series → Sneaker
- Sneaker có nhiều:
  - Colorway
  - Size
- Tổ hợp thành **Sneaker Variant**

#### 🎒 Accessory
- Category → Brand → Accessory
- Hình ảnh đa dạng

#### 🔗 Sellable Item (Core Design)
- Chuẩn hoá sản phẩm bán được:
  - Sneaker Variant
  - Accessory
- Mỗi item có:
  - SKU
  - Barcode
  - Giá bán online / offline
- Dùng chung cho Order, Inventory, Purchase, Cart

### 4️⃣ Quản lý tồn kho (Inventory)
- Theo **Store + Sellable Item**
- Quản lý:
  - `on_hand`
  - `reserved`
  - `available = on_hand - reserved`
- Hỗ trợ:
  - Giữ hàng khi đặt online
  - Đồng bộ POS & Online

### 5️⃣ Nhập hàng & nhà cung cấp
- Vendor & Vendor Price (giá theo thời gian)
- Purchase Order:
  - Tạo → Đặt → Nhận → Huỷ
- Nhập kho theo từng Store
- Giá vốn thực tế lưu tại từng lần nhập

### 6️⃣ Bán hàng & Đơn hàng (Order Management)
- Đơn hàng đa kênh (ONLINE / POS)
- Trạng thái đầy đủ:
  - Placed → Confirmed → Paid → Packed → Shipped → Delivered
  - Return / Refund
- Order Item chi tiết:
  - Giá gốc
  - Giảm giá từng dòng

### 7️⃣ Thanh toán (Payment)
- Đa phương thức:
  - Cash, Card, Bank Transfer, COD, E-Wallet
- Thanh toán một phần / hoàn tiền

### 8️⃣ Giao nhận & Pickup
- Delivery (ship tận nhà)
- Pickup tại cửa hàng (Click & Collect)
- Tracking vận đơn

### 9️⃣ Voucher & Khuyến mãi
- Giảm giá % hoặc số tiền cố định
- Phạm vi: Online / POS / All
- Giới hạn lượt dùng

### 🔟 Loyalty & Điểm thưởng
- Earn / Redeem / Adjust / Expire
- Quy đổi trực tiếp vào đơn hàng

### 🔁 Đổi trả & hoàn tiền
- Quy trình đổi trả theo trạng thái
- Hoàn tiền toàn phần / một phần

### 🛒 Giỏ hàng (Cart)
- Mỗi customer có cart riêng
- Đồng bộ tồn kho

### 🔄 Restock Request
- Staff đề xuất nhập hàng
- Quy trình duyệt rõ ràng

---

## 🏗️ Công nghệ sử dụng

### Frontend
- **RemixJS**
- **Shadcn UI**
- SPA + SSR

### Backend
- **ASP.NET Web API**
- Clean Architecture
- RESTful API

### Database
- **PostgreSQL**
- Thiết kế chuẩn hoá, sẵn sàng scale

---

## 🚀 Định hướng mở rộng
- Promotion Engine
- Analytics & Reporting
- Mobile App
- Event-driven / CQRS

---

## 📂 Mục tiêu dự án
- Học tập & thực hành System Design
- Portfolio Backend / System Engineer
- Nền tảng phát triển sản phẩm thực tế
