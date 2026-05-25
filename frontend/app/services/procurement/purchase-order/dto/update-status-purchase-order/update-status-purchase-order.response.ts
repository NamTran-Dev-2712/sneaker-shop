import type { PurchaseStatus } from "~/types/entities/purchase-order.type";

export interface UpdateStatusPurchaseOrderResponse {
  id: number;
  vendorName: string;
  storeName: string;
  oldStatus: PurchaseStatus;
  newStatus: PurchaseStatus;
  updatedAt: string; // ISO date string
}
