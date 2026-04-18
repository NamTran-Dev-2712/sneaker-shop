import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { GetVoucherRequest } from "./dto/get-voucher/get-voucher.request";
import type {
  GetVoucherDetailResponse,
  GetVoucherResponse,
} from "./dto/get-voucher/get-voucher.response";
import type { CreateVoucherRequest } from "./dto/create-voucher/create-voucher.request";
import type { CreateVoucherResponse } from "./dto/create-voucher/create-voucher.response";
import type { UpdateVoucherRequest } from "./dto/update-voucher/update-voucher.request";
import type { UpdateVoucherResponse } from "./dto/update-voucher/update-voucher.response";
import type { ToggleVoucherActiveResponse } from "./dto/toggle-voucher/toggle-voucher.response";
import type { DeleteVoucherResponse } from "./dto/delete-voucher/delete-voucher.response";
import type { MyAvailableVoucherItem } from "./dto/get-my-available-vouchers/get-my-available-vouchers.response";
import type { GetMyRedeemedVouchersRequest } from "./dto/get-my-redeemed-vouchers/get-my-redeemed-vouchers.request";
import type { GetMyRedeemedVouchersResponse } from "./dto/get-my-redeemed-vouchers/get-my-redeemed-vouchers.response";

export const voucherService = {
  getVouchers: async (
    params: GetVoucherRequest,
  ): Promise<ApiResponse<GetVoucherResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetVoucherResponse | null>>(
        "/vouchers",
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

  getVoucherDetail: async (
    id: number,
  ): Promise<ApiResponse<GetVoucherDetailResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetVoucherDetailResponse | null>>(
        `/vouchers/${id}`,
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

  createVoucher: async (
    request: CreateVoucherRequest,
  ): Promise<ApiResponse<CreateVoucherResponse | null>> => {
    try {
      const res = await api.post<ApiResponse<CreateVoucherResponse | null>>(
        "/vouchers",
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

  updateVoucher: async (
    request: UpdateVoucherRequest,
  ): Promise<ApiResponse<UpdateVoucherResponse | null>> => {
    try {
      const res = await api.put<ApiResponse<UpdateVoucherResponse | null>>(
        `/vouchers/${request.id}`,
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

  toggleVoucherActive: async (
    id: number,
  ): Promise<ApiResponse<ToggleVoucherActiveResponse | null>> => {
    try {
      const res = await api.patch<
        ApiResponse<ToggleVoucherActiveResponse | null>
      >(`/vouchers/${id}/toggle-active`);
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

  deleteVoucher: async (
    id: number,
  ): Promise<ApiResponse<DeleteVoucherResponse | null>> => {
    try {
      const res = await api.delete<ApiResponse<DeleteVoucherResponse | null>>(
        `/vouchers/${id}`,
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

  getMyAvailableVouchers: async (): Promise<
    ApiResponse<MyAvailableVoucherItem[] | null>
  > => {
    try {
      const res = await api.get<ApiResponse<MyAvailableVoucherItem[] | null>>(
        "/vouchers/me/available",
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

  getMyRedeemedVouchers: async (
    params: GetMyRedeemedVouchersRequest,
  ): Promise<ApiResponse<GetMyRedeemedVouchersResponse | null>> => {
    try {
      const res = await api.get<
        ApiResponse<GetMyRedeemedVouchersResponse | null>
      >("/vouchers/me/redeemed", { params });
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
