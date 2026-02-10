import type { BaseGetRequest } from "~/types/global/base.request";
import type { SortSlideBy } from "~/types/global/filter/sort-by.filter";
import type { SortOrder } from "~/types/global/filter/sort-order.filter";

export interface GetSlideRequest extends BaseGetRequest {
  sortBy?: SortSlideBy;
  sortOrder?: SortOrder;
}
