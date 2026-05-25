export interface MyAvailableVoucherItem {
  code: string;
  discountType: string;
  discountValue: number;
  maxDiscount?: number;
  minOrderTotal?: number;
  scope: string;
  startsAt?: string;
  endsAt?: string;
}
