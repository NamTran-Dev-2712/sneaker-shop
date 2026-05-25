import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorService } from "~/services/procurement/vendor/vendor.service";
import type {
  GetVendorRequest,
  GetVendorSellableItemsRequest,
} from "~/services/procurement/vendor/dto/get-vendor/get-vendor.request";
import type { CreateVendorRequest } from "~/services/procurement/vendor/dto/create-vendor/create-vendor.request";
import type { UpdateVendorRequest } from "~/services/procurement/vendor/dto/update-vendor/update-vendor.request";
import type { AddSellableItemRequest } from "~/services/procurement/vendor/dto/add-sellable/add-sellable.request";
import type { UpdateSellableItemRequest } from "~/services/procurement/vendor/dto/update-sellable/update-sellable.request";
import type { ApiResponseError } from "~/types/global/api.response";
import { getErrMessage } from "~/common/helpers/get-err-message.helper";
import { showSuccessToast } from "~/components/common/toast/toast.success";
import { showErrorToast } from "~/components/common/toast/toast.error";

// Query keys
export const vendorKeys = {
  all: ["vendors"] as const,
  lists: () => [...vendorKeys.all, "list"] as const,
  list: (query: GetVendorRequest) => [...vendorKeys.lists(), query] as const,
  allList: () => [...vendorKeys.all, "all"] as const,
  details: () => [...vendorKeys.all, "detail"] as const,
  detail: (id: number) => [...vendorKeys.details(), id] as const,
  statistics: () => [...vendorKeys.all, "statistics"] as const,
  sellableItems: () => [...vendorKeys.all, "sellable-items"] as const,
  sellableItemList: (
    vendorId: number,
    query: Omit<GetVendorSellableItemsRequest, "vendorId">,
  ) => [...vendorKeys.sellableItems(), vendorId, query] as const,
};

// Hook lấy danh sách vendors có phân trang
export const useVendorList = (query: GetVendorRequest) => {
  return useQuery({
    queryKey: vendorKeys.list(query),
    queryFn: async () => {
      const response = await vendorService.getVendor(query);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 phút
  });
};

// Hook lấy tất cả vendors không phân trang (dùng cho select trong form)
export const useAllVendors = () => {
  return useQuery({
    queryKey: vendorKeys.allList(),
    queryFn: async () => {
      const response = await vendorService.getAllVendors();
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 phút - dữ liệu ít thay đổi
  });
};

// Hook lấy chi tiết vendor
export const useVendorDetail = (id: number | null) => {
  return useQuery({
    queryKey: vendorKeys.detail(id!),
    queryFn: async () => {
      const response = await vendorService.getDetailVendor(id!);
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

// Hook lấy thống kê vendors
export const useVendorStatistics = () => {
  return useQuery({
    queryKey: vendorKeys.statistics(),
    queryFn: async () => {
      const response = await vendorService.getStatisticVendor();
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 phút
  });
};

// Hook lấy danh sách sellable items của vendor
export const useVendorSellableItems = (
  vendorId: number | null,
  query: Omit<GetVendorSellableItemsRequest, "vendorId">,
) => {
  return useQuery({
    queryKey: vendorKeys.sellableItemList(vendorId!, query),
    queryFn: async () => {
      const response = await vendorService.getVendorSellableItems(
        vendorId!,
        query,
      );
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    enabled: vendorId !== null && vendorId > 0,
    staleTime: 1000 * 60 * 5,
  });
};

// Hook tạo vendor mới
export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVendorRequest) => {
      const response = await vendorService.createVendor(data);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorKeys.statistics() });
      showSuccessToast("Tạo nhà cung cấp mới thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// Hook cập nhật vendor
export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateVendorRequest) => {
      const response = await vendorService.updateVendor(data);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: vendorKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: vendorKeys.statistics() });
      showSuccessToast("Cập nhật nhà cung cấp thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// Hook xóa vendor
export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await vendorService.deleteVendor(id);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorKeys.statistics() });
      showSuccessToast("Xóa nhà cung cấp thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// Hook thêm sellable item vào vendor
export const useAddVendorSellableItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      vendorId,
      data,
    }: {
      vendorId: number;
      data: Omit<AddSellableItemRequest, "vendorId">;
    }) => {
      const response = await vendorService.addSellable(vendorId, {
        ...data,
        vendorId,
      });
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.sellableItems() });
      queryClient.invalidateQueries({
        queryKey: vendorKeys.detail(variables.vendorId),
      });
      queryClient.invalidateQueries({ queryKey: vendorKeys.statistics() });
      showSuccessToast("Thêm sản phẩm vào nhà cung cấp thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// Hook cập nhật sellable item của vendor
export const useUpdateVendorSellableItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      vendorId,
      vendorPriceId,
      data,
    }: {
      vendorId: number;
      vendorPriceId: number;
      data: Omit<UpdateSellableItemRequest, "id" | "vendorId">;
    }) => {
      const response = await vendorService.updateSellable(
        vendorId,
        vendorPriceId,
        {
          ...data,
          id: vendorPriceId,
          vendorId,
        },
      );
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.sellableItems() });
      queryClient.invalidateQueries({
        queryKey: vendorKeys.detail(variables.vendorId),
      });
      showSuccessToast("Cập nhật giá sản phẩm thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// Hook xóa sellable item khỏi vendor
export const useRemoveVendorSellableItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      vendorId,
      vendorPriceId,
    }: {
      vendorId: number;
      vendorPriceId: number;
    }) => {
      const response = await vendorService.removeSellable(
        vendorId,
        vendorPriceId,
      );
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.sellableItems() });
      queryClient.invalidateQueries({
        queryKey: vendorKeys.detail(variables.vendorId),
      });
      queryClient.invalidateQueries({ queryKey: vendorKeys.statistics() });
      showSuccessToast("Xóa sản phẩm khỏi nhà cung cấp thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};
