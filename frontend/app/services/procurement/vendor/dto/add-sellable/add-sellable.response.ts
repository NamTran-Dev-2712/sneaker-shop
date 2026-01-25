export interface AddSellableItemResponse {
  id: number;
  vendorId: number;
  sellableItemId: number;
  sku: string;
  price: number;
  effectiveFrom: string; // ISO date string
  effectiveTo?: string; // ISO date string or undefined
  createdAt: string; // ISO date string
}
