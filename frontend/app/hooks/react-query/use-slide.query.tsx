import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { slideService } from "~/services/attribute/slide/slide.service";
import type { GetSlideRequest } from "~/services/attribute/slide/dto/get-slide/get-slide.request";
import type { CreateSlideRequest } from "~/services/attribute/slide/dto/create-slide/create-slide.request";
import type { UpdateSlideRequest } from "~/services/attribute/slide/dto/update-slide/update-slide.request";

// ==========================================
// Query Keys
// ==========================================

export const slideKeys = {
  all: ["slides"] as const,
  lists: () => [...slideKeys.all, "list"] as const,
  list: (query: GetSlideRequest) => [...slideKeys.lists(), query] as const,
};

// ==========================================
// Queries
// ==========================================

/**
 * Hook lấy danh sách slide với phân trang và filter
 */
export const useSlideList = (query: GetSlideRequest) => {
  return useQuery({
    queryKey: slideKeys.list(query),
    queryFn: async () => {
      const response = await slideService.getSlides(query);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải danh sách slide");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook lấy tất cả slide không phân trang (dùng cho hero banner)
 */
export const useAllSlides = () => {
  return useQuery({
    queryKey: slideKeys.all,
    queryFn: async () => {
      const response = await slideService.getAllSlides();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải danh sách slide");
      }
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 phút - dữ liệu ít thay đổi
  });
};

// ==========================================
// Mutations
// ==========================================

/**
 * Hook tạo slide mới
 */
export const useCreateSlide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSlideRequest) => {
      const response = await slideService.createSlide(data);
      if (!response.success) {
        throw new Error(response.message || "Không thể tạo slide");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: slideKeys.lists() });
      queryClient.invalidateQueries({ queryKey: slideKeys.all });
      toast.success("Tạo slide thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi tạo slide");
    },
  });
};

/**
 * Hook cập nhật slide
 */
export const useUpdateSlide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Omit<UpdateSlideRequest, "id">;
    }) => {
      const response = await slideService.updateSlide({ ...data, id }, id);
      if (!response.success) {
        throw new Error(response.message || "Không thể cập nhật slide");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: slideKeys.lists() });
      queryClient.invalidateQueries({ queryKey: slideKeys.all });
      toast.success("Cập nhật slide thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật slide");
    },
  });
};

/**
 * Hook xóa slide
 */
export const useDeleteSlide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await slideService.deleteSlide(id);
      if (!response.success) {
        throw new Error(response.message || "Không thể xóa slide");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: slideKeys.lists() });
      queryClient.invalidateQueries({ queryKey: slideKeys.all });
      toast.success("Xóa slide thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi xóa slide");
    },
  });
};
