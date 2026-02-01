import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sneakerService } from "~/services/shop/sneaker/sneaker.service";
import type { GetSneakerRequest } from "~/services/shop/sneaker/dto/get-sneaker/get-sneaker.request";
import type { GetSneakerDetailResponse } from "~/services/shop/sneaker/dto/get-sneaker/get-sneaker.response";

// ==========================================
// Query Keys
// ==========================================

export const sneakerKeys = {
  all: ["sneakers"] as const,
  lists: () => [...sneakerKeys.all, "list"] as const,
  list: (query: GetSneakerRequest) => [...sneakerKeys.lists(), query] as const,
  details: () => [...sneakerKeys.all, "detail"] as const,
  detail: (id: number) => [...sneakerKeys.details(), id] as const,
  detailBySlug: (slug: string) =>
    [...sneakerKeys.details(), "slug", slug] as const,
  statistics: () => [...sneakerKeys.all, "statistics"] as const,
};

// ==========================================
// Queries
// ==========================================

/**
 * Hook lấy danh sách sneaker với phân trang và filter
 */
export const useSneakerList = (query: GetSneakerRequest) => {
  return useQuery({
    queryKey: sneakerKeys.list(query),
    queryFn: async () => {
      const response = await sneakerService.getSneaker(query);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải danh sách sản phẩm");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook lấy chi tiết sneaker
 */
export const useSneakerDetail = (id: number) => {
  return useQuery({
    queryKey: sneakerKeys.detail(id),
    queryFn: async () => {
      const response = await sneakerService.getDetailSneaker(id);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải thông tin sản phẩm");
      }
      return response.data;
    },
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

/**
 * Hook lấy chi tiết sneaker theo slug
 * @param slug - Slug của sneaker
 * @param initialData - Data từ SSR loader, nếu có sẽ không gọi API
 */
export const useSneakerDetailBySlug = (
  slug: string,
  initialData?: GetSneakerDetailResponse | null,
) => {
  return useQuery<GetSneakerDetailResponse>({
    queryKey: sneakerKeys.detailBySlug(slug),
    queryFn: async () => {
      const response = await sneakerService.getSneakerBySlug(slug);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải thông tin sản phẩm");
      }
      return response.data;
    },
    // Không gọi API nếu đã có initialData từ SSR
    enabled: !!slug && slug.length > 0 && !initialData,
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

/**
 * Hook lấy thống kê sneaker
 */
export const useSneakerStatistics = () => {
  return useQuery({
    queryKey: sneakerKeys.statistics(),
    queryFn: async () => {
      const response = await sneakerService.getSneakerStatistics();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải thống kê sản phẩm");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// ==========================================
// Mutations
// ==========================================

/**
 * Hook tạo sneaker mới
 */
export const useCreateSneaker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await sneakerService.createSneaker(formData);
      if (!response.success) {
        throw new Error(response.message || "Không thể tạo sản phẩm");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sneakerKeys.lists() });
      toast.success("Tạo sản phẩm thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi tạo sản phẩm");
    },
  });
};

/**
 * Hook cập nhật sneaker
 */
export const useUpdateSneaker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: number;
      formData: FormData;
    }) => {
      const response = await sneakerService.updateSneaker(id, formData);
      if (!response.success) {
        throw new Error(response.message || "Không thể cập nhật sản phẩm");
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sneakerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: sneakerKeys.detail(variables.id),
      });
      toast.success("Cập nhật sản phẩm thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật sản phẩm");
    },
  });
};

/**
 * Hook xóa sneaker
 */
export const useDeleteSneaker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await sneakerService.deleteSneaker(id);
      if (!response.success) {
        throw new Error(response.message || "Không thể xóa sản phẩm");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sneakerKeys.lists() });
      toast.success("Xóa sản phẩm thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi xóa sản phẩm");
    },
  });
};

// ==========================================
// Featured Sneakers Queries
// ==========================================

/**
 * Hook lấy sản phẩm nổi bật theo loại
 */
export const useFeaturedSneakers = (
  featuredType: "TopRated" | "MostViewed" | "BestSelling" = "BestSelling",
  limit: number = 8,
) => {
  return useQuery({
    queryKey: [...sneakerKeys.all, "featured", featuredType, limit] as const,
    queryFn: async () => {
      const response = await sneakerService.getFeaturedSneakers({
        featuredType,
        limit,
      });
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải sản phẩm nổi bật");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// ==========================================
// View Count Mutations
// ==========================================

/**
 * Hook tăng lượt xem sneaker
 */
export const useIncrementSneakerViewCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await sneakerService.incrementViewCount(id);
      if (!response.success) {
        throw new Error(response.message || "Không thể cập nhật lượt xem");
      }
      return response.data;
    },
    onSuccess: (_, id) => {
      // Optionally invalidate detail query to refresh view count
      queryClient.invalidateQueries({
        queryKey: sneakerKeys.detail(id),
      });
    },
    // Silent error - không hiển thị toast cho view count
  });
};
