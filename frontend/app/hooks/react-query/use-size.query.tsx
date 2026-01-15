import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sizeService } from "~/services/attribute/size/size.service";
import type { GetSizeRequest } from "~/services/attribute/size/dto/get-size/get-size.request";
import type { CreateSizeRequest } from "~/services/attribute/size/dto/create-size/create-size.request";
import type { UpdateSizeRequest } from "~/services/attribute/size/dto/update-size/update-size.request";

// ==========================================
// Query Keys
// ==========================================

export const sizeKeys = {
  all: ["sizes"] as const,
  lists: () => [...sizeKeys.all, "list"] as const,
  list: (query: GetSizeRequest) => [...sizeKeys.lists(), query] as const,
};

// ==========================================
// Queries
// ==========================================

/**
 * Hook lấy danh sách size với phân trang và filter
 */
export const useSizeList = (query: GetSizeRequest) => {
  return useQuery({
    queryKey: sizeKeys.list(query),
    queryFn: async () => {
      const response = await sizeService.getSizes(query);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải danh sách size");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    placeholderData: (previousData) => previousData,
  });
};

// ==========================================
// Mutations
// ==========================================

/**
 * Hook tạo size mới
 */
export const useCreateSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSizeRequest) => {
      const response = await sizeService.createSize(data);
      if (!response.success) {
        throw new Error(response.message || "Không thể tạo size");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sizeKeys.lists() });
      toast.success("Tạo size thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi tạo size");
    },
  });
};

/**
 * Hook cập nhật size
 */
export const useUpdateSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Omit<UpdateSizeRequest, "id">;
    }) => {
      const response = await sizeService.updateSize({ ...data, id }, id);
      if (!response.success) {
        throw new Error(response.message || "Không thể cập nhật size");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sizeKeys.lists() });
      toast.success("Cập nhật size thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật size");
    },
  });
};

/**
 * Hook xóa size
 */
export const useDeleteSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await sizeService.deleteSize(id);
      if (!response.success) {
        throw new Error(response.message || "Không thể xóa size");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sizeKeys.lists() });
      toast.success("Xóa size thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi xóa size");
    },
  });
};
