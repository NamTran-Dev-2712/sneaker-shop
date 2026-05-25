import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accessoryService } from "~/services/shop/accessory/accessory.service";
import type { GetAccessoryRequest } from "~/services/shop/accessory/dto/get-accessory/get-accessory.request";
import type { GetAccessoryDetailResponse } from "~/services/shop/accessory/dto/get-accessory/get-accessory.response";
import type { ApiResponseError } from "~/types/global/api.response";
import { getErrMessage } from "~/common/helpers/get-err-message.helper";
import { showSuccessToast } from "~/components/common/toast/toast.success";
import { showErrorToast } from "~/components/common/toast/toast.error";

// ==========================================
// Query Keys
// ==========================================

export const accessoryKeys = {
  all: ["accessories"] as const,
  lists: () => [...accessoryKeys.all, "list"] as const,
  list: (query: GetAccessoryRequest) =>
    [...accessoryKeys.lists(), query] as const,
  details: () => [...accessoryKeys.all, "detail"] as const,
  detail: (id: number) => [...accessoryKeys.details(), id] as const,
  detailBySlug: (slug: string) =>
    [...accessoryKeys.details(), "slug", slug] as const,
  statistics: () => [...accessoryKeys.all, "statistics"] as const,
};

// ==========================================
// Queries
// ==========================================

/**
 * Hook lấy danh sách accessory với phân trang và filter
 */
export const useAccessoryList = (query: GetAccessoryRequest) => {
  return useQuery({
    queryKey: accessoryKeys.list(query),
    queryFn: async () => {
      const response = await accessoryService.getAccessory(query);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook lấy chi tiết accessory
 */
export const useAccessoryDetail = (id: number) => {
  return useQuery({
    queryKey: accessoryKeys.detail(id),
    queryFn: async () => {
      const response = await accessoryService.getDetailAccessory(id);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

/**
 * Hook lấy chi tiết accessory theo slug
 * @param slug - Slug của accessory
 * @param initialData - Data từ SSR loader, nếu có sẽ không gọi API
 */
export const useAccessoryDetailBySlug = (
  slug: string,
  initialData?: GetAccessoryDetailResponse | null,
) => {
  return useQuery<GetAccessoryDetailResponse>({
    queryKey: accessoryKeys.detailBySlug(slug),
    queryFn: async () => {
      const response = await accessoryService.getAccessoryBySlug(slug);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data!;
    },
    // Không gọi API nếu đã có initialData từ SSR
    enabled: !!slug && slug.length > 0 && !initialData,
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

/**
 * Hook lấy thống kê accessory
 */
export const useAccessoryStatistics = () => {
  return useQuery({
    queryKey: accessoryKeys.statistics(),
    queryFn: async () => {
      const response = await accessoryService.getAccessoryStatistics();
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
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
 * Hook tạo accessory mới
 */
export const useCreateAccessory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await accessoryService.createAccessory(formData);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accessoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accessoryKeys.statistics() });
      showSuccessToast("Tạo phụ kiện thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

/**
 * Hook cập nhật accessory
 */
export const useUpdateAccessory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: number;
      formData: FormData;
    }) => {
      const response = await accessoryService.updateAccessory(id, formData);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accessoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: accessoryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: accessoryKeys.statistics() });
      showSuccessToast("Cập nhật phụ kiện thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

/**
 * Hook xóa accessory
 */
export const useDeleteAccessory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await accessoryService.deleteAccessory(id);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accessoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accessoryKeys.statistics() });
      showSuccessToast("Xóa phụ kiện thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// ==========================================
// Featured Accessories Queries
// ==========================================

/**
 * Hook lấy phụ kiện nổi bật theo loại
 */
export const useFeaturedAccessories = (
  featuredType: "TopRated" | "MostViewed" | "BestSelling" = "BestSelling",
  limit: number = 8,
) => {
  return useQuery({
    queryKey: [...accessoryKeys.all, "featured", featuredType, limit] as const,
    queryFn: async () => {
      const response = await accessoryService.getFeaturedAccessories({
        featuredType,
        limit,
      });
      if (!response.success || !response.data) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
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
 * Hook tăng lượt xem accessory
 */
export const useIncrementAccessoryViewCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await accessoryService.incrementViewCount(id);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: (_, id) => {
      // Optionally invalidate detail query to refresh view count
      queryClient.invalidateQueries({
        queryKey: accessoryKeys.detail(id),
      });
    },
    // Silent error - không hiển thị toast cho view count
  });
};
