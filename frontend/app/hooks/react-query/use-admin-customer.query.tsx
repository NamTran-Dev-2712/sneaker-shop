import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCustomerService } from "~/services/user/customer/admin-customer.service";
import type { GetCustomersRequest } from "~/services/user/customer/dto/get-customers/get-customers.request";
import { showSuccessToast } from "~/components/common/toast/toast.success";
import { showErrorToast } from "~/components/common/toast/toast.error";

export const adminCustomerKeys = {
  all: ["adminCustomers"] as const,
  lists: () => [...adminCustomerKeys.all, "list"] as const,
  list: (query: GetCustomersRequest) =>
    [...adminCustomerKeys.lists(), query] as const,
  details: () => [...adminCustomerKeys.all, "detail"] as const,
  detail: (id: number) => [...adminCustomerKeys.details(), id] as const,
};

export const useAdminCustomerList = (query: GetCustomersRequest) => {
  return useQuery({
    queryKey: adminCustomerKeys.list(query),
    queryFn: async () => {
      const response = await adminCustomerService.getCustomers(query);
      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Không thể tải danh sách khách hàng",
        );
      }
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
};

export const useAdminCustomerDetail = (id: number | null) => {
  return useQuery({
    queryKey: adminCustomerKeys.detail(id!),
    queryFn: async () => {
      const response = await adminCustomerService.getCustomerDetail(id!);
      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Không thể tải thông tin khách hàng",
        );
      }
      return response.data;
    },
    enabled: id !== null && id > 0,
    staleTime: 2 * 60 * 1000,
  });
};

export const useToggleCustomerActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminCustomerService.toggleCustomerActive(id),
    onSuccess: (response, id) => {
      if (response.success && response.data) {
        showSuccessToast(response.data.message);
        queryClient.invalidateQueries({ queryKey: adminCustomerKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: adminCustomerKeys.detail(id),
        });
      } else {
        showErrorToast(response.message ?? "Thao tác thất bại.");
      }
    },
    onError: () => {
      showErrorToast("Không thể thay đổi trạng thái tài khoản.");
    },
  });
};
