import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sneakerService } from "~/services/shop/sneaker/sneaker.service";
import type { GetSneakerRequest } from "~/services/shop/sneaker/dto/get-sneaker/get-sneaker.request";

// ==========================================
// Query Keys
// ==========================================

export const sneakerKeys = {
  all: ["sneakers"] as const,
  lists: () => [...sneakerKeys.all, "list"] as const,
  list: (query: GetSneakerRequest) => [...sneakerKeys.lists(), query] as const,
  details: () => [...sneakerKeys.all, "detail"] as const,
  detail: (id: number) => [...sneakerKeys.details(), id] as const,
};

// ==========================================
// Queries
// ==========================================

/**
 * Hook lấy danh sách sneaker với phân trang và filter
 */
export const useSneakerList = (query: GetSneakerRequest) => {
  return useQuery({
    queryKey: sneakerKeys.list(query),
    queryFn: async () => {
      const response = await sneakerService.getSneaker(query);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải danh sách sản phẩm");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook lấy chi tiết sneaker
 */
export const useSneakerDetail = (id: number) => {
  return useQuery({
    queryKey: sneakerKeys.detail(id),
    queryFn: async () => {
      const response = await sneakerService.getDetailSneaker(id);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải thông tin sản phẩm");
      }
      return response.data;
    },
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// ==========================================
// Mutations
// ==========================================

/**
 * Hook tạo sneaker mới
 */
export const useCreateSneaker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await sneakerService.createSneaker(formData);
      if (!response.success) {
        throw new Error(response.message || "Không thể tạo sản phẩm");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sneakerKeys.lists() });
      toast.success("Tạo sản phẩm thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi tạo sản phẩm");
    },
  });
};

/**
 * Hook cập nhật sneaker
 */
export const useUpdateSneaker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: number;
      formData: FormData;
    }) => {
      const response = await sneakerService.updateSneaker(id, formData);
      if (!response.success) {
        throw new Error(response.message || "Không thể cập nhật sản phẩm");
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sneakerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: sneakerKeys.detail(variables.id),
      });
      toast.success("Cập nhật sản phẩm thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật sản phẩm");
    },
  });
};

/**
 * Hook xóa sneaker
 */
export const useDeleteSneaker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await sneakerService.deleteSneaker(id);
      if (!response.success) {
        throw new Error(response.message || "Không thể xóa sản phẩm");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sneakerKeys.lists() });
      toast.success("Xóa sản phẩm thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi xóa sản phẩm");
    },
  });
};
