import { useQuery } from "@tanstack/react-query";
import { voucherService } from "~/services/finance/voucher/voucher.service";
import type { GetMyRedeemedVouchersRequest } from "~/services/finance/voucher/dto/get-my-redeemed-vouchers/get-my-redeemed-vouchers.request";

export const customerVoucherKeys = {
  all: ["customerVouchers"] as const,
  available: () => [...customerVoucherKeys.all, "available"] as const,
  redeemed: (params: GetMyRedeemedVouchersRequest) =>
    [...customerVoucherKeys.all, "redeemed", params] as const,
};

export const useMyAvailableVouchers = () => {
  return useQuery({
    queryKey: customerVoucherKeys.available(),
    queryFn: async () => {
      const response = await voucherService.getMyAvailableVouchers();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải danh sách voucher");
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useMyRedeemedVouchers = (params: GetMyRedeemedVouchersRequest) => {
  return useQuery({
    queryKey: customerVoucherKeys.redeemed(params),
    queryFn: async () => {
      const response = await voucherService.getMyRedeemedVouchers(params);
      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Không thể tải lịch sử đổi voucher",
        );
      }
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
};
