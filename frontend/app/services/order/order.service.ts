import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { CreateOrderRequest } from "./dto/create-order/create-order.request";
import type { CreateOrderResponse } from "./dto/create-order/create-order.response";

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
};
