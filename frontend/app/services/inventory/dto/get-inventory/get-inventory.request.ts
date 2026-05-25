import type { BaseGetRequest } from "~/types/global/base.request";

export interface GetInventoryRequest extends BaseGetRequest {
  storeId?: number;
  sellableItemId?: number;
  sellableType?: string;
  lowStock?: boolean; // Filter items with OnHand - Reserved <= threshold
  lowStockThreshold?: number;
  sortBy?: string;
  isSortDescending?: boolean;
}
