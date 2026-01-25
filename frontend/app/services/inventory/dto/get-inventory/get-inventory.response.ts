import type { BaseGetResponse } from "~/types/global/base.response";

export interface GetInventoryItem {
  id: number;
  storeId: number;
  storeName: string;
  sellableItemId: number;
  productName: string;
  sellableType: string;
  sku: string;
  colorName?: string;
  sizeName?: string;
  onHand: number;
  reserved: number;
  available: number;
  updatedAt: string; // ISO date string
}

export interface GetInventoryResponse extends BaseGetResponse<GetInventoryItem> {}

export interface GetInventoryDetailResponse {
  id: number;
  storeId: number;
  storeName: string;
  storeAddress?: string;
  sellableItemId: number;
  productName: string;
  sellableType: string;
  sku: string;
  barcode?: string;
  colorName?: string;
  sizeName?: string;
  onHand: number;
  reserved: number;
  available: number;
  productPrice: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
