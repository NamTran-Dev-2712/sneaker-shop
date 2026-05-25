import type { BaseGetRequest } from "~/types/global/base.request";
import type { SortColorBy } from "~/types/global/filter/sort-by.filter";
import type { SortOrder } from "~/types/global/filter/sort-order.filter";

export interface GetColorRequest extends BaseGetRequest {
  sortBy?: SortColorBy;
  sortOrder?: SortOrder;
}
