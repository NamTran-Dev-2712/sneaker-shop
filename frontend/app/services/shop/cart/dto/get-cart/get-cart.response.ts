import type { BaseGetResponse } from "~/types/global/base.response";

export interface GetCartResponse extends BaseGetResponse<CartItemDto> {
  cartId: number;
  customerId: number;
  totalQuantity: number;
  subTotal: number;
  updatedAt: string;
}

export interface CartItemDto {
  cartItemId: number;
  sellableItemId: number;
  inventoryId: number;
  quantity: number;

  // Product information
  productType: string;
  productName: string;
  productSlug?: string;
  sku: string;
  mainImage: string;
  unitPrice: number;
  lineTotal: number;

  // Variant-specific info (for sneakers)
  colorName?: string;
  colorHex?: string;
  sizeName?: string;
  brandName?: string;

  // Inventory info for frontend validation
  selectedInventory: InventoryInfoDto;
  totalAvailableAcrossStores: number;
  availableInventories: InventoryInfoDto[];

  // Status
  isAvailable: boolean;
  unavailableReason?: string;
}

export interface InventoryInfoDto {
  inventoryId: number;
  storeId: number;
  storeName: string;
  onHand: number;
  reserved: number;
  available: number;
}
