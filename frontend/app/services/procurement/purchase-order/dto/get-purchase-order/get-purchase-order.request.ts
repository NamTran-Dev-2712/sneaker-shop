import type { PurchaseStatus } from "~/types/entities/purchase-order.type";
import type { BaseGetRequest } from "~/types/global/base.request";

export interface GetPurchaseOrderRequest extends BaseGetRequest {
  vendorId?: number;
  storeId?: number;
  status?: PurchaseStatus;
  fromDate?: string; // ISO date string
  toDate?: string; // ISO date string
  sortBy?: string;
  isSortDescending?: boolean;
}
