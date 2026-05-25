export interface UpdatePurchaseOrderRequest {
  id: number;
  expectedAt?: string; // ISO date string
  note?: string;
  items: UpdatePurchaseOrderItemDto[];
}

export interface UpdatePurchaseOrderItemDto {
  id?: number; // null for new items
  sellableItemId: number;
  quantity: number;
  unitCost: number;
}
