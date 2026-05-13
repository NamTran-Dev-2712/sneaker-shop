import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { voucherService } from "~/services/finance/voucher/voucher.service";
import type { GetVoucherRequest } from "~/services/finance/voucher/dto/get-voucher/get-voucher.request";
import type { CreateVoucherRequest } from "~/services/finance/voucher/dto/create-voucher/create-voucher.request";
import type { UpdateVoucherRequest } from "~/services/finance/voucher/dto/update-voucher/update-voucher.request";
import type { ApiResponseError } from "~/types/global/api.response";
import { getErrMessage } from "~/common/helpers/get-err-message.helper";
import { showSuccessToast } from "~/components/common/toast/toast.success";
import { showErrorToast } from "~/components/common/toast/toast.error";

// Query keys
export const voucherKeys = {
  all: ["vouchers"] as const,
  lists: () => [...voucherKeys.all, "list"] as const,
  list: (query: GetVoucherRequest) => [...voucherKeys.lists(), query] as const,
  details: () => [...voucherKeys.all, "detail"] as const,
  detail: (id: number) => [...voucherKeys.details(), id] as const,
};

// Hook lấy danh sách vouchers có phân trang
export const useVoucherList = (query: GetVoucherRequest) => {
  return useQuery({
    queryKey: voucherKeys.list(query),
    queryFn: async () => {
      const response = await voucherService.getVouchers(query);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 phút
  });
};

// Hook lấy chi tiết voucher
export const useVoucherDetail = (id: number | null) => {
  return useQuery({
    queryKey: voucherKeys.detail(id!),
    queryFn: async () => {
      const response = await voucherService.getVoucherDetail(id!);
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

// Hook tạo voucher mới
export const useCreateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVoucherRequest) => {
      const response = await voucherService.createVoucher(data);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voucherKeys.lists() });
      showSuccessToast("Tạo voucher mới thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// Hook cập nhật voucher
export const useUpdateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateVoucherRequest) => {
      const response = await voucherService.updateVoucher(data);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: voucherKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: voucherKeys.detail(variables.id),
      });
      showSuccessToast("Cập nhật voucher thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// Hook bật/tắt trạng thái voucher
export const useToggleVoucherActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await voucherService.toggleVoucherActive(id);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: voucherKeys.lists() });
      if (data) {
        queryClient.invalidateQueries({
          queryKey: voucherKeys.detail(data.id),
        });
      }
      showSuccessToast("Cập nhật trạng thái voucher thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

// Hook xóa voucher
export const useDeleteVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await voucherService.deleteVoucher(id);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voucherKeys.lists() });
      showSuccessToast("Xóa voucher thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};
