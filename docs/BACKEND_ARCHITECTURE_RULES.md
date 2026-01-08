# BACKEND ARCHITECTURE RULES
> Clean Architecture + CQRS – Sneaker Shop Backend  
> Mục tiêu: Code bền vững – mở rộng dễ – AI (Copilot / Codex / ChatGPT) luôn hiểu đúng kiến trúc và không lan man

---

## 1. Mục tiêu tài liệu này

Tài liệu này là **luật kiến trúc bắt buộc** cho toàn bộ Backend.

Nó được viết để:
- Định nghĩa **ranh giới kiến trúc rõ ràng**
- Chuẩn hóa **cách đặt tên – chia folder – tổ chức code**
- Giúp **AI vibe coding đúng hướng**, không phá cấu trúc
- Dễ mở rộng cho **tính năng tương lai** (POS, Loyalty, Inventory, Vendor, Order, Return, etc.)

> ⚠️ Bất kỳ code nào **vi phạm luật trong tài liệu này đều phải refactor**, không được “chấp nhận tạm”.

---

## 2. Tổng quan kiến trúc

Backend sử dụng:
- **Clean Architecture**
- **CQRS (Command / Query Separation)**
- **Layered + Feature-based**

### 4 tầng chính

```
Backend.Api            → Presentation Layer
Backend.Application    → Application Layer (CQRS)
Backend.Domain         → Domain Layer (Business Core)
Backend.Infrastructure → Infrastructure Layer (EF, DB, External)
```

### Quy tắc phụ thuộc (Dependency Rule)

```
Api → Application → Domain
Infrastructure → Application
Infrastructure → Domain (Entities only)
```

❌ Domain **KHÔNG ĐƯỢC** phụ thuộc ngược lên bất kỳ layer nào  
❌ Application **KHÔNG ĐƯỢC** phụ thuộc Infrastructure

---

## 3. Backend.Api (Presentation Layer)

### Trách nhiệm
- HTTP API (Controllers)
- Request / Response mapping
- Middleware
- OpenAPI / Swagger
- KHÔNG chứa business logic

### Quy tắc
- Controller **chỉ gọi Application**
- Controller **không xử lý nghiệp vụ**
- Không dùng `DbContext`, `Repository`, `Entity` trực tiếp

---

## 4. Backend.Application (Application Layer)

### Trách nhiệm
- Điều phối nghiệp vụ
- CQRS (Commands / Queries)
- Validation
- Interface (Repository, Service)

### Feature-first Structure (BẮT BUỘC)

```
Features
├─ Auth
├─ User
├─ Order
├─ Inventory
├─ Loyalty
├─ Voucher
├─ Vendor
```

---

## 5. Backend.Domain (Domain Layer)

### Trách nhiệm
- Entity
- Enum
- Business rule thuần
- Không phụ thuộc framework

---

## 6. Backend.Infrastructure (Infrastructure Layer)

### Trách nhiệm
- EF Core
- Database
- Repository implementation
- External services

---

## 7. Quy tắc mở rộng trong tương lai

Khi thêm **tính năng mới**, bắt buộc:
1. Tạo Feature mới trong `Backend.Application/Features`
2. Thêm Entity (nếu cần) vào `Backend.Domain`
3. Implement Repository tại `Backend.Infrastructure`
4. Expose API tại `Backend.Api`

---

## 8. AI Vibe Coding Rules (RẤT QUAN TRỌNG)

AI khi generate code phải:
- Tuân thủ Clean Architecture
- Không bypass layer
- Không viết logic trong Controller
- Không viết Repository trong Application
- Không tạo folder ngoài chuẩn

Nếu không chắc:
> **Ưu tiên hỏi hoặc tạo TODO thay vì đoán kiến trúc**
