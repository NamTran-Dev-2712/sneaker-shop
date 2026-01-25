import type { SellableType } from "~/types/entities/sellable.type";
import type { BaseGetRequest } from "~/types/global/base.request";
import type {
  SortBy,
  SortSellableItemBy,
} from "~/types/global/filter/sort-by.filter";
import type { SortOrder } from "~/types/global/filter/sort-order.filter";

export interface GetVendorRequest extends BaseGetRequest {
  isActive?: boolean;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export interface GetVendorSellableItemsRequest extends BaseGetRequest {
  vendorId: number;
  productType?: SellableType; // Filter by SNEAKER_VARIANT or ACCESSORY
  isCurrentlyEffective?: boolean; // Filter by currently effective prices
  sortBy: SortSellableItemBy;
  sortOrder: SortOrder;
}
