import {
  FinanceEntrySourceType,
  FinanceEntryStatus,
} from "~/types/entities/finance.type";

export interface CreateManualFinanceEntryResponse {
  id: number;
  status: FinanceEntryStatus;
  amount: number;
  category: string;
  description?: string;
  sourceType?: FinanceEntrySourceType;
  sourceId?: number;
  storeId?: number;
  occurredAt: string;
  createdAt: string;
}
