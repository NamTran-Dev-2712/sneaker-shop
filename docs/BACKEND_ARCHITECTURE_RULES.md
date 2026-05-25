# BACKEND ARCHITECTURE RULES
> Clean Architecture + CQRS – Sneaker Shop Backend  
> Mục tiêu: Code bền vững – mở rộng dễ – AI (Copilot / Codex / ChatGPT) luôn hiểu đúng kiến trúc và không lan man

---

## 1. Mục tiêu tài liệu này

Tài liệu này là **luật kiến trúc bắt buộc** cho toàn bộ Backend.

Nó được viết để:
- Định nghĩa **ranh giới kiến trúc rõ ràng**
- Chuẩn hóa **cách đặt tên – chia folder – tổ chức code**
- Ngăn **AI sinh code sai tầng / sai trách nhiệm**
- Làm nền cho hệ thống lớn: POS, Inventory realtime, Loyalty, Vendor, Order, Return

> ⚠️ Code nào vi phạm luật trong tài liệu này **bắt buộc refactor**, không “chấp nhận tạm”.

---

## 2. Tổng quan kiến trúc

Backend sử dụng:
- **Clean Architecture**
- **CQRS (Command / Query Responsibility Segregation)**
- **Feature-based structure**

### 4 tầng chính

```
Backend.Api            → Presentation Layer
Backend.Application    → Application Layer (CQRS)
Backend.Domain         → Domain Layer (Business Core)
Backend.Infrastructure → Infrastructure Layer
```

### Dependency Rule (BẮT BUỘC)

```
Api → Application → Domain
Infrastructure → Application
Infrastructure → Domain (Entities only)
```

❌ Domain **KHÔNG ĐƯỢC** reference bất kỳ layer nào  
❌ Application **KHÔNG ĐƯỢC** reference Infrastructure  
❌ Api **KHÔNG ĐƯỢC** truy cập DbContext / Repository

---

## 3. QUY TẮC KHÔNG DÙNG NAMESPACE (BẮT BUỘC)

### Nguyên tắc

- **TẤT CẢ FILE .cs KHÔNG ĐƯỢC KHAI BÁO `namespace`**
- Mỗi file chỉ chứa:
  - `class`
  - `interface`
  - `record`
  - `enum`

.NET sẽ nhận diện type dựa trên:
- Project reference
- Folder structure
- File name

### Lợi ích
- Code ngắn gọn
- AI không sinh namespace sai
- Dễ refactor folder
- Phù hợp vibe coding + Clean Architecture

❌ Ví dụ KHÔNG ĐƯỢC dùng:
```csharp
namespace Backend.Application.Features.Auth;
```

✅ Ví dụ ĐÚNG:
```csharp
public sealed record RegisterCommand(...);
```

---

## 4. Backend.Api (Presentation Layer)

### Trách nhiệm
- HTTP API
- Middleware
- Mapping request → Command / Query
- Mapping Result → ApiResponse

### Quy tắc
- Controller **chỉ gọi Command / Query**
- Controller **KHÔNG xử lý business logic**
- Controller **KHÔNG reference Domain Entity**
- Không dùng DbContext / Repository

---

## 5. Backend.Application (Application Layer)

### Trách nhiệm
- Điều phối nghiệp vụ
- CQRS
- Validation
- Interface (Repository, Service)

### Feature-first Structure (BẮT BUỘC)

```
Features
├─ Auth
│  ├─ Commands
│  ├─ Queries
│  └─ Contracts
├─ User
├─ Order
├─ Inventory
├─ Loyalty
├─ Voucher
├─ Vendor
```

❌ Không chia theo kỹ thuật  
✅ Chia theo **nghiệp vụ**

---

## 6. CQRS RULES (BẮT BUỘC)

### Command
- Thay đổi state
- Không trả Entity
- Trả Result / DTO

Bắt buộc có:
- `Command`
- `CommandHandler`
- `CommandValidator`
- `Result`

### Query
- Chỉ đọc
- Không side-effect
- Có thể tối ưu SQL riêng

---

## 7. Validation Rules

- Dùng FluentValidation
- Validation đặt tại Application
- Domain KHÔNG validate input

---

## 8. Backend.Domain (Domain Layer)

### Trách nhiệm
- Entity
- Enum
- Business rule thuần

### Quy tắc
- Không phụ thuộc framework
- Không reference Application / Infrastructure
- Không DTO
- Không DbContext

---

## 9. Backend.Infrastructure (Infrastructure Layer)

### Trách nhiệm
- EF Core
- Repository implementation
- External services

### Quy tắc
- Implement interface từ Application
- Không chứa business logic

---

## 10. Repository & UnitOfWork Rules

- Repository chỉ CRUD
- Không xử lý nghiệp vụ
- UnitOfWork quản lý transaction

---

## 11. Error & Result Rules

- Không throw exception cho flow nghiệp vụ
- Dùng Result pattern
- Exception chỉ dùng cho system error

---

## 12. Quy tắc mở rộng tính năng

Khi thêm feature mới:
1. Tạo Feature trong Application
2. Thêm Entity (nếu cần) trong Domain
3. Implement Repository trong Infrastructure
4. Expose API trong Api

---

## 13. AI VIBE CODING RULES (CỰC KỲ QUAN TRỌNG)

AI khi generate code:
- Tuân thủ Clean Architecture
- Không bypass layer
- Không viết logic trong Controller
- Không viết Repository trong Application
- Không tạo namespace
- Không tạo folder ngoài chuẩn

Nếu không chắc:
> **Ưu tiên TODO hoặc hỏi thay vì đoán**
