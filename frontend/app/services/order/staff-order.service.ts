import api from "~/common/configs/axios.config";
import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import type { GetStoreOrdersRequest } from "./dto/get-store-orders/get-store-orders.request";
import type { GetStoreOrdersResponse } from "./dto/get-store-orders/get-store-orders.response";
import type { GetStaffOrderDetailResponse } from "./dto/get-staff-order-detail/get-staff-order-detail.response";
import type { ShipStoreOrderRequest } from "./dto/ship-store-order/ship-store-order.request";
import type { CancelStoreOrderRequest } from "./dto/cancel-store-order/cancel-store-order.request";

export const staffOrderService = {
  getStoreOrders: async (
    params: GetStoreOrdersRequest,
  ): Promise<ApiResponse<GetStoreOrdersResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetStoreOrdersResponse | null>>(
        "/staff/orders",
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

  getStoreOrderDetail: async (
    id: number,
  ): Promise<ApiResponse<GetStaffOrderDetailResponse | null>> => {
    try {
      const res = await api.get<
        ApiResponse<GetStaffOrderDetailResponse | null>
      >(`/staff/orders/${id}`);
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

  confirmOrder: async (id: number): Promise<ApiResponse<unknown>> => {
    try {
      const res = await api.post<ApiResponse<unknown>>(
        `/staff/orders/${id}/confirm`,
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

  markPaidOrder: async (id: number): Promise<ApiResponse<unknown>> => {
    try {
      const res = await api.post<ApiResponse<unknown>>(
        `/staff/orders/${id}/mark-paid`,
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

  packOrder: async (id: number): Promise<ApiResponse<unknown>> => {
    try {
      const res = await api.post<ApiResponse<unknown>>(
        `/staff/orders/${id}/pack`,
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

  shipOrder: async (
    id: number,
    request: ShipStoreOrderRequest,
  ): Promise<ApiResponse<unknown>> => {
    try {
      const res = await api.post<ApiResponse<unknown>>(
        `/staff/orders/${id}/ship`,
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

  deliverOrder: async (id: number): Promise<ApiResponse<unknown>> => {
    try {
      const res = await api.post<ApiResponse<unknown>>(
        `/staff/orders/${id}/deliver`,
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

  cancelOrder: async (
    id: number,
    request: CancelStoreOrderRequest,
  ): Promise<ApiResponse<unknown>> => {
    try {
      const res = await api.post<ApiResponse<unknown>>(
        `/staff/orders/${id}/cancel`,
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
