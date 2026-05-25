import type { PurchaseStatus } from "~/types/entities/purchase-order.type";
import type { BaseGetResponse } from "~/types/global/base.response";

export interface PurchaseOrderItem {
  id: number;
  vendorId: number;
  vendorName: string;
  storeId: number;
  storeName: string;
  status: PurchaseStatus;
  expectedAt?: string; // ISO date string
  totalCost: number;
  itemCount: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface GetPurchaseOrderResponse extends BaseGetResponse<PurchaseOrderItem> {}

export interface PurchaseOrderDetailItem {
  id: number;
  sellableItemId: number;
  sellableItemName: string;
  sellableType: string;
  colorName?: string;
  sizeName?: string;
  sku: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface GetPurchaseOrderDetailResponse {
  id: number;
  vendorId: number;
  vendorName: string;
  vendorPhone?: string;
  vendorEmail?: string;
  storeId: number;
  storeName: string;
  status: PurchaseStatus;
  expectedAt?: string; // ISO date string
  note?: string;
  totalCost: number;
  itemCount: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  items: PurchaseOrderDetailItem[];
}
