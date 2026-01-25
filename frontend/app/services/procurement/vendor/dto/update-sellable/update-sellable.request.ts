export interface UpdateSellableItemRequest {
  id: number; // VendorPrice Id
  vendorId: number;
  price: number;
  effectiveFrom: string; // ISO date string
  effectiveTo?: string; // ISO date string or undefined
}
