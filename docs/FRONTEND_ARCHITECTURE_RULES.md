# FRONTEND_ARCHITECTURE_RULES.md

> Mục tiêu: tài liệu “rule” để AI (và dev mới) hiểu nhanh kiến trúc Frontend của dự án RemixJS này, không bị ngợp context, và khi vibe coding sẽ **code đúng chỗ – đúng layer – đúng convention**.

---

## 1) Tổng quan kiến trúc

Dự án dùng:
- **RemixJS** (routes-based).
- **ShadcnUI** (UI component library).
- **Redux** để quản lý state dùng chung (global/shared state).
- **React Query** (đang có hook mẫu `use-product.query.tsx`) cho caching/fetching phía client (khi phù hợp).
- **Axios** cho HTTP client, có cấu hình riêng cho client/server.
- Quy ước: `routes/` chỉ làm nhiệm vụ **render page + SEO**, **không xử lý business logic**.

Triết lý tổ chức:
- `app/routes/**` = entry page mỏng (thin route)
- `app/components/feature/**` = nơi tập trung **feature logic** (form, state local, call service, UI compose)
- `app/components/common/**` = component dùng chung, không chứa logic nghiệp vụ đặc thù
- `app/common/**` = config/constants/helpers dùng chung toàn app
- `app/services/**` = giao tiếp API + DTO + server helpers
- `app/store/**` = Redux store + slice + state + storage
- `app/hooks/**` = hooks dùng lại (redux hooks, react-query hooks…)
- `app/layouts/**` = layout theo nhóm (admin/client/auth/main)

---

## 2) Cấu trúc thư mục và trách nhiệm

### 2.1. `app/routes/` (QUY TẮC CỐT LÕI)
**Chỉ được làm:**
- Khai báo route component (page).
- Setup SEO: `meta`, `links`, title/description, canonical, open graph (nếu có).
- Render layout + mount **Feature Component**.

**Tuyệt đối không được làm:**
- Không viết business logic.
- Không gọi API trực tiếp (Axios/fetch) trong route component.
- Không xử lý state phức tạp.
- Không chứa form logic, validate, mapping DTO.

**Mẫu route đúng chuẩn:**
- `app/routes/public/home.tsx` chỉ import và render `Feature`:
  - `components/feature/...` hoặc `layouts/...` nếu cần.
- Route chỉ truyền props tối thiểu (nếu cần), không truyền “nửa vời” logic.

> Nếu một đoạn code “có vẻ nghiệp vụ” → chuyển sang `components/feature/**` hoặc `services/**`.

---

### 2.2. `app/components/feature/` (TRUNG TÂM LOGIC CỦA TỪNG TÍNH NĂNG)
Chứa các “feature module” (ví dụ: auth, product, cart, checkout...).

**Được phép:**
- Tổ chức UI + logic cho feature:
  - gọi service
  - handle submit
  - validate (client-side)
  - local state / react-hook-form (nếu dùng)
  - gọi redux dispatch/selectors (nếu là shared state)
  - gọi react-query hooks
- Có thể chia nhỏ component con trong feature folder.

**Không nên:**
- Không đặt component dùng chung (button/card/loading...) ở feature.
- Nếu component có thể tái sử dụng nhiều nơi → đưa về `components/common/**`.

---

### 2.3. `app/components/common/` (COMPONENT DÙNG CHUNG)
Chứa component tái sử dụng. Không gắn chặt vào 1 feature cụ thể.

Ví dụ hiện có:
- `button/custom-button.tsx`
- `card/client/product.card.tsx`
- `loading/card-item.loading.tsx`
- `modal/*`
- `shared/*` (empty list, pagination, not found...)

**Rule:**
- Component common chỉ nhận props và render.
- Không “ngầm” gọi service/dispatch.
- Nếu cần data → truyền từ feature xuống.

---

### 2.4. `app/components/ui/` (SHADCN UI)
Đây là các component UI base (accordion, dialog, button, input…).

**Rule:**
- Không sửa logic nghiệp vụ ở đây.
- Nếu cần custom UI behavior đặc thù dự án → tạo wrapper trong `components/common/**` (ví dụ `custom-button.tsx`), tránh chỉnh thẳng file shadcn nếu không cần.

---

### 2.5. `app/common/`
- `configs/`:
  - `axios.config.ts` (client axios config)
  - `axios.server.ts` (server axios config hoặc server-side helper)
- `constants/`: hằng số, enum, keys, route constants...
- `helpers/`: util functions, mapper, formatter...

**Rule:**
- Tất cả hàm trong `common` phải “stateless” và tái dùng được.
- Không chứa logic riêng 1 feature (logic riêng feature → nằm ở feature folder).

---

### 2.6. `app/services/`
Chứa service gọi API, DTO request/response, và server helpers.

Ví dụ hiện có:
- `services/auth/auth.service.ts`
- `services/auth/auth.server.ts`
- `services/auth/dto/*`

**Rule phân tách:**
- `*.service.ts`: hàm gọi API dùng cho client-side (và có thể dùng chung nếu phù hợp).
- `*.server.ts`: code chỉ chạy trên server (Remix loader/action, cookie/session logic, bảo mật...).
- `dto/*`: định nghĩa kiểu request/response rõ ràng.

**Không được:**
- Không render UI trong services.
- Không truy cập Redux store trong services.

---

### 2.7. `app/store/` (REDUX)
Hiện có:
- `auth/auth.slice.ts`, `auth.state.ts`, `auth.hook.ts`
- `reducer.ts`, `store.ts`, `storage.ts`

**Rule:**
- Redux chỉ dùng cho state dùng chung nhiều nơi: auth user, role, cart (nếu cần), preferences…
- Tránh lạm dụng redux cho state “cục bộ” của 1 page/1 form.
- Mỗi domain/feature dùng chung có 1 folder slice riêng.

---

### 2.8. `app/hooks/`
- `hooks/redux.tsx`: typed hooks cho redux (`useAppDispatch`, `useAppSelector`…)
- `hooks/react-query/*`: hooks query/mutation

**Rule:**
- Hook phải có mục đích rõ ràng và tên theo dạng `useXxx`.
- Query hooks chỉ wrap react-query + gọi service, không render UI.

---

### 2.9. `app/layouts/`
- `admin/*`
- `auth/*`
- `client/*`
- `main.layout.tsx`

**Rule:**
- Layout chỉ phụ trách khung UI (header/footer/sidebar), slot children.
- Logic auth guard nên đặt ở `components/provider/**` hoặc route-level minimal wiring, nhưng phần xử lý chính nên gom vào provider.

---

### 2.10. `app/components/provider/`
Ví dụ:
- `auth.provider.tsx`
- `guest-only.provider.tsx`
- `role.provider.tsx`
- `user.provider.tsx`
- `client.provider.tsx`

**Rule:**
- Provider xử lý cross-cutting concerns: auth state, role gating, user hydration…
- Không nhét logic feature cụ thể vào provider.
- Nếu provider cần gọi service → gọi qua `services/**`.

---

### 2.11. `app/types/`
- `types/entities/*`: `product.type.ts`, `user.type.ts`...
- `types/global/*`: `api.response.ts`, `base.request.ts`, `base.response.ts`, `window.d.ts`

**Rule:**
- Mọi API response/request đều typed rõ ràng.
- Entities tách riêng để tránh circular import.

---

## 3) Quy ước đặt tên & code style

### 3.1. File/Folder naming
- `kebab-case` cho folder/file (phần lớn hiện tại đang theo chuẩn này):
  - `login.form.tsx`, `admin.sidebar.tsx`, `product.card.tsx`
- Route file theo Remix convention nhưng vẫn giữ kebab-case nếu có segment dài:
  - `routes/public/home.tsx`
- DTO:
  - `login.request.ts`, `login.response.ts`

### 3.2. Component naming
- Component React: `PascalCase` trong code (`LoginForm`, `AdminSidebar`…)
- File theo pattern:
  - `<feature>.<role>.tsx` ví dụ: `login.form.tsx`, `modal.delete.tsx`
  - `<entity>.<ui>.tsx` ví dụ: `product.card.tsx`

### 3.3. Import rule (tránh ngợp context)
- Import theo thứ tự:
  1) lib/external
  2) internal absolute-ish (theo alias nếu có)
  3) relative
- Không import chéo giữa feature nếu không cần.
  - Nếu cần dùng chung → chuyển về `common` hoặc `services` hoặc `types`.

---

## 4) Routing rule chi tiết (Remix)

### 4.1. Route entry “mỏng”
Trong `app/routes/**`:
- Chỉ render layout + feature component.
- Chỉ meta/SEO.
- Không gọi API trực tiếp.

### 4.2. Loader/Action (nếu dùng)
Nếu một route cần loader/action:
- Loader/action chỉ làm “orchestration” tối thiểu:
  - gọi `services/*.server.ts`
  - validate input cơ bản
  - trả data
- UI logic vẫn nằm trong feature component.

> Nếu có code lặp giữa nhiều loader/action → đưa vào `services/**` hoặc `common/helpers`.

---

## 5) Data fetching & State strategy

### 5.1. Khi nào dùng Redux?
Dùng Redux cho:
- Auth session/user info dùng xuyên app
- Role/permission
- Shared UI state (global modal state, theme, …) nếu thật sự cần

Không dùng Redux cho:
- state chỉ phục vụ 1 form/1 page
- data list có caching tốt hơn bằng react-query

### 5.2. Khi nào dùng React Query?
Dùng React Query cho:
- fetch list/detail có caching, refetch, stale time
- mutation có invalidation (create/update/delete)

Query hooks đặt ở:
- `app/hooks/react-query/*`

### 5.3. Axios config
- Client axios: `app/common/configs/axios.config.ts`
- Server axios: `app/common/configs/axios.server.ts` hoặc dùng `services/*.server.ts`

**Rule:**
- Mọi call API đi qua `services/**`, không gọi axios trực tiếp từ UI.
- DTO luôn đi kèm service.

---

## 6) Quy tắc phân lớp (AI phải tuân thủ)

Khi AI tạo mới code, phải tự trả lời:
1) Đây là route entry? → đặt ở `app/routes/**` và **chỉ render feature + SEO**
2) Đây là logic tính năng? → đặt ở `app/components/feature/**`
3) Đây là UI dùng lại? → đặt ở `app/components/common/**` (hoặc `components/ui/**` nếu là shadcn primitive)
4) Đây là gọi API? → đặt ở `app/services/**` + `dto/**`
5) Đây là helper dùng chung? → đặt ở `app/common/helpers/**`
6) Đây là state dùng chung? → đặt ở `app/store/**`

**Tuyệt đối tránh:**
- nhét logic vào route
- nhét call API vào component common
- nhét UI render vào service

---

## 7) Checklist khi thêm 1 Feature mới (chuẩn hóa vibe coding)

Ví dụ thêm feature `product`:

1) Tạo UI/logic trong:
- `app/components/feature/product/`
  - `product.list.tsx` / `product.detail.tsx` / `product.filter.tsx` (tuỳ)
2) Tạo service:
- `app/services/product/product.service.ts`
- `app/services/product/dto/*`
3) Nếu có server orchestration:
- `app/services/product/product.server.ts`
4) Nếu cần react-query:
- `app/hooks/react-query/use-product.query.tsx` (hoặc tách list/detail)
5) Nếu cần type entity:
- `app/types/entities/product.type.ts`
6) Route chỉ mount:
- `app/routes/public/products.tsx` (tuỳ cấu trúc routes)
7) Component dùng chung (nếu phát sinh):
- `app/components/common/...`

---

## 8) Quy ước “AI làm việc trong dự án này”
Khi được yêu cầu `code màn X / feature Y`, AI phải:
1) Tạo/đặt file đúng layer theo rule trên.
2) Route chỉ mount feature + SEO.
3) Mọi API call đi qua services/** + DTO typed.
4) UI base dùng components/ui/** (shadcn) hoặc wrapper ở components/common/**.
5) Không tạo “một đống file” nếu không cần; ưu tiên nhỏ gọn, đúng nơi.