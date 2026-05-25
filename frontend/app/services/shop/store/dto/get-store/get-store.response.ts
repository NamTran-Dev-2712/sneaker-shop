import type { BaseGetResponse } from "~/types/global/base.response";

export interface GetStoreItem {
  id: number;
  code: string;
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  staffCount: number;
  createdAt: string; // ISO date string
}

export interface GetStoreResponse extends BaseGetResponse<GetStoreItem> {}

export interface GetStoreResponseDetail {
  id: number;
  code: string;
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  staffCount: number;
  inventoryCount: number;
  orderCount: number;
}
