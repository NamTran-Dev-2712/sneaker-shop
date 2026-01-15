import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { CreateColorRequest } from "./dto/create-color/create-color.request";
import type { CreateColorResponse } from "./dto/create-color/create-color.response";
import type { UpdateColorRequest } from "./dto/update-color/update-color.request";
import type { GetColorRequest } from "./dto/get-color/get-color.request";
import type { GetColorResponse } from "./dto/get-color/get-color.response";

export const colorService = {
  createColor: async (
    createColorRequest: CreateColorRequest,
  ): Promise<ApiResponse<CreateColorResponse | null>> => {
    try {
      const res = await api.post<ApiResponse<CreateColorResponse | null>>(
        "/colors",
        createColorRequest,
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

  updateColor: async (
    updateColorRequest: UpdateColorRequest,
    colorId: number,
  ): Promise<ApiResponse<CreateColorResponse | null>> => {
    try {
      const res = await api.put<ApiResponse<CreateColorResponse | null>>(
        `/colors/${colorId}`,
        updateColorRequest,
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

  deleteColor: async (colorId: number): Promise<ApiResponse<null>> => {
    try {
      const res = await api.delete<ApiResponse<null>>(`/colors/${colorId}`);
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

  getColors: async (
    query: GetColorRequest,
  ): Promise<ApiResponse<GetColorResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetColorResponse | null>>(
        `/colors`,
        { params: query },
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
