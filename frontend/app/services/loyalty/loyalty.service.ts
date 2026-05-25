import type {
  ApiResponse,
  ApiResponseError,
} from "~/types/global/api.response";
import api from "~/common/configs/axios.config";
import type { GetLoyaltyAccountResponse } from "./dto/get-loyalty-account.response";
import type { GetLoyaltyTransactionsRequest } from "./dto/get-loyalty-transactions.request";
import type { GetLoyaltyTransactionsResponse } from "./dto/get-loyalty-transactions.response";

export interface PaginatedResponse<T> {
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: T[];
}

export const loyaltyService = {
  getMyAccount: async (): Promise<
    ApiResponse<GetLoyaltyAccountResponse | null>
  > => {
    try {
      const res =
        await api.get<ApiResponse<GetLoyaltyAccountResponse | null>>(
          "/loyalty/me",
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

  getMyTransactions: async (
    params: GetLoyaltyTransactionsRequest,
  ): Promise<
    ApiResponse<PaginatedResponse<GetLoyaltyTransactionsResponse> | null>
  > => {
    try {
      const res = await api.get<
        ApiResponse<PaginatedResponse<GetLoyaltyTransactionsResponse> | null>
      >("/loyalty/me/transactions", { params });
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
