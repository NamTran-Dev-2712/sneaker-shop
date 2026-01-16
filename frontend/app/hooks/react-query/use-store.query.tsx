import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeService } from "~/services/shop/store/store.service";
import type { GetStoreRequest } from "~/services/shop/store/dto/get-store/get-store.request";
import type { CreateStoreRequest } from "~/services/shop/store/dto/create-store/create-store.request";
import type { UpdateStoreRequest } from "~/services/shop/store/dto/update-store/update-store.request";
import type { ApiResponseError } from "~/types/global/api.response";
import { getErrMessage } from "~/common/helpers/get-err-message.helper";
import { showSuccessToast } from "~/components/common/toast/toast.success";
import { showErrorToast } from "~/components/common/toast/toast.error";

// Query keys
export const storeKeys = {
  all: ["stores"] as const,
  lists: () => [...storeKeys.all, "list"] as const,
  list: (query: GetStoreRequest) => [...storeKeys.lists(), query] as const,
  details: () => [...storeKeys.all, "detail"] as const,
  detail: (id: number) => [...storeKeys.details(), id] as const,
  statistics: () => [...storeKeys.all, "statistics"] as const,
};

// Hook lấy danh sách stores
export const useStoreList = (query: GetStoreRequest) => {
  return useQuery({
    queryKey: storeKeys.list(query),
    queryFn: async () => {
      const response = await storeService.getStore(query);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 phút
  });
};

// Hook lấy chi tiết store
export const useStoreDetail = (id: number | null) => {
  return useQuery({
    queryKey: storeKeys.detail(id!),
    queryFn: async () => {
      const response = await storeService.getDetailStore(id!);
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

// Hook lấy thống kê stores
export const useStoreStatistics = () => {
  return useQuery({
    queryKey: storeKeys.statistics(),
    queryFn: async () => {
      const response = await storeService.getStoreStatistics();
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 phút
  });
};

// Hook tạo store mới
export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStoreRequest) => {
      const response = await storeService.createStore(data);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      showSuccessToast("Tạo cửa hàng mới thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// Hook cập nhật store
export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateStoreRequest;
    }) => {
      const response = await storeService.updateStore(id, data);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: storeKeys.detail(variables.id),
      });
      showSuccessToast("Cập nhật cửa hàng thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// Hook xóa store
export const useDeleteStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await storeService.deleteStore(id);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      showSuccessToast("Xóa cửa hàng thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};
