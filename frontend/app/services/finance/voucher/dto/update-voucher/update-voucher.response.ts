export interface UpdateVoucherResponse {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  maxDiscount?: number;
  minOrderTotal?: number;
  scope: string;
  usageLimit?: number;
  usagePerCustomer?: number;
  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
  updatedAt: string;
}
