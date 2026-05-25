import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseOrderService } from "~/services/procurement/purchase-order/purchase-order.service";
import type { GetPurchaseOrderRequest } from "~/services/procurement/purchase-order/dto/get-purchase-order/get-purchase-order.request";
import type { CreatePurchaseOrderRequest } from "~/services/procurement/purchase-order/dto/create-purchase-order/create-purchase-order.request";
import type { UpdatePurchaseOrderRequest } from "~/services/procurement/purchase-order/dto/update-purchase-order/update-purchase-order.request";
import type { UpdateStatusPurchaseOrderRequest } from "~/services/procurement/purchase-order/dto/update-status-purchase-order/update-status-purchase-order.request";
import type { ApiResponseError } from "~/types/global/api.response";
import { getErrMessage } from "~/common/helpers/get-err-message.helper";
import { showSuccessToast } from "~/components/common/toast/toast.success";
import { showErrorToast } from "~/components/common/toast/toast.error";
import { inventoryKeys } from "./use-inventory.query";

// Query keys
export const purchaseOrderKeys = {
  all: ["purchase-orders"] as const,
  lists: () => [...purchaseOrderKeys.all, "list"] as const,
  list: (query: GetPurchaseOrderRequest) =>
    [...purchaseOrderKeys.lists(), query] as const,
  details: () => [...purchaseOrderKeys.all, "detail"] as const,
  detail: (id: number) => [...purchaseOrderKeys.details(), id] as const,
  statistics: () => [...purchaseOrderKeys.all, "statistics"] as const,
};

// Hook lấy danh sách purchase orders có phân trang
export const usePurchaseOrderList = (query: GetPurchaseOrderRequest) => {
  return useQuery({
    queryKey: purchaseOrderKeys.list(query),
    queryFn: async () => {
      const response = await purchaseOrderService.getPurchaseOrder(query);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 phút
  });
};

// Hook lấy chi tiết purchase order
export const usePurchaseOrderDetail = (id: number | null) => {
  return useQuery({
    queryKey: purchaseOrderKeys.detail(id!),
    queryFn: async () => {
      const response = await purchaseOrderService.getPurchaseOrderDetail(id!);
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

// Hook lấy thống kê purchase orders
export const usePurchaseOrderStatistics = () => {
  return useQuery({
    queryKey: purchaseOrderKeys.statistics(),
    queryFn: async () => {
      const response = await purchaseOrderService.getPurchaseOrderStatistics();
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 phút
  });
};

// Hook tạo purchase order mới
export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePurchaseOrderRequest) => {
      const response = await purchaseOrderService.createPurchaseOrder(data);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.statistics(),
      });
      showSuccessToast("Tạo đơn đặt hàng mới thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// Hook cập nhật purchase order
export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePurchaseOrderRequest) => {
      const response = await purchaseOrderService.updatePurchaseOrder(data);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.statistics(),
      });
      showSuccessToast("Cập nhật đơn đặt hàng thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// Hook cập nhật trạng thái purchase order
export const useUpdatePurchaseOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateStatusPurchaseOrderRequest;
    }) => {
      const response = await purchaseOrderService.updatePurchaseOrderStatus(
        data,
        id,
      );
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.statistics(),
      });
      // Invalidate inventory khi nhận hàng
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      showSuccessToast("Cập nhật trạng thái đơn đặt hàng thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// Hook xóa purchase order
export const useDeletePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await purchaseOrderService.deletePurchaseOrder(id);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.statistics(),
      });
      showSuccessToast("Xóa đơn đặt hàng thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};
