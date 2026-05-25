import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "~/services/inventory/inventory.service";
import type { GetInventoryRequest } from "~/services/inventory/dto/get-inventory/get-inventory.request";
import type { ApiResponseError } from "~/types/global/api.response";
import { getErrMessage } from "~/common/helpers/get-err-message.helper";

// Query keys
export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: (query: GetInventoryRequest) =>
    [...inventoryKeys.lists(), query] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (id: number) => [...inventoryKeys.details(), id] as const,
  statistics: () => [...inventoryKeys.all, "statistics"] as const,
};

// Hook lấy danh sách inventory có phân trang
export const useInventoryList = (query: GetInventoryRequest) => {
  return useQuery({
    queryKey: inventoryKeys.list(query),
    queryFn: async () => {
      const response = await inventoryService.getInventory(query);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 phút
  });
};

// Hook lấy chi tiết inventory
export const useInventoryDetail = (id: number | null) => {
  return useQuery({
    queryKey: inventoryKeys.detail(id!),
    queryFn: async () => {
      const response = await inventoryService.getInventoryDetail(id!);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    enabled: id !== null && id > 0,
    staleTime: 1000 * 60 * 5,
  });
};

// Hook lấy thống kê inventory
export const useInventoryStatistics = () => {
  return useQuery({
    queryKey: inventoryKeys.statistics(),
    queryFn: async () => {
      const response = await inventoryService.getInventoryStatistics();
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 phút
  });
};
