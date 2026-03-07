import type { BaseGetResponse } from "~/types/global/base.response";

export interface GetStaffItem {
  id: number;
  accountId: number;
  fullName: string;
  email: string;
  phone: string;
  storeId: number;
  storeName: string;
  storeCode: string;
  isActive: boolean;
  createdAt: string;
}

export interface GetStaffResponse extends BaseGetResponse<GetStaffItem> {}

export interface GetStaffDetailResponse {
  id: number;
  accountId: number;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  storeId: number;
  storeName: string;
  storeCode: string;
  storeAddress?: string;
  storePhone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
