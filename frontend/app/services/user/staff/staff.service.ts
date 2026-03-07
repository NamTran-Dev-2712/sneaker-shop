import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { CreateStaffRequest } from "./dto/create-staff/create-staff.request";
import type { CreateStaffResponse } from "./dto/create-staff/create-staff.response";
import type { UpdateStaffRequest } from "./dto/update-staff/update-staff.request";
import type { UpdateStaffResponse } from "./dto/update-staff/update-staff.response";
import type { GetStaffRequest } from "./dto/get-staff/get-staff.request";
import type {
  GetStaffResponse,
  GetStaffDetailResponse,
} from "./dto/get-staff/get-staff.response";

export const staffService = {
  createStaff: async (
    createStaffRequest: CreateStaffRequest,
  ): Promise<ApiResponse<CreateStaffResponse | null>> => {
    try {
      const res = await api.post<ApiResponse<CreateStaffResponse | null>>(
        "/staffs",
        createStaffRequest,
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

  updateStaff: async (
    id: number,
    updateStaffRequest: UpdateStaffRequest,
  ): Promise<ApiResponse<UpdateStaffResponse | null>> => {
    try {
      const res = await api.put<ApiResponse<UpdateStaffResponse | null>>(
        `/staffs/${id}`,
        updateStaffRequest,
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

  deleteStaff: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const res = await api.delete<ApiResponse<null>>(`/staffs/${id}`);
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

  getStaffs: async (
    query: GetStaffRequest,
  ): Promise<ApiResponse<GetStaffResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetStaffResponse | null>>(
        "/staffs",
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

  getStaffDetail: async (
    id: number,
  ): Promise<ApiResponse<GetStaffDetailResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetStaffDetailResponse | null>>(
        `/staffs/${id}`,
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
