export interface AddSellableItemRequest {
  vendorId: number;
  sellableItemId: number;
  price: number;
  effectiveFrom: string; // ISO date string
  effectiveTo?: string; // ISO date string or undefined
}
