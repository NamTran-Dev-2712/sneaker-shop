import type { BaseGetRequest } from "~/types/global/base.request";
import type { SellableType } from "~/types/entities/sellable.type";

export interface GetSellableItemRequest extends BaseGetRequest {
  storeId?: number;
  type?: SellableType;
  isActive?: boolean;
  brandId?: number;
  categoryId?: number;
  hasInventory?: boolean;
  sortBy?: string; // sku, name, retailPrice, onlinePrice, createdAt
  isSortDescending?: boolean;
}

export interface GetAllSellableItemRequest {
  type?: SellableType;
  isActive?: boolean;
  brandId?: number;
  search?: string;
}
