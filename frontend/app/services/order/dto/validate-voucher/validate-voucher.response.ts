export interface ValidateVoucherResponse {
  voucherCode: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
  message: string;
}
