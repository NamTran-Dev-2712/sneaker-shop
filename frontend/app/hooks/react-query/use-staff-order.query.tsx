import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorToast, showSuccessToast } from "~/components/common/toast";
import type { CancelStoreOrderRequest } from "~/services/order/dto/cancel-store-order/cancel-store-order.request";
import type { GetStoreOrdersRequest } from "~/services/order/dto/get-store-orders/get-store-orders.request";
import type { ShipStoreOrderRequest } from "~/services/order/dto/ship-store-order/ship-store-order.request";
import { staffOrderService } from "~/services/order/staff-order.service";

// ---------------------------------------------------------------------------
// Query keys — export so consumers can reference without magic strings
// ---------------------------------------------------------------------------
export const staffOrderKeys = {
  all: ["staffOrders"] as const,
  list: (params: GetStoreOrdersRequest) =>
    [...staffOrderKeys.all, "list", params] as const,
  detail: (id: number) => [...staffOrderKeys.all, "detail", id] as const,
};

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const useStoreOrders = (params: GetStoreOrdersRequest) => {
  return useQuery({
    queryKey: staffOrderKeys.list(params),
    queryFn: async () => {
      const response = await staffOrderService.getStoreOrders(params);
      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Không thể tải danh sách đơn hàng.",
        );
      }
      return response.data;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000,
  });
};

export const useStoreOrderDetail = (id: number) => {
  return useQuery({
    queryKey: staffOrderKeys.detail(id),
    queryFn: async () => {
      const response = await staffOrderService.getStoreOrderDetail(id);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải chi tiết đơn hàng.");
      }
      return response.data;
    },
    enabled: id > 0,
    staleTime: 20 * 1000,
  });
};

// ---------------------------------------------------------------------------
// Shared invalidation helper — invalidates detail + all list queries
// ---------------------------------------------------------------------------
function useOrderInvalidation(orderId: number) {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: staffOrderKeys.detail(orderId),
      }),
      queryClient.invalidateQueries({
        queryKey: staffOrderKeys.all, // prefix match — hits all list queries
      }),
    ]);
  };
}

// ---------------------------------------------------------------------------
// Shared status mutation factory — keeps mutation hooks DRY
// ---------------------------------------------------------------------------
const useStatusMutation = (
  mutationFn: () => Promise<unknown>,
  successMessage: string,
  orderId: number,
) => {
  const invalidate = useOrderInvalidation(orderId);

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      showSuccessToast(successMessage);
      await invalidate();
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Thao tác thất bại.");
    },
  });
};

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export const useConfirmStoreOrder = (orderId: number) => {
  return useStatusMutation(
    async () => {
      const response = await staffOrderService.confirmOrder(orderId);
      if (!response.success) {
        throw new Error(response.message || "Không thể xác nhận đơn hàng.");
      }
      return response.data;
    },
    "Xác nhận đơn hàng thành công.",
    orderId,
  );
};

export const useMarkStoreOrderPaid = (orderId: number) => {
  return useStatusMutation(
    async () => {
      const response = await staffOrderService.markPaidOrder(orderId);
      if (!response.success) {
        throw new Error(response.message || "Không thể cập nhật thanh toán.");
      }
      return response.data;
    },
    "Đã cập nhật trạng thái thanh toán.",
    orderId,
  );
};

export const usePackStoreOrder = (orderId: number) => {
  return useStatusMutation(
    async () => {
      const response = await staffOrderService.packOrder(orderId);
      if (!response.success) {
        throw new Error(response.message || "Không thể đóng gói đơn hàng.");
      }
      return response.data;
    },
    "Đóng gói đơn hàng thành công.",
    orderId,
  );
};

export const useShipStoreOrder = (orderId: number) => {
  const invalidate = useOrderInvalidation(orderId);

  return useMutation({
    mutationFn: async (request: ShipStoreOrderRequest) => {
      const response = await staffOrderService.shipOrder(orderId, request);
      if (!response.success) {
        throw new Error(response.message || "Không thể bàn giao vận chuyển.");
      }
      return response.data;
    },
    onSuccess: async () => {
      showSuccessToast("Đã bàn giao cho đơn vị vận chuyển.");
      await invalidate();
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Thao tác thất bại.");
    },
  });
};

export const useDeliverStoreOrder = (orderId: number) => {
  return useStatusMutation(
    async () => {
      const response = await staffOrderService.deliverOrder(orderId);
      if (!response.success) {
        throw new Error(response.message || "Không thể hoàn tất đơn hàng.");
      }
      return response.data;
    },
    "Đơn hàng đã hoàn tất.",
    orderId,
  );
};

export const useCancelStoreOrder = (orderId: number) => {
  const invalidate = useOrderInvalidation(orderId);

  return useMutation({
    mutationFn: async (request: CancelStoreOrderRequest) => {
      const response = await staffOrderService.cancelOrder(orderId, request);
      if (!response.success) {
        throw new Error(response.message || "Không thể hủy đơn hàng.");
      }
      return response.data;
    },
    onSuccess: async () => {
      showSuccessToast("Hủy đơn hàng thành công.");
      await invalidate();
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Thao tác thất bại.");
    },
  });
};
