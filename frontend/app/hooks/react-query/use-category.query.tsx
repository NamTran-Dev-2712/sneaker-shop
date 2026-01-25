import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "~/services/shop/category/category.service";
import type { GetCategoryAccessoryRequest } from "~/services/shop/category/dto/get-category-accessory/get-category-accessory.request";
import type { ApiResponseError } from "~/types/global/api.response";
import { getErrMessage } from "~/common/helpers/get-err-message.helper";
import { showSuccessToast } from "~/components/common/toast/toast.success";
import { showErrorToast } from "~/components/common/toast/toast.error";

// ==========================================
// Query Keys
// ==========================================

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (query: GetCategoryAccessoryRequest) =>
    [...categoryKeys.lists(), query] as const,
  allList: () => [...categoryKeys.all, "all"] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
  statistics: () => [...categoryKeys.all, "statistics"] as const,
};

// ==========================================
// Queries
// ==========================================

/**
 * Hook lấy danh sách category với phân trang và filter
 */
export const useCategoryList = (query: GetCategoryAccessoryRequest) => {
  return useQuery({
    queryKey: categoryKeys.list(query),
    queryFn: async () => {
      const response = await categoryService.getCategory(query);
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
 * Hook lấy tất cả category (không phân trang)
 */
export const useCategoryAll = () => {
  return useQuery({
    queryKey: categoryKeys.allList(),
    queryFn: async () => {
      const response = await categoryService.getAllCategory();
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 phút
  });
};

/**
 * Hook lấy chi tiết category
 */
export const useCategoryDetail = (id: number) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const response = await categoryService.getDetailCategory(id);
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
 * Hook lấy thống kê category
 */
export const useCategoryStatistics = () => {
  return useQuery({
    queryKey: categoryKeys.statistics(),
    queryFn: async () => {
      const response = await categoryService.getCategoryStatistics();
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
 * Hook tạo category mới
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await categoryService.createCategory(formData);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.allList() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.statistics() });
      showSuccessToast("Tạo danh mục phụ kiện thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

/**
 * Hook cập nhật category
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: number;
      formData: FormData;
    }) => {
      const response = await categoryService.updateCategory(id, formData);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.allList() });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: categoryKeys.statistics() });
      showSuccessToast("Cập nhật danh mục phụ kiện thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

/**
 * Hook xóa category
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await categoryService.deleteCategory(id);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.allList() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.statistics() });
      showSuccessToast("Xóa danh mục phụ kiện thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};
