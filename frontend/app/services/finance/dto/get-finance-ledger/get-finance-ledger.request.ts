import type { BaseGetRequest } from "~/types/global/base.request";
import {
  FinanceEntrySourceType,
  FinanceEntryStatus,
} from "~/types/entities/finance.type";

export interface GetFinanceLedgerRequest extends BaseGetRequest {
  storeId?: number;
  status?: FinanceEntryStatus;
  sourceType?: FinanceEntrySourceType;
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: "amount" | "createdAt" | "occurredAt";
  isSortDescending?: boolean;
}
