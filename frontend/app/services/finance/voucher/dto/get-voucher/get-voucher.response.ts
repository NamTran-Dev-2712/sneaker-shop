import type { BaseGetResponse } from "~/types/global/base.response";

export interface VoucherItem {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  maxDiscount?: number;
  minOrderTotal?: number;
  scope: string;
  usageLimit?: number;
  usagePerCustomer?: number;
  usageCount: number;
  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
  computedStatus: string;
  createdAt: string;
}

export interface GetVoucherDetailResponse {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  maxDiscount?: number;
  minOrderTotal?: number;
  scope: string;
  usageLimit?: number;
  usagePerCustomer?: number;
  usageCount: number;
  totalRedemptions: number;
  uniqueCustomers: number;
  remainingUsage?: number;
  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
  computedStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetVoucherResponse extends BaseGetResponse<VoucherItem> {}
