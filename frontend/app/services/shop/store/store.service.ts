import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { CreateStoreRequest } from "./dto/create-store/create-store.request";
import type { CreateStoreResponse } from "./dto/create-store/create-store.response";
import type { UpdateStoreRequest } from "./dto/update-store/update-store.request";
import type { UpdateStoreResponse } from "./dto/update-store/update-store.response";
import type { GetStoreRequest } from "./dto/get-store/get-store.request";
import type {
  GetStoreResponse,
  GetStoreResponseDetail,
} from "./dto/get-store/get-store.response";
import { id } from "zod/v4/locales";

export const storeService = {
  createStore: async (
    createStoreRequest: CreateStoreRequest,
  ): Promise<ApiResponse<CreateStoreResponse | null>> => {
    try {
      const res = await api.post<ApiResponse<CreateStoreResponse | null>>(
        "/stores",
        createStoreRequest,
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

  updateStore: async (
    id: number,
    updateStoreRequest: UpdateStoreRequest,
  ): Promise<ApiResponse<UpdateStoreResponse | null>> => {
    try {
      const res = await api.put<ApiResponse<UpdateStoreResponse | null>>(
        `/stores/${id}`,
        updateStoreRequest,
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

  deleteStore: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const res = await api.delete<ApiResponse<null>>(`/stores/${id}`);
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

  getStore: async (
    query: GetStoreRequest,
  ): Promise<ApiResponse<GetStoreResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetStoreResponse | null>>(
        "/stores",
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

  getDetailStore: async (
    id: number,
  ): Promise<ApiResponse<GetStoreResponseDetail | null>> => {
    try {
      const res = await api.get<ApiResponse<GetStoreResponseDetail | null>>(
        `/stores/${id}`,
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
