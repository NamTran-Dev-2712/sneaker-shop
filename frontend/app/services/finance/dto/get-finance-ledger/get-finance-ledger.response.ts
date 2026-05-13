import type { BaseGetResponse } from "~/types/global/base.response";
import {
  FinanceEntrySourceType,
  FinanceEntryStatus,
} from "~/types/entities/finance.type";

export interface GetFinanceLedgerItem {
  id: number;
  status: FinanceEntryStatus;
  amount: number;
  category: string;
  description?: string;
  sourceType: FinanceEntrySourceType;
  sourceId?: number;
  storeId?: number;
  storeName?: string;
  occurredAt: string;
  createdAt: string;
}

export interface GetFinanceLedgerResponse extends BaseGetResponse<GetFinanceLedgerItem> {}
