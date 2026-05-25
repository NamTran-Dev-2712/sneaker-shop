import type { BaseGetResponse } from "~/types/global/base.response";

export interface CustomerItem {
  id: number;
  fullName: string;
  phone?: string;
  email?: string;
  accountId?: number;
  hasAccount: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface GetCustomersResponse extends BaseGetResponse<CustomerItem> {}
