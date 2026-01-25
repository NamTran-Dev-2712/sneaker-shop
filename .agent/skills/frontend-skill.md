---
name: frontend-skill
description: Quy tắc UI/UX, quản lý state với Redux và React Query, component patterns
---

# Frontend Skill

Hướng dẫn phát triển Frontend với React Router 7, Redux, TanStack Query, và ShadcnUI.

## Feature Component Pattern

### Feature Structure

```
components/feature/{feature-name}/
├── {feature}.list.tsx        # List view component
├── {feature}.detail.tsx      # Detail view component
├── {feature}.form.tsx        # Create/edit form
├── {feature}.filter.tsx      # Filter/search component
├── {feature}.card.tsx        # Card item component
└── index.ts                  # Barrel export
```

### Feature Component Template

```tsx
// components/feature/product/product.list.tsx
import { useProducts } from "~/hooks/react-query/use-product.query";
import { ProductCard } from "./product.card";
import { ProductFilter } from "./product.filter";
import { Pagination } from "~/components/common/shared/pagination";

export function ProductList() {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    pageSize: 12,
    search: "",
  });

  const { data, isLoading, error } = useProducts(filters);

  if (isLoading) return <ProductListSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-6">
      <ProductFilter filters={filters} onFilterChange={setFilters} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <Pagination
        currentPage={filters.page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={(page) => setFilters({ ...filters, page })}
      />
    </div>
  );
}
```

---

## Service Layer Pattern

### Service Structure

```
services/{feature}/
├── {feature}.service.ts      # Client-side API calls
├── {feature}.server.ts       # Server-side only (loaders/actions)
└── dto/
    ├── {feature}.request.ts  # Request DTOs
    └── {feature}.response.ts # Response DTOs
```

### Service Template

```tsx
// services/product/product.service.ts
import { axiosClient } from "~/common/configs/axios.config";
import type { 
  GetProductsRequest, 
  GetProductsResponse,
  CreateProductRequest,
  ProductDto 
} from "./dto";

export const productService = {
  getProducts: async (params: GetProductsRequest): Promise<GetProductsResponse> => {
    const response = await axiosClient.get("/api/products", { params });
    return response.data;
  },
  
  getProduct: async (id: number): Promise<ProductDto> => {
    const response = await axiosClient.get(`/api/products/${id}`);
    return response.data;
  },
  
  createProduct: async (data: FormData): Promise<ProductDto> => {
    const response = await axiosClient.post("/api/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  
  updateProduct: async (id: number, data: FormData): Promise<ProductDto> => {
    const response = await axiosClient.put(`/api/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  
  deleteProduct: async (id: number): Promise<void> => {
    await axiosClient.delete(`/api/products/${id}`);
  },
};
```

### DTO Template

```tsx
// services/product/dto/product.request.ts
export interface GetProductsRequest {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  brandId?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  brandId: number;
  categoryId: number;
  price: number;
  mainImage: File;
}

// services/product/dto/product.response.ts
export interface ProductDto {
  id: number;
  name: string;
  slug: string;
  mainImage: string;
  price: number;
  brandName: string;
  isActive: boolean;
}

export interface GetProductsResponse {
  items: ProductDto[];
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
```

---

## React Query Patterns

### Query Hook Template

```tsx
// hooks/react-query/use-product.query.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "~/services/product/product.service";
import type { GetProductsRequest, ProductDto } from "~/services/product/dto";

// Query keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: GetProductsRequest) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

// List query
export function useProducts(filters: GetProductsRequest) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Detail query
export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProduct(id),
    enabled: id > 0,
  });
}

// Create mutation
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: FormData) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// Update mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => 
      productService.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
}

// Delete mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
```

---

## Redux Pattern

### Slice Template

```tsx
// store/auth/auth.slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "./auth.state";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
```

### Redux Hook Usage

```tsx
// Using typed hooks
import { useAppSelector, useAppDispatch } from "~/hooks/redux";
import { setUser, clearUser } from "~/store/auth/auth.slice";

function Header() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  const handleLogout = () => {
    dispatch(clearUser());
    // Also invalidate React Query cache
  };
  
  return (
    <header>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout ({user?.email})</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </header>
  );
}
```

---

## Form Handling Pattern

### Form with react-hook-form + Zod

```tsx
// components/feature/product/product.form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().optional(),
  brandId: z.number().positive("Brand is required"),
  price: z.number().positive("Price must be positive"),
  mainImage: z.instanceof(File).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => void;
  isLoading?: boolean;
}

export function ProductForm({ defaultValues, onSubmit, isLoading }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      brandId: 0,
      price: 0,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <Input {...field} placeholder="Product name" />
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* More fields... */}
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
```

---

## State Management Decision Matrix

| Scenario | Solution | Example |
|----------|----------|---------|
| **Server data** | React Query | Product list, user profile |
| **Auth state** | Redux + persist | Current user, token |
| **Form state** | react-hook-form | Create product form |
| **UI state** | React useState | Modal open/close, accordion |
| **Cross-route shared** | Redux | Cart items, preferences |
| **URL state** | React Router searchParams | Filters, pagination |

---

## Component Naming Convention

```
{feature}.{type}.tsx

Types:
- list     → List view (ProductList)
- detail   → Detail view (ProductDetail)
- form     → Create/Edit form (ProductForm)
- card     → Card item (ProductCard)
- filter   → Filter controls (ProductFilter)
- modal    → Modal dialog (ProductModal)
- table    → Table view (ProductTable)
```

---

## Import Order

```tsx
// 1. External libraries
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// 2. Internal absolute imports (aliases)
import { Button } from "~/components/ui/button";
import { useAppSelector } from "~/hooks/redux";
import { productService } from "~/services/product/product.service";

// 3. Relative imports
import { ProductCard } from "./product.card";
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
