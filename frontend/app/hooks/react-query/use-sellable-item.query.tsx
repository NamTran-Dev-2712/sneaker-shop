import { useQuery } from "@tanstack/react-query";
import { sellableItemService } from "~/services/shop/sellable-item/sellable-item.service";
import type {
  GetSellableItemRequest,
  GetAllSellableItemRequest,
} from "~/services/shop/sellable-item/dto/get-sellable-item/get-sellable-item.request";
import type { ApiResponseError } from "~/types/global/api.response";
import { getErrMessage } from "~/common/helpers/get-err-message.helper";

// Query keys
export const sellableItemKeys = {
  all: ["sellable-items"] as const,
  lists: () => [...sellableItemKeys.all, "list"] as const,
  list: (query: GetSellableItemRequest) =>
    [...sellableItemKeys.lists(), query] as const,
  allList: (query?: GetAllSellableItemRequest) =>
    [...sellableItemKeys.all, "all", query] as const,
};

/**
 * Hook lấy danh sách sellable items có phân trang
 */
export const useSellableItemList = (query: GetSellableItemRequest) => {
  return useQuery({
    queryKey: sellableItemKeys.list(query),
    queryFn: async () => {
      const response = await sellableItemService.getSellableItems(query);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 phút
  });
};

/**
 * Hook lấy tất cả sellable items (không phân trang - dùng cho search/select)
 */
export const useAllSellableItems = (query?: GetAllSellableItemRequest) => {
  return useQuery({
    queryKey: sellableItemKeys.allList(query),
    queryFn: async () => {
      const response = await sellableItemService.getAllSellableItems(query);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 phút
  });
};

/**
 * Hook lấy sellable items với search debounced
 * Dùng cho modal thêm sản phẩm vào vendor
 */
export const useSellableItemSearch = (
  search: string,
  options?: GetAllSellableItemRequest,
) => {
  return useQuery({
    queryKey: sellableItemKeys.allList({ ...options, search }),
    queryFn: async () => {
      const response = await sellableItemService.getAllSellableItems({
        ...options,
        search,
        isActive: true, // Chỉ lấy sản phẩm active
      });
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    enabled: search.length >= 2 || search.length === 0, // Tìm từ 2 ký tự hoặc load tất cả
    staleTime: 1000 * 60 * 5,
  });
};
