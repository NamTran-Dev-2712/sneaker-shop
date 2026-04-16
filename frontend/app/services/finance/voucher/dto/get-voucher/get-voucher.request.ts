import type { BaseGetRequest } from "~/types/global/base.request";
import type {
  DiscountType,
  VoucherComputedStatus,
  VoucherScope,
} from "~/types/entities/voucher.type";
import type { SortBy } from "~/types/global/filter/sort-by.filter";
import type { SortOrder } from "~/types/global/filter/sort-order.filter";

export interface GetVoucherRequest extends BaseGetRequest {
  status?: VoucherComputedStatus;
  scope?: VoucherScope;
  discountType?: DiscountType;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}
