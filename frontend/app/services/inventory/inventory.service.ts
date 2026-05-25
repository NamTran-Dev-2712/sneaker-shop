import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { GetInventoryRequest } from "./dto/get-inventory/get-inventory.request";
import type {
  GetInventoryDetailResponse,
  GetInventoryResponse,
} from "./dto/get-inventory/get-inventory.response";
import type { GetInventoryStatisticResponse } from "./dto/statistic/get-inventory-statistic.response";

export const inventoryService = {
  getInventory: async (
    request: GetInventoryRequest,
  ): Promise<ApiResponse<GetInventoryResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetInventoryResponse | null>>(
        `/inventory`,
        {
          params: request,
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

  getInventoryDetail: async (
    inventoryId: number,
  ): Promise<ApiResponse<GetInventoryDetailResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetInventoryDetailResponse | null>>(
        `/inventory/${inventoryId}`,
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

  getInventoryStatistics: async (): Promise<
    ApiResponse<GetInventoryStatisticResponse | null>
  > => {
    try {
      const res = await api.get<
        ApiResponse<GetInventoryStatisticResponse | null>
      >(`/inventory/statistics`);
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
