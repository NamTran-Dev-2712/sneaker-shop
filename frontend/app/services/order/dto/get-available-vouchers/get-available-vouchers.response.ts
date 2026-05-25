export interface GetAvailableVouchersResponse {
  code: string;
  discountType: string;
  discountValue: number;
  maxDiscount?: number;
  minOrderTotal?: number;
  discountAmount: number;
  endsAt?: string;
}
