import { FinanceEntryStatus } from "~/types/entities/finance.type";

export interface CreateManualFinanceEntryRequest {
  status: FinanceEntryStatus;
  amount: number;
  category: string;
  description?: string;
  storeId?: number;
  occurredAt?: string;
}
