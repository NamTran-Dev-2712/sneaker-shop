import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { CreateVendorRequest } from "./dto/create-vendor/create-vendor.request";
import type { UpdateVendorRequest } from "./dto/update-vendor/update-vendor.request";
import type { UpdateVendorResponse } from "./dto/update-vendor/update-vendor.response";
import type { AddSellableItemRequest } from "./dto/add-sellable/add-sellable.request";
import type { AddSellableItemResponse } from "./dto/add-sellable/add-sellable.response";
import type { UpdateSellableItemRequest } from "./dto/update-sellable/update-sellable.request";
import type { UpdateSellableItemResponse } from "./dto/update-sellable/update-sellable.response";
import type {
  GetVendorRequest,
  GetVendorSellableItemsRequest,
} from "./dto/get-vendor/get-vendor.request";
import type {
  GetAllVendorResponse,
  GetAllVendorsResponse,
  GetVendorDetailResponse,
  GetVendorResponse,
  GetVendorSellableItemsResponse,
} from "./dto/get-vendor/get-vendor.response";
import type { GetVendorStatisticResponse } from "./dto/statistic/get-vendor-statistic.response";

export const vendorService = {
  createVendor: async (
    vendorRequest: CreateVendorRequest,
  ): Promise<ApiResponse<number | null>> => {
    try {
      const res = await api.post<ApiResponse<number | null>>(
        "/vendors",
        vendorRequest,
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

  updateVendor: async (
    vendorRequest: UpdateVendorRequest,
  ): Promise<ApiResponse<UpdateVendorResponse | null>> => {
    try {
      const res = await api.put<ApiResponse<UpdateVendorResponse | null>>(
        `/vendors/${vendorRequest.id}`,
        vendorRequest,
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

  deleteVendor: async (
    vendorId: number,
  ): Promise<ApiResponse<boolean | null>> => {
    try {
      const res = await api.delete<ApiResponse<boolean | null>>(
        `/vendors/${vendorId}`,
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

  addSellable: async (
    vendorId: number,
    sellableRequest: AddSellableItemRequest,
  ): Promise<ApiResponse<AddSellableItemResponse | null>> => {
    try {
      const res = await api.post<ApiResponse<AddSellableItemResponse | null>>(
        `/vendors/${vendorId}/sellable-items`,
        sellableRequest,
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

  updateSellable: async (
    vendorId: number,
    vendorPriceId: number,
    sellableRequest: UpdateSellableItemRequest,
  ): Promise<ApiResponse<UpdateSellableItemResponse | null>> => {
    try {
      const res = await api.put<ApiResponse<UpdateSellableItemResponse | null>>(
        `/vendors/${vendorId}/sellable-items/${vendorPriceId}`,
        sellableRequest,
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

  removeSellable: async (
    vendorId: number,
    vendorPriceId: number,
  ): Promise<ApiResponse<boolean | null>> => {
    try {
      const res = await api.delete<ApiResponse<boolean | null>>(
        `/vendors/${vendorId}/sellable-items/${vendorPriceId}`,
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

  getVendor: async (
    request: GetVendorRequest,
  ): Promise<ApiResponse<GetVendorResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetVendorResponse | null>>(
        `/vendors`,
        { params: request },
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

  getAllVendors: async (): Promise<
    ApiResponse<GetAllVendorsResponse | null>
  > => {
    try {
      const res =
        await api.get<ApiResponse<GetAllVendorsResponse | null>>(
          `/vendors/all`,
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

  getDetailVendor: async (
    vendorId: number,
  ): Promise<ApiResponse<GetVendorDetailResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetVendorDetailResponse | null>>(
        `/vendors/${vendorId}`,
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

  getStatisticVendor: async (): Promise<
    ApiResponse<GetVendorStatisticResponse | null>
  > => {
    try {
      const res =
        await api.get<ApiResponse<GetVendorStatisticResponse | null>>(
          `/vendors/statistics`,
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

  getVendorSellableItems: async (
    vendorId: number,
    request: Omit<GetVendorSellableItemsRequest, "vendorId">,
  ): Promise<ApiResponse<GetVendorSellableItemsResponse | null>> => {
    try {
      const res = await api.get<
        ApiResponse<GetVendorSellableItemsResponse | null>
      >(`/vendors/${vendorId}/sellable-items`, { params: request });
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
