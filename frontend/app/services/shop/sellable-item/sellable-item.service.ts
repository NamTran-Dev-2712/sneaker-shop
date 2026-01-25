import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type {
  GetSellableItemRequest,
  GetAllSellableItemRequest,
} from "./dto/get-sellable-item/get-sellable-item.request";
import type {
  GetSellableItemResponse,
  AllSellableItemResult,
} from "./dto/get-sellable-item/get-sellable-item.response";

export const sellableItemService = {
  /**
   * Lấy danh sách sellable items có phân trang và filter
   */
  getSellableItems: async (
    request: GetSellableItemRequest,
  ): Promise<ApiResponse<GetSellableItemResponse | null>> => {
    try {
      const params = new URLSearchParams();

      if (request.pageNumber)
        params.append("pageNumber", request.pageNumber.toString());
      if (request.pageSize)
        params.append("pageSize", request.pageSize.toString());
      if (request.search) params.append("search", request.search);
      if (request.storeId) params.append("storeId", request.storeId.toString());
      if (request.type) params.append("type", request.type);
      if (request.isActive !== undefined)
        params.append("isActive", request.isActive.toString());
      if (request.brandId) params.append("brandId", request.brandId.toString());
      if (request.categoryId)
        params.append("categoryId", request.categoryId.toString());
      if (request.hasInventory !== undefined)
        params.append("hasInventory", request.hasInventory.toString());
      if (request.sortBy) params.append("sortBy", request.sortBy);
      if (request.isSortDescending !== undefined)
        params.append("isSortDescending", request.isSortDescending.toString());

      const res = await api.get<ApiResponse<GetSellableItemResponse>>(
        `/sellable-items?${params.toString()}`,
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

  /**
   * Lấy tất cả sellable items (không phân trang - dùng cho dropdown/select)
   */
  getAllSellableItems: async (
    request?: GetAllSellableItemRequest,
  ): Promise<ApiResponse<AllSellableItemResult[] | null>> => {
    try {
      const params = new URLSearchParams();

      if (request?.type) params.append("type", request.type);
      if (request?.isActive !== undefined)
        params.append("isActive", request.isActive.toString());
      if (request?.brandId)
        params.append("brandId", request.brandId.toString());
      if (request?.search) params.append("search", request.search);

      const res = await api.get<ApiResponse<AllSellableItemResult[]>>(
        `/sellable-items/all?${params.toString()}`,
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
