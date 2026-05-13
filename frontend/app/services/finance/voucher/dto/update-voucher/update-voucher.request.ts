import type { DiscountType, VoucherScope } from "~/types/entities/voucher.type";

export interface UpdateVoucherRequest {
  id: number;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  minOrderTotal?: number;
  scope: VoucherScope;
  usageLimit?: number;
  usagePerCustomer?: number;
  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
}
