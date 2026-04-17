export interface CreateOrderRequest {
  idempotencyKey: string;
  fulfillmentType: string;
  recipientName?: string;
  recipientPhone?: string;
  province?: string;
  ward?: string;
  addressDetail?: string;
  pickupStoreId?: number | null;
  paymentMethod: string;
  items: CreateOrderItemRequest[];
  note?: string;
  voucherCode?: string;
}

export interface CreateOrderItemRequest {
  sellableItemId: number;
  inventoryId: number;
  quantity: number;
  productName: string;
  sku: string;
  variantName?: string;
  unitPrice: number;
  primaryImageUrl?: string;
}
