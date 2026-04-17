import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "~/services/order/order.service";
import type { CreateOrderRequest } from "~/services/order/dto/create-order/create-order.request";
import type { GetMyOrdersRequest } from "~/services/order/dto/get-my-orders/get-my-orders.request";
import type { ValidateVoucherRequest } from "~/services/order/dto/validate-voucher/validate-voucher.request";
import { cartKeys } from "./use-cart.query";
import { showErrorToast, showSuccessToast } from "~/components/common/toast";

// ==========================================
// Query Keys
// ==========================================

export const orderKeys = {
  all: ["orders"] as const,
  myOrders: (params: GetMyOrdersRequest) =>
    [...orderKeys.all, "myOrders", params] as const,
  detail: (id: number) => [...orderKeys.all, "detail", id] as const,
  vnpayReturn: (params: Record<string, string>) =>
    [...orderKeys.all, "vnpayReturn", params] as const,
  availableVouchers: (subtotal: number) =>
    [...orderKeys.all, "availableVouchers", subtotal] as const,
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

export const useHandleVnPayReturn = (params: Record<string, string>) => {
  return useQuery({
    queryKey: orderKeys.vnpayReturn(params),
    queryFn: async () => {
      const response = await orderService.handleVnPayReturn(params);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể xác thực kết quả VNPay");
      }
      return response.data;
    },
    enabled: Object.keys(params).length > 0,
    retry: 1,
    staleTime: 0,
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

export const useCreateVnPayPaymentUrl = () => {
  return useMutation({
    mutationFn: async (orderId: number) => {
      const response = await orderService.createVnPayPaymentUrl({ orderId });
      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Không thể tạo URL thanh toán VNPay",
        );
      }
      return response.data;
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Không thể khởi tạo thanh toán VNPay.");
    },
  });
};

export const useConfirmOrderReceived = (orderId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await orderService.confirmReceived(orderId);
      if (!response.success) {
        throw new Error(response.message || "Không thể xác nhận đã nhận hàng");
      }
      return response.data;
    },
    onSuccess: () => {
      showSuccessToast("Xác nhận đã nhận hàng thành công.");
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Xác nhận thất bại. Vui lòng thử lại.");
    },
  });
};

/**
 * Hook kiểm tra và preview discount của voucher (dry-run).
 * Không tạo redemption record — chỉ trả về discountAmount.
 */
export const useValidateVoucher = () => {
  return useMutation({
    mutationFn: async (request: ValidateVoucherRequest) => {
      const response = await orderService.validateVoucher(request);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Mã voucher không hợp lệ");
      }
      return response.data;
    },
  });
};

/**
 * Hook lấy danh sách voucher khả dụng cho customer tại checkout.
 * Enabled khi subtotal > 0.
 */
export const useAvailableVouchers = (subtotal: number) => {
  return useQuery({
    queryKey: orderKeys.availableVouchers(subtotal),
    queryFn: async () => {
      const response = await orderService.getAvailableVouchers(subtotal);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải danh sách voucher");
      }
      return response.data;
    },
    enabled: subtotal > 0,
    staleTime: 2 * 60 * 1000,
  });
};
