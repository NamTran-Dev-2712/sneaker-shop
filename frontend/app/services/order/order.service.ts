import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { CreateOrderRequest } from "./dto/create-order/create-order.request";
import type { CreateOrderResponse } from "./dto/create-order/create-order.response";
import type { GetMyOrdersRequest } from "./dto/get-my-orders/get-my-orders.request";
import type { GetMyOrdersResponse } from "./dto/get-my-orders/get-my-orders.response";
import type { GetOrderDetailResponse } from "./dto/get-order-detail/get-order-detail.response";
import type { CreateVnPayPaymentUrlRequest } from "./dto/create-vnpay-payment-url/create-vnpay-payment-url.request";
import type { CreateVnPayPaymentUrlResponse } from "./dto/create-vnpay-payment-url/create-vnpay-payment-url.response";
import type { HandleVnPayReturnResponse } from "./dto/handle-vnpay-return/handle-vnpay-return.response";

export const orderService = {
  createOrder: async (
    request: CreateOrderRequest,
  ): Promise<ApiResponse<CreateOrderResponse | null>> => {
    try {
      const res = await api.post<ApiResponse<CreateOrderResponse | null>>(
        "/orders",
        request,
      );
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  createVnPayPaymentUrl: async (
    request: CreateVnPayPaymentUrlRequest,
  ): Promise<ApiResponse<CreateVnPayPaymentUrlResponse | null>> => {
    try {
      const res = await api.post<
        ApiResponse<CreateVnPayPaymentUrlResponse | null>
      >("/payments/vnpay/payment-url", request);
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  handleVnPayReturn: async (
    params: Record<string, string>,
  ): Promise<ApiResponse<HandleVnPayReturnResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<HandleVnPayReturnResponse | null>>(
        "/payments/vnpay/return",
        { params },
      );
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  getMyOrders: async (
    params: GetMyOrdersRequest,
  ): Promise<ApiResponse<GetMyOrdersResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetMyOrdersResponse | null>>(
        "/orders",
        { params },
      );
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  getOrderDetail: async (
    id: number,
  ): Promise<ApiResponse<GetOrderDetailResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetOrderDetailResponse | null>>(
        `/orders/${id}`,
      );
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  confirmReceived: async (id: number): Promise<ApiResponse<unknown>> => {
    try {
      const res = await api.post<ApiResponse<unknown>>(
        `/orders/${id}/confirm-received`,
      );
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },
};
