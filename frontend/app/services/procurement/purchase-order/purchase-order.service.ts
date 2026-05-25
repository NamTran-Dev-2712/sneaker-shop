import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { CreatePurchaseOrderRequest } from "./dto/create-purchase-order/create-purchase-order.request";
import type { UpdatePurchaseOrderRequest } from "./dto/update-purchase-order/update-purchase-order.request";
import type { UpdatePurchaseOrderResponse } from "./dto/update-purchase-order/update-purchase-order.response";
import type { UpdateStatusPurchaseOrderRequest } from "./dto/update-status-purchase-order/update-status-purchase-order.request";
import type { UpdateStatusPurchaseOrderResponse } from "./dto/update-status-purchase-order/update-status-purchase-order.response";
import type { GetPurchaseOrderRequest } from "./dto/get-purchase-order/get-purchase-order.request";
import type {
  GetPurchaseOrderDetailResponse,
  GetPurchaseOrderResponse,
} from "./dto/get-purchase-order/get-purchase-order.response";
import type { GetPurchaseOrderStatisticResponse } from "./dto/statistic/get-purchase-order-statistic.response";
import type { PurchaseStatus } from "~/types/entities/purchase-order.type";

// Response type for create purchase order
export interface CreatePurchaseOrderResponse {
  id: number;
  vendorId: number;
  vendorName: string;
  storeId: number;
  storeName: string;
  status: PurchaseStatus;
  expectedAt: string | null;
  note: string | null;
  totalCost: number;
  itemCount: number;
  createdAt: string;
}

export const purchaseOrderService = {
  createPurchaseOrder: async (
    purchaseOrderRequest: CreatePurchaseOrderRequest,
  ): Promise<ApiResponse<CreatePurchaseOrderResponse | null>> => {
    try {
      const res = await api.post<
        ApiResponse<CreatePurchaseOrderResponse | null>
      >("/purchase-orders", purchaseOrderRequest);
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

  updatePurchaseOrder: async (
    purchaseOrderRequest: UpdatePurchaseOrderRequest,
  ): Promise<ApiResponse<UpdatePurchaseOrderResponse | null>> => {
    try {
      const res = await api.put<
        ApiResponse<UpdatePurchaseOrderResponse | null>
      >(`/purchase-orders/${purchaseOrderRequest.id}`, purchaseOrderRequest);
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

  deletePurchaseOrder: async (
    purchaseOrderId: number,
  ): Promise<ApiResponse<boolean | null>> => {
    try {
      const res = await api.delete<ApiResponse<boolean | null>>(
        `/purchase-orders/${purchaseOrderId}`,
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

  updatePurchaseOrderStatus: async (
    purchaseOrderRequest: UpdateStatusPurchaseOrderRequest,
    purchaseOrderId: number,
  ): Promise<ApiResponse<UpdateStatusPurchaseOrderResponse | null>> => {
    try {
      const res = await api.patch<
        ApiResponse<UpdateStatusPurchaseOrderResponse | null>
      >(`/purchase-orders/${purchaseOrderId}/status`, purchaseOrderRequest);
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

  getPurchaseOrder: async (
    requset: GetPurchaseOrderRequest,
  ): Promise<ApiResponse<GetPurchaseOrderResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetPurchaseOrderResponse | null>>(
        `/purchase-orders`,
        {
          params: requset,
        },
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

  getPurchaseOrderDetail: async (
    purchaseOrderId: number,
  ): Promise<ApiResponse<GetPurchaseOrderDetailResponse | null>> => {
    try {
      const res = await api.get<
        ApiResponse<GetPurchaseOrderDetailResponse | null>
      >(`/purchase-orders/${purchaseOrderId}`);
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

  getPurchaseOrderStatistics: async (): Promise<
    ApiResponse<GetPurchaseOrderStatisticResponse | null>
  > => {
    try {
      const res = await api.get<
        ApiResponse<GetPurchaseOrderStatisticResponse | null>
      >(`/purchase-orders/statistics`);
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
