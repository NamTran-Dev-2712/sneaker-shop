import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { GetCustomersRequest } from "./dto/get-customers/get-customers.request";
import type { GetCustomersResponse } from "./dto/get-customers/get-customers.response";
import type { CustomerDetailResponse } from "./dto/get-customer-detail/get-customer-detail.response";
import type { ToggleCustomerActiveResponse } from "./dto/toggle-customer-active/toggle-customer-active.response";

export const adminCustomerService = {
  getCustomers: async (
    params: GetCustomersRequest,
  ): Promise<ApiResponse<GetCustomersResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetCustomersResponse | null>>(
        "/admin/customers",
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

  getCustomerDetail: async (
    id: number,
  ): Promise<ApiResponse<CustomerDetailResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<CustomerDetailResponse | null>>(
        `/admin/customers/${id}`,
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

  toggleCustomerActive: async (
    id: number,
  ): Promise<ApiResponse<ToggleCustomerActiveResponse | null>> => {
    try {
      const res = await api.patch<
        ApiResponse<ToggleCustomerActiveResponse | null>
      >(`/admin/customers/${id}/toggle-active`);
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
