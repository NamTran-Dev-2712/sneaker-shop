import type { BaseGetResponse } from "~/types/global/base.response";

export interface MyRedeemedVoucherItem {
  code: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
  orderId: number;
  orderRef: string;
  redeemedAt?: string;
}

export interface GetMyRedeemedVouchersResponse extends BaseGetResponse<MyRedeemedVoucherItem> {}
