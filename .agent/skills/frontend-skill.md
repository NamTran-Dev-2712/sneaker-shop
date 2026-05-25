---
name: frontend-skill
description: Component patterns, React Query, Redux, form handling — đọc khi implement frontend feature
---

# Frontend Skill

> Xem real examples trước khi viết code:
> - Feature component: `frontend/app/components/feature/shop/sneaker/sneaker-list/`
> - Service + DTOs: `frontend/app/services/shop/sneaker/sneaker.service.ts`
> - React Query hook: `frontend/app/hooks/react-query/use-sneaker.query.tsx`
> - Redux slice: `frontend/app/store/auth/auth.slice.ts`
> - Zod schema: `frontend/app/lib/validation/auth/login.schema.ts`
> - Route: `frontend/app/routes/shop/sneaker/list.tsx`
> - Route config: `frontend/app/routes.ts`

## Route Pattern (thin route — BẮT BUỘC)

```tsx
// app/routes/shop/sneaker/list.tsx — KHÔNG có logic, chỉ mount feature component
import type { Route } from "./+types/list";
import { SneakerList } from "~/components/feature/shop/sneaker/sneaker-list";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Sneaker Collection" }];
}

export default function SneakerListPage() {
  return <SneakerList />;
}
```

## Feature Component Structure

```
components/feature/{domain}/{feature-name}/
├── {feature}.list.tsx        # List view
├── {feature}.detail.tsx      # Detail view
├── {feature}.form.tsx        # Create/edit form
├── {feature}.filter.tsx      # Filter controls
├── {feature}.card.tsx        # Card item
└── index.ts                  # Barrel export
```

## Service Layer

```tsx
// services/{domain}/{feature}/{feature}.service.ts
import { axiosClient } from "~/common/configs/axios.config";
import type { GetSneakersRequest, GetSneakersResponse, SneakerDto } from "./dto";

export const sneakerService = {
  getList: async (params: GetSneakersRequest): Promise<ApiResponse<GetSneakersResponse>> => {
    const { data } = await axiosClient.get("/api/sneakers", { params });
    return data;
  },
  getById: async (id: number): Promise<ApiResponse<SneakerDto>> => {
    const { data } = await axiosClient.get(`/api/sneakers/${id}`);
    return data;
  },
  create: async (formData: FormData): Promise<ApiResponse<SneakerDto>> => {
    const { data } = await axiosClient.post("/api/sneakers", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};
```

## React Query Hook Pattern

```tsx
// hooks/react-query/use-sneaker.query.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query key factory
export const sneakerKeys = {
  all: ["sneakers"] as const,
  lists: () => [...sneakerKeys.all, "list"] as const,
  list: (filters: GetSneakersRequest) => [...sneakerKeys.lists(), filters] as const,
  details: () => [...sneakerKeys.all, "detail"] as const,
  detail: (id: number) => [...sneakerKeys.details(), id] as const,
};

export function useSneakers(filters: GetSneakersRequest) {
  return useQuery({
    queryKey: sneakerKeys.list(filters),
    queryFn: () => sneakerService.getList(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSneaker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => sneakerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sneakerKeys.lists() }); // ← BẮT BUỘC
    },
  });
}
```

## Form Pattern (react-hook-form + Zod)

```tsx
// Zod schema in app/lib/validation/{domain}/{schema}.ts
const sneakerSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc").max(200),
  brandId: z.number().positive("Thương hiệu là bắt buộc"),
  mainImage: z.instanceof(File).optional(),
});

// Form component
export function SneakerForm({ defaultValues, onSubmit, isLoading }: SneakerFormProps) {
  const form = useForm<z.infer<typeof sneakerSchema>>({
    resolver: zodResolver(sneakerSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Tên</FormLabel>
            <Input {...field} />
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={isLoading}>Lưu</Button>
      </form>
    </Form>
  );
}
```

## State Management Decision Matrix

| Scenario | Solution | Example |
|----------|----------|---------|
| Server data | React Query | Product list, user profile |
| Auth state | Redux + persist | Current user, token |
| Form state | react-hook-form | Create/edit forms |
| UI state | useState | Modal, accordion |
| Cross-route shared | Redux | Cart, preferences |
| URL state | searchParams | Filters, pagination |

## Component Naming Convention

```
{feature}.{type}.tsx

Types: list, detail, form, card, filter, modal, table
```

## Import Order

```tsx
// 1. External
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// 2. Absolute (~/...)
import { Button } from "~/components/ui/button";
import { sneakerService } from "~/services/shop/sneaker/sneaker.service";

// 3. Relative
import { SneakerCard } from "./sneaker.card";
```

## Common Patterns

- **Loading/Error**: sử dụng skeleton + error boundary
- **Pagination**: dùng `BaseGetResponse` từ backend (`items`, `totalPages`, `hasNextPage`...)
- **Toast notifications**: `sonner` library — `toast.success()`, `toast.error()`
- **Image upload**: `FormData` + `Content-Type: multipart/form-data`
- **Optimistic update**: chỉ dùng cho actions nhỏ (like, toggle) — KHÔNG dùng cho create/delete
import type { ProductProps } from "./types";
```

---

## Error Handling Pattern

```tsx
// Using error boundary + toast
import { toast } from "sonner";

function useProductMutation() {
  const mutation = useCreateProduct();
  
  const handleSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync(data);
      toast.success("Product created successfully!");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to create product");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };
  
  return { handleSubmit, isLoading: mutation.isPending };
}
```
