import type { BaseGetResponse } from "~/types/global/base.response";
import type { SellableType } from "~/types/entities/sellable.type";

export interface SellableItemResult {
  id: number;
  type: SellableType;
  sku: string;
  barcode?: string;
  productName: string;
  productImage: string;
  brandName?: string;
  categoryName?: string;
  colorName?: string;
  sizeName?: string;
  retailPrice?: number;
  onlinePrice?: number;
  isActive: boolean;
  totalInventory: number;
  createdAt: string;
}

export interface GetSellableItemResponse extends BaseGetResponse<SellableItemResult> {}

export interface AllSellableItemResult {
  id: number;
  type: SellableType;
  sku: string;
  productName: string;
  colorName?: string;
  sizeName?: string;
  retailPrice?: number;
  onlinePrice?: number;
  isActive: boolean;
}
