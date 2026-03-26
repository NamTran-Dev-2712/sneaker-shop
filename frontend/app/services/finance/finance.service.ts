import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { GetFinanceSummaryRequest } from "./dto/get-finance-summary/get-finance-summary.request";
import type { GetFinanceSummaryResponse } from "./dto/get-finance-summary/get-finance-summary.response";
import type { GetFinanceTrendRequest } from "./dto/get-finance-trend/get-finance-trend.request";
import type { GetFinanceTrendResponse } from "./dto/get-finance-trend/get-finance-trend.response";
import type { GetFinanceLedgerRequest } from "./dto/get-finance-ledger/get-finance-ledger.request";
import type { GetFinanceLedgerResponse } from "./dto/get-finance-ledger/get-finance-ledger.response";
import type { CreateManualFinanceEntryRequest } from "./dto/create-manual-finance-entry/create-manual-finance-entry.request";
import type { CreateManualFinanceEntryResponse } from "./dto/create-manual-finance-entry/create-manual-finance-entry.response";

export const financeService = {
  getSummary: async (
    query: GetFinanceSummaryRequest,
  ): Promise<ApiResponse<GetFinanceSummaryResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetFinanceSummaryResponse | null>>(
        "/finance/summary",
        {
          params: query,
        },
      );
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  getTrend: async (
    query: GetFinanceTrendRequest,
  ): Promise<ApiResponse<GetFinanceTrendResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetFinanceTrendResponse | null>>(
        "/finance/trend",
        {
          params: query,
        },
      );
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  getLedger: async (
    query: GetFinanceLedgerRequest,
  ): Promise<ApiResponse<GetFinanceLedgerResponse | null>> => {
    try {
      const res = await api.get<ApiResponse<GetFinanceLedgerResponse | null>>(
        "/finance/ledger",
        {
          params: query,
        },
      );
      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },

  createManualEntry: async (
    payload: CreateManualFinanceEntryRequest,
  ): Promise<ApiResponse<CreateManualFinanceEntryResponse | null>> => {
    try {
      const res = await api.post<
        ApiResponse<CreateManualFinanceEntryResponse | null>
      >("/finance/manual-entry", payload);

      return res.data;
    } catch (error) {
      const err = error as ApiResponseError;

      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        data: null,
        errors: err.errors,
      };
    }
  },
};
