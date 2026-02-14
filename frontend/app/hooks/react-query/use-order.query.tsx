import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "~/services/order/order.service";
import type { CreateOrderRequest } from "~/services/order/dto/create-order/create-order.request";
import { cartKeys } from "./use-cart.query";
import { showErrorToast } from "~/components/common/toast";

// ==========================================
// Query Keys
// ==========================================

export const orderKeys = {
  all: ["orders"] as const,
  detail: (id: number) => [...orderKeys.all, "detail", id] as const,
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
