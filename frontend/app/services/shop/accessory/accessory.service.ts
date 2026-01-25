import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { CreateAccessoryRequest } from "./dto/create-accessory/create-accessory.request";
import type { CreateAccessoryResponse } from "./dto/create-accessory/create-accessory.response";
import type { UpdateAccessoryRequest } from "./dto/update-accessory/update-accessory.request";
import type { UpdateAccessoryResponse } from "./dto/update-accessory/update-accessory.response";
import type { GetAccessoryRequest } from "./dto/get-accessory/get-accessory.request";
import type {
  GetAccessoryDetailResponse,
  GetAccessoryResponse,
} from "./dto/get-accessory/get-accessory.response";
import type { GetAccessoryStatisticResponse } from "./dto/statistic/get-accessory-statistic.response";

export const accessoryService = {
  createAccessory: async (
    createAccessoryRequest: CreateAccessoryRequest | FormData,
  ): Promise<ApiResponse<CreateAccessoryResponse | null>> => {
    try {
      const res = await api.post<ApiResponse<CreateAccessoryResponse | null>>(
        "/accessory",
        createAccessoryRequest,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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

  updateAccessory: async (
    id: number,
    updateAccessoryRequest: UpdateAccessoryRequest | FormData,
  ): Promise<ApiResponse<UpdateAccessoryResponse | null>> => {
    try {
      const res = await api.put<ApiResponse<UpdateAccessoryResponse | null>>(
        `/accessory/${id}`,
        updateAccessoryRequest,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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

  deleteAccessory: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const res = await api.delete<ApiResponse<null>>(`/accessory/${id}`);
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

  getAccessory: async (
    query: GetAccessoryRequest,
  ): Promise<ApiResponse<GetAccessoryResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetAccessoryResponse | null>>(
        "/accessory",
        {
          params: query,
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

  getDetailAccessory: async (
    id: number,
  ): Promise<ApiResponse<GetAccessoryDetailResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetAccessoryDetailResponse | null>>(
        `/accessory/${id}`,
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

  getAccessoryStatistics: async (): Promise<
    ApiResponse<GetAccessoryStatisticResponse | null>
  > => {
    try {
      const res = await api.get<
        ApiResponse<GetAccessoryStatisticResponse | null>
      >(`/accessory/statistics`);
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
