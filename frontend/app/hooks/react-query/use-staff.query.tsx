import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffService } from "~/services/user/staff/staff.service";
import { authSerivce } from "~/services/auth/auth.service";
import type { GetStaffRequest } from "~/services/user/staff/dto/get-staff/get-staff.request";
import type { CreateStaffRequest } from "~/services/user/staff/dto/create-staff/create-staff.request";
import type { UpdateStaffRequest } from "~/services/user/staff/dto/update-staff/update-staff.request";
import type { ChangePasswordRequest } from "~/services/auth/dto/change-password/change-password.request";
import type { ApiResponseError } from "~/types/global/api.response";
import { getErrMessage } from "~/common/helpers/get-err-message.helper";
import { showSuccessToast } from "~/components/common/toast/toast.success";
import { showErrorToast } from "~/components/common/toast/toast.error";

export const staffKeys = {
  all: ["staffs"] as const,
  lists: () => [...staffKeys.all, "list"] as const,
  list: (query: GetStaffRequest) => [...staffKeys.lists(), query] as const,
  details: () => [...staffKeys.all, "detail"] as const,
  detail: (id: number) => [...staffKeys.details(), id] as const,
};

export const useStaffList = (query: GetStaffRequest) => {
  return useQuery({
    queryKey: staffKeys.list(query),
    queryFn: async () => {
      const response = await staffService.getStaffs(query);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useStaffDetail = (id: number | null) => {
  return useQuery({
    queryKey: staffKeys.detail(id!),
    queryFn: async () => {
      const response = await staffService.getStaffDetail(id!);
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

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateStaffRequest) => {
      const response = await staffService.createStaff(data);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      showSuccessToast(
        "Tạo nhân viên mới thành công! Mật khẩu đã được gửi qua email.",
      );
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateStaffRequest;
    }) => {
      const response = await staffService.updateStaff(id, data);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: staffKeys.detail(variables.id),
      });
      showSuccessToast("Cập nhật nhân viên thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await staffService.deleteStaff(id);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      showSuccessToast("Vô hiệu hóa nhân viên thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await authSerivce.changePassword(data);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      showSuccessToast("Đổi mật khẩu thành công!");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};
