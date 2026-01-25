import type { PurchaseStatus } from "~/types/entities/purchase-order.type";

export interface UpdateStatusPurchaseOrderRequest {
  id: number;
  newStatus: PurchaseStatus;
}
