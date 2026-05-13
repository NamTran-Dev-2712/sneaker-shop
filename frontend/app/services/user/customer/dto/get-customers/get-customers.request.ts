import type { BaseGetRequest } from "~/types/global/base.request";
import type { SortOrder } from "~/types/global/filter/sort-order.filter";

export type SortCustomerBy = "name" | "createdAt";

export interface GetCustomersRequest extends BaseGetRequest {
  isActive?: boolean;
  hasAccount?: boolean;
  sortBy?: SortCustomerBy;
  sortOrder?: SortOrder;
}
