import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { CreateCategoryAccessoryRequest } from "./dto/create-category-accessory/create-category-accessory.request";
import type { CreateCategoryAccessoryResponse } from "./dto/create-category-accessory/create-category-accessory.response";
import type { UpdateCategoryAccessoryRequest } from "./dto/update-category-accessory/update-category-accessory.request";
import type { UpdateCategoryAccessoryResponse } from "./dto/update-category-accessory/update-category-accessory.response";
import type { GetCategoryAccessoryRequest } from "./dto/get-category-accessory/get-category-accessory.request";
import type {
  GetCategoryAccessoryDetailResponse,
  GetCategoryAccessoryItem,
  GetCategoryAccessoryResponse,
} from "./dto/get-category-accessory/get-category-accessory.response";
import type { GetCategoryAccessoryStatisticResponse } from "./dto/statistic/get-category-accessory-statistic.response";

export const categoryService = {
  createCategory: async (
    createCategoryRequest: CreateCategoryAccessoryRequest | FormData,
  ): Promise<ApiResponse<CreateCategoryAccessoryResponse | null>> => {
    try {
      const res = await api.post<
        ApiResponse<CreateCategoryAccessoryResponse | null>
      >("/category-accessory", createCategoryRequest, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

  updateCategory: async (
    id: number,
    updateCategoryRequest: UpdateCategoryAccessoryRequest | FormData,
  ): Promise<ApiResponse<UpdateCategoryAccessoryResponse | null>> => {
    try {
      const res = await api.put<
        ApiResponse<UpdateCategoryAccessoryResponse | null>
      >(`/category-accessory/${id}`, updateCategoryRequest, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

  deleteCategory: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const res = await api.delete<ApiResponse<null>>(
        `/category-accessory/${id}`,
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

  getAllCategory: async (): Promise<
    ApiResponse<GetCategoryAccessoryItem[] | null>
  > => {
    try {
      const res = await api.get<ApiResponse<GetCategoryAccessoryItem[] | null>>(
        "/category-accessory/all",
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

  getCategory: async (
    query: GetCategoryAccessoryRequest,
  ): Promise<ApiResponse<GetCategoryAccessoryResponse | null>> => {
    try {
      const res = await api.get<
        ApiResponse<GetCategoryAccessoryResponse | null>
      >("/category-accessory", {
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

  getDetailCategory: async (
    id: number,
  ): Promise<ApiResponse<GetCategoryAccessoryDetailResponse | null>> => {
    try {
      const res = await api.get<
        ApiResponse<GetCategoryAccessoryDetailResponse | null>
      >(`/category-accessory/${id}`);
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

  getCategoryStatistics: async (): Promise<
    ApiResponse<GetCategoryAccessoryStatisticResponse | null>
  > => {
    try {
      const res = await api.get<
        ApiResponse<GetCategoryAccessoryStatisticResponse | null>
      >(`/category-accessory/statistics`);
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
