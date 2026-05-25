import type { BaseGetRequest } from "~/types/global/base.request";
import type { SortBy } from "~/types/global/filter/sort-by.filter";
import type { SortOrder } from "~/types/global/filter/sort-order.filter";

export interface GetStoreRequest extends BaseGetRequest {
  isActive?: boolean;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}
