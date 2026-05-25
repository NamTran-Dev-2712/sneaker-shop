import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type {
  CreateBrandRequest,
  CreateBrandSeriesRequest,
} from "./dto/create-brand/create-brand.request";
import type {
  CreateBrandResponse,
  CreateBrandSeriesResponse,
} from "./dto/create-brand/create-brand.response";
import type {
  UpdateBrandRequest,
  UpdateBrandSeriesRequest,
} from "./dto/update-brand/update-brand.request";
import type {
  UpdateBrandResponse,
  UpdateBrandSeriesResponse,
} from "./dto/update-brand/update-brand.response";
import type {
  GetBrandItem,
  GetBrandResponse,
  GetBrandResponseDetail,
} from "./dto/get-brand/get-brand.response";
import type { GetBrandRequest } from "./dto/get-brand/get-brand.request";
import type { BrandStatisticResponse } from "./dto/statistic/brand-statistic.response";

export const brandService = {
  createBrand: async (
    createBrandRequest: CreateBrandRequest | FormData,
  ): Promise<ApiResponse<CreateBrandResponse | null>> => {
    try {
      const res = await api.post<ApiResponse<CreateBrandResponse | null>>(
        "/brands",
        createBrandRequest,
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

  createBrandSeries: async (
    createBrandRequest: CreateBrandSeriesRequest,
  ): Promise<ApiResponse<CreateBrandSeriesResponse | null>> => {
    try {
      const res = await api.post<ApiResponse<CreateBrandSeriesResponse | null>>(
        `/brands/${createBrandRequest.brandId}/series`,
        { name: createBrandRequest.name },
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

  updateBrand: async (
    id: number,
    updateBrandRequest: UpdateBrandRequest | FormData,
  ): Promise<ApiResponse<UpdateBrandResponse | null>> => {
    try {
      const res = await api.put<ApiResponse<UpdateBrandResponse | null>>(
        `/brands/${id}`,
        updateBrandRequest,
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

  updatebrandSeries: async (
    brandId: number,
    updateBrandRequest: UpdateBrandSeriesRequest,
  ): Promise<ApiResponse<UpdateBrandSeriesResponse | null>> => {
    try {
      const res = await api.put<ApiResponse<UpdateBrandSeriesResponse | null>>(
        `/brands/${brandId}/series/${updateBrandRequest.id}`,
        updateBrandRequest,
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

  deleteBrand: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const res = await api.delete<ApiResponse<null>>(`/brands/${id}`);
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

  useDeleteBrandSeries: async (
    brandId: number,
    seriesId: number,
  ): Promise<ApiResponse<null>> => {
    try {
      const res = await api.delete<ApiResponse<null>>(
        `/brands/${brandId}/series/${seriesId}`,
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

  getAllBrands: async (): Promise<ApiResponse<GetBrandItem[] | null>> => {
    try {
      const res =
        await api.get<ApiResponse<GetBrandItem[] | null>>("/brands/all");
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

  getBrand: async (
    query: GetBrandRequest,
  ): Promise<ApiResponse<GetBrandResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetBrandResponse | null>>(
        "/brands",
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

  getDetailBrand: async (
    id: number,
  ): Promise<ApiResponse<GetBrandResponseDetail | null>> => {
    try {
      const res = await api.get<ApiResponse<GetBrandResponseDetail | null>>(
        `/brands/${id}`,
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

  getBrandStatistics: async (): Promise<
    ApiResponse<BrandStatisticResponse | null>
  > => {
    try {
      const res =
        await api.get<ApiResponse<BrandStatisticResponse | null>>(
          `/brands/statistics`,
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
