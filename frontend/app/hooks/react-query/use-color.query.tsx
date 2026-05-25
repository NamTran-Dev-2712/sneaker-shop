import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { colorService } from "~/services/attribute/color/color.service";
import type { GetColorRequest } from "~/services/attribute/color/dto/get-color/get-color.request";
import type { CreateColorRequest } from "~/services/attribute/color/dto/create-color/create-color.request";
import type { UpdateColorRequest } from "~/services/attribute/color/dto/update-color/update-color.request";

// ==========================================
// Query Keys
// ==========================================

export const colorKeys = {
  all: ["colors"] as const,
  lists: () => [...colorKeys.all, "list"] as const,
  list: (query: GetColorRequest) => [...colorKeys.lists(), query] as const,
  statistics: () => [...colorKeys.all, "statistics"] as const,
};

// ==========================================
// Queries
// ==========================================

/**
 * Hook lấy danh sách màu với phân trang và filter
 */
export const useColorList = (query: GetColorRequest) => {
  return useQuery({
    queryKey: colorKeys.list(query),
    queryFn: async () => {
      const response = await colorService.getColors(query);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải danh sách màu");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook lấy tất cả màu không phân trang (dùng cho select trong form)
 */
export const useAllColors = () => {
  return useQuery({
    queryKey: colorKeys.all,
    queryFn: async () => {
      const response = await colorService.getAllColors();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải danh sách màu");
      }
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 phút - dữ liệu ít thay đổi
  });
};

/**
 * Hook lấy thống kê màu
 */
export const useColorStatistics = () => {
  return useQuery({
    queryKey: colorKeys.statistics(),
    queryFn: async () => {
      const response = await colorService.getColorStatistics();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải thống kê màu");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// ==========================================
// Mutations
// ==========================================

/**
 * Hook tạo màu mới
 */
export const useCreateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateColorRequest) => {
      const response = await colorService.createColor(data);
      if (!response.success) {
        throw new Error(response.message || "Không thể tạo màu");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: colorKeys.lists() });
      toast.success("Tạo màu thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi tạo màu");
    },
  });
};

/**
 * Hook cập nhật màu
 */
export const useUpdateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Omit<UpdateColorRequest, "id">;
    }) => {
      const response = await colorService.updateColor({ ...data, id }, id);
      if (!response.success) {
        throw new Error(response.message || "Không thể cập nhật màu");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: colorKeys.lists() });
      toast.success("Cập nhật màu thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật màu");
    },
  });
};

/**
 * Hook xóa màu
 */
export const useDeleteColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await colorService.deleteColor(id);
      if (!response.success) {
        throw new Error(response.message || "Không thể xóa màu");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: colorKeys.lists() });
      toast.success("Xóa màu thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi xóa màu");
    },
  });
};
