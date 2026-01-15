import type { BaseGetRequest } from "~/types/global/base.request";
import type { SortBy } from "~/types/global/filter/sort-by.filter";
import type { SortOrder } from "~/types/global/filter/sort-order.filter";

export interface GetSneakerRequest extends BaseGetRequest {
  brandId?: number;
  brandSeriesId?: number;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  colorIds?: number[];
  sizeIds?: number[];
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}
