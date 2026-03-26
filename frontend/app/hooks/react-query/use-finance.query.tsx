import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getErrMessage } from "~/common/helpers/get-err-message.helper";
import { showErrorToast } from "~/components/common/toast/toast.error";
import { showSuccessToast } from "~/components/common/toast/toast.success";
import { financeService } from "~/services/finance/finance.service";
import type { CreateManualFinanceEntryRequest } from "~/services/finance/dto/create-manual-finance-entry/create-manual-finance-entry.request";
import type { GetFinanceLedgerRequest } from "~/services/finance/dto/get-finance-ledger/get-finance-ledger.request";
import type { GetFinanceSummaryRequest } from "~/services/finance/dto/get-finance-summary/get-finance-summary.request";
import type { GetFinanceTrendRequest } from "~/services/finance/dto/get-finance-trend/get-finance-trend.request";
import type { ApiResponseError } from "~/types/global/api.response";

export const financeKeys = {
  all: ["finance"] as const,
  summary: (query: GetFinanceSummaryRequest) =>
    [...financeKeys.all, "summary", query] as const,
  trend: (query: GetFinanceTrendRequest) =>
    [...financeKeys.all, "trend", query] as const,
  ledger: (query: GetFinanceLedgerRequest) =>
    [...financeKeys.all, "ledger", query] as const,
};

export const useFinanceSummary = (query: GetFinanceSummaryRequest) => {
  return useQuery({
    queryKey: financeKeys.summary(query),
    queryFn: async () => {
      const response = await financeService.getSummary(query);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });
};

export const useFinanceTrend = (query: GetFinanceTrendRequest) => {
  return useQuery({
    queryKey: financeKeys.trend(query),
    queryFn: async () => {
      const response = await financeService.getTrend(query);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });
};

export const useFinanceLedger = (query: GetFinanceLedgerRequest) => {
  return useQuery({
    queryKey: financeKeys.ledger(query),
    queryFn: async () => {
      const response = await financeService.getLedger(query);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    staleTime: 1000 * 60,
  });
};

export const useCreateManualFinanceEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateManualFinanceEntryRequest) => {
      const response = await financeService.createManualEntry(payload);
      if (!response.success) {
        const error = response as unknown as ApiResponseError;
        throw new Error(getErrMessage(error));
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.all });
      showSuccessToast("Đã thêm giao dịch thủ công thành công.");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });
};
