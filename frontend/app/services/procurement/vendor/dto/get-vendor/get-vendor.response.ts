import type { BaseGetResponse } from "~/types/global/base.response";

export interface VendorItem {
  id: number;
  name: string;
  phone: string;
  email: string;
  address?: string;
  isActive: boolean;
  productCount: number;
  createdAt: string; // ISO date string
}

export interface GetVendorResponse extends BaseGetResponse<VendorItem> {}

export interface GetAllVendorResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
}

// This is a list, not a paginated response
export type GetAllVendorsResponse = GetAllVendorResponse[];

export interface VariantInfo {
  colorName: string;
  colorHex: string;
  sizeSystem: string;
  sizeValue: number;
}

export interface VendorSellableItem {
  vendorPriceId: number;
  sellableItemId: number;
  sku: string;
  barcode?: string;
  productType: string;
  productName: string;
  productImage?: string;
  variantInfo?: VariantInfo;
  vendorPrice: number;
  retailPrice?: number;
  onlinePrice?: number;
  effectiveFrom: string; // ISO date string
  effectiveTo?: string; // ISO date string or undefined
  isCurrentlyEffective: boolean;
  isActive: boolean;
}

export interface GetVendorSellableItemsResponse extends BaseGetResponse<VendorSellableItem> {}

export interface VendorPriceDetail {
  id: number;
  sellableItemId: number;
  sku: string;
  productName: string;
  productType: string;
  price: number;
  effectiveFrom: string; // ISO date string
  effectiveTo?: string; // ISO date string or undefined
  isCurrentlyEffective: boolean;
}

export interface GetVendorDetailResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
  address?: string;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  totalPurchaseOrders: number;
  pendingPurchaseOrders: number;
  vendorPrices: VendorPriceDetail[];
}
