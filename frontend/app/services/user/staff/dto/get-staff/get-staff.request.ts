import type { BaseGetRequest } from "~/types/global/base.request";
import type { SortOrder } from "~/types/global/filter/sort-order.filter";

export type SortStaffBy = "name" | "email" | "store" | "createdAt";

export interface GetStaffRequest extends BaseGetRequest {
  storeId?: number;
  isActive?: boolean;
  sortBy?: SortStaffBy;
  sortOrder?: SortOrder;
}
