import { useQuery } from "@tanstack/react-query";
import { loyaltyService } from "~/services/loyalty/loyalty.service";
import type { GetLoyaltyTransactionsRequest } from "~/services/loyalty/dto/get-loyalty-transactions.request";

export const loyaltyKeys = {
  all: ["loyalty"] as const,
  account: () => [...loyaltyKeys.all, "account"] as const,
  transactions: (params: GetLoyaltyTransactionsRequest) =>
    [...loyaltyKeys.all, "transactions", params] as const,
};

export const useMyLoyaltyAccount = () => {
  return useQuery({
    queryKey: loyaltyKeys.account(),
    queryFn: async () => {
      const response = await loyaltyService.getMyAccount();
      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Không thể tải thông tin điểm thưởng",
        );
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useMyLoyaltyTransactions = (
  params: GetLoyaltyTransactionsRequest,
) => {
  return useQuery({
    queryKey: loyaltyKeys.transactions(params),
    queryFn: async () => {
      const response = await loyaltyService.getMyTransactions(params);
      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Không thể tải lịch sử điểm thưởng",
        );
      }
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
};
