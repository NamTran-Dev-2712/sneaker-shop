import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "~/services/order/order.service";
import type { CreateOrderRequest } from "~/services/order/dto/create-order/create-order.request";
import type { GetMyOrdersRequest } from "~/services/order/dto/get-my-orders/get-my-orders.request";
import { cartKeys } from "./use-cart.query";
import { showErrorToast } from "~/components/common/toast";

// ==========================================
// Query Keys
// ==========================================

export const orderKeys = {
  all: ["orders"] as const,
  myOrders: (params: GetMyOrdersRequest) =>
    [...orderKeys.all, "myOrders", params] as const,
  detail: (id: number) => [...orderKeys.all, "detail", id] as const,
};

// ==========================================
// Queries
// ==========================================

/**
 * Hook lấy danh sách đơn hàng của customer đang đăng nhập.
 */
export const useMyOrders = (params: GetMyOrdersRequest) => {
  return useQuery({
    queryKey: orderKeys.myOrders(params),
    queryFn: async () => {
      const response = await orderService.getMyOrders(params);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải danh sách đơn hàng");
      }
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook lấy chi tiết đơn hàng theo ID.
 */
export const useOrderDetail = (id: number) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const response = await orderService.getOrderDetail(id);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải chi tiết đơn hàng");
      }
      return response.data;
    },
    enabled: id > 0,
    staleTime: 2 * 60 * 1000,
  });
};

// ==========================================
// Mutations
// ==========================================

/**
 * Hook tạo đơn hàng mới.
 * Caller is responsible for navigation and checkout-state reset
 * (because multi-store checkout creates orders sequentially).
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateOrderRequest) => {
      const response = await orderService.createOrder(request);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tạo đơn hàng");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate cart data (items reserved after ordering)
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (error: Error) => {
      showErrorToast(
        error.message || "Không thể tạo đơn hàng. Vui lòng thử lại.",
      );
    },
  });
};
