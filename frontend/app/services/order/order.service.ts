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
};
