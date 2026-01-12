import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { brandService } from "~/services/shop/brand/brand.service";
import type { GetBrandRequest } from "~/services/shop/brand/dto/get-brand/get-brand.request";
import type {
  CreateBrandRequest,
  CreateBrandSeriesRequest,
} from "~/services/shop/brand/dto/create-brand/create-brand.request";
import type {
  UpdateBrandRequest,
  UpdateBrandSeriesRequest,
} from "~/services/shop/brand/dto/update-brand/update-brand.request";
import type { ApiResponseError } from "~/types/global/api.response";
import { getErrMessage } from "~/common/helpers/get-err-message.helper";
import { showSuccessToast } from "~/components/common/toast/toast.success";
import { showErrorToast } from "~/components/common/toast/toast.error";

// Query keys
export const brandKeys = {
  all: ["brands"] as const,
  lists: () => [...brandKeys.all, "list"] as const,
  list: (query: GetBrandRequest) => [...brandKeys.lists(), query] as const,
  details: () => [...brandKeys.all, "detail"] as const,
  detail: (id: number) => [...brandKeys.details(), id] as const,
};

// Hook lấy danh sách brands
export const useBrandList = (query: GetBrandRequest) => {
  return useQuery({
    queryKey: brandKeys.list(query),
    queryFn: async () => {
      const response = await brandService.getBrand(query);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 phút
  });
};

// Hook lấy chi tiết brand
export const useBrandDetail = (id: number | null) => {
  return useQuery({
    queryKey: brandKeys.detail(id!),
    queryFn: async () => {
      const response = await brandService.getDetailBrand(id!);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    enabled: id !== null && id > 0,
    staleTime: 1000 * 60 * 5,
  });
};

// Hook tạo brand mới
export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBrandRequest | FormData) => {
      const response = await brandService.createBrand(data);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      showSuccessToast("Tạo hãng mới thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// Hook cập nhật brand
export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateBrandRequest | FormData;
    }) => {
      const response = await brandService.updateBrand(id, data);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: brandKeys.detail(variables.id),
      });
      showSuccessToast("Cập nhật hãng thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// Hook xóa brand
export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await brandService.deleteBrand(id);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      showSuccessToast("Xóa hãng thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// ==================== BRAND SERIES HOOKS ====================

// Hook tạo brand series
export const useCreateBrandSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      brandId,
      data,
    }: {
      brandId: number;
      data: Array<{ name: string }>;
    }) => {
      // Gửi từng request riêng biệt cho mỗi series
      const promises = data.map((series) =>
        brandService.createBrandSeries({
          brandId,
          name: series.name,
        }),
      );

      const responses = await Promise.all(promises);

      // Kiểm tra nếu có lỗi
      const failedResponse = responses.find((res) => !res.success);
      if (failedResponse) {
        const error = failedResponse as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }

      return responses.map((res) => res.data).filter(Boolean);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: brandKeys.detail(variables.brandId),
      });
      const count = variables.data.length;
      showSuccessToast(`Tạo ${count} dòng sản phẩm thành công!`);
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// Hook cập nhật brand series
export const useUpdateBrandSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      brandId,
      data,
    }: {
      brandId: number;
      data: UpdateBrandSeriesRequest;
    }) => {
      const response = await brandService.updatebrandSeries(brandId, data);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: brandKeys.detail(variables.brandId),
      });
      showSuccessToast("Cập nhật dòng sản phẩm thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// Hook xóa brand series
export const useDeleteBrandSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      brandId,
      seriesId,
    }: {
      brandId: number;
      seriesId: number;
    }) => {
      const response = await brandService.useDeleteBrandSeries(
        brandId,
        seriesId,
      );
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: brandKeys.detail(variables.brandId),
      });
      showSuccessToast("Xóa dòng sản phẩm thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};
