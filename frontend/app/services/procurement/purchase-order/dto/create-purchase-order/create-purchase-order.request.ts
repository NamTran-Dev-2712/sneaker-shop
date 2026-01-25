export interface CreatePurchaseOrderRequest {
  vendorId: number;
  storeId: number;
  expectedAt?: string; // ISO date string
  note?: string;
  items: PurchaseOrderItemDto[];
}

export interface PurchaseOrderItemDto {
  sellableItemId: number;
  quantity: number;
  unitCost: number;
}
