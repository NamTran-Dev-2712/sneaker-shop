import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { CreateSneakerRequest } from "./dto/create-sneaker/create-sneaker.request";
import type { CreateSneakerResponse } from "./dto/create-sneaker/create-sneaker.response";
import type { UpdateSneakerResponse } from "./dto/update-sneaker/update-sneaker.response";
import type { UpdateSneakerRequest } from "./dto/update-sneaker/update-sneaker.request";
import type {
  GetSneakerDetailResponse,
  GetSneakerResponse,
} from "./dto/get-sneaker/get-sneaker.response";
import type { GetSneakerRequest } from "./dto/get-sneaker/get-sneaker.request";

export const sneakerService = {
  createSneaker: async (
    createSneakerRequest: CreateSneakerRequest | FormData,
  ): Promise<ApiResponse<CreateSneakerResponse | null>> => {
    try {
      const res = await api.post<ApiResponse<CreateSneakerResponse | null>>(
        "/sneakers",
        createSneakerRequest,
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

  updateSneaker: async (
    id: number,
    updateSneakerRequest: UpdateSneakerRequest | FormData,
  ): Promise<ApiResponse<UpdateSneakerResponse | null>> => {
    try {
      const res = await api.put<ApiResponse<UpdateSneakerResponse | null>>(
        `/sneakers/${id}`,
        updateSneakerRequest,
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

  deleteSneaker: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const res = await api.delete<ApiResponse<null>>(`/sneakers/${id}`);
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

  getSneaker: async (
    query: GetSneakerRequest,
  ): Promise<ApiResponse<GetSneakerResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetSneakerResponse | null>>(
        "/sneakers",
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

  getDetailSneaker: async (
    id: number,
  ): Promise<ApiResponse<GetSneakerDetailResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetSneakerDetailResponse | null>>(
        `/sneakers/${id}`,
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
