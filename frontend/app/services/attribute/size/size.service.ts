import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { CreateSizeRequest } from "./dto/create-size/create-size.request";
import type { CreateSizeResponse } from "./dto/create-size/create-size.response";
import type { UpdateSizeRequest } from "./dto/update-size/update-size.request";
import type {
  GetSizeItem,
  GetSizeResponse,
} from "./dto/get-size/get-size.response";
import type { GetSizeRequest } from "./dto/get-size/get-size.request";
import type { SizeStatisticResponse } from "./dto/statistic/size-statistic.response";

export const sizeService = {
  createSize: async (
    createSizeRequest: CreateSizeRequest,
  ): Promise<ApiResponse<CreateSizeResponse | null>> => {
    try {
      const res = await api.post<ApiResponse<CreateSizeResponse | null>>(
        "/sizes",
        createSizeRequest,
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

  updateSize: async (
    updateSizeRequest: UpdateSizeRequest,
    sizeId: number,
  ): Promise<ApiResponse<CreateSizeResponse | null>> => {
    try {
      const res = await api.put<ApiResponse<CreateSizeResponse | null>>(
        `/sizes/${sizeId}`,
        updateSizeRequest,
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

  deleteSize: async (sizeId: number): Promise<ApiResponse<null>> => {
    try {
      const res = await api.delete<ApiResponse<null>>(`/sizes/${sizeId}`);
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

  getAllSizes: async (): Promise<ApiResponse<GetSizeItem[] | null>> => {
    try {
      const res =
        await api.get<ApiResponse<GetSizeItem[] | null>>(`/sizes/all`);
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

  getSizes: async (
    query: GetSizeRequest,
  ): Promise<ApiResponse<GetSizeResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetSizeResponse | null>>(`/sizes`, {
        params: query,
      });
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

  getSizeStatistics: async (): Promise<
    ApiResponse<SizeStatisticResponse | null>
  > => {
    try {
      const res =
        await api.get<ApiResponse<SizeStatisticResponse | null>>(
          `/sizes/statistics`,
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
