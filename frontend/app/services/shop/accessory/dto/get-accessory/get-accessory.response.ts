import type { AccessoryImageDto } from "../create-accessory/create-accessory.response";
import type { BaseGetResponse } from "../../../../../types/global/base.response";

export interface AccessoryListCategoryDto {
  id: number;
  name: string;
}

export interface AccessoryListBrandDto {
  id: number;
  name: string;
}

export interface GetAccessoryItemResponse {
  id: number;
  name: string;
  slug: string;
  mainImage: string;
  basePrice?: number;
  category: AccessoryListCategoryDto;
  brand: AccessoryListBrandDto;
  imageCount: number;
  isActive: boolean;
  createdAt: string; // ISO date string
}

// Paginated response from API
export interface GetAccessoryResponse extends BaseGetResponse<GetAccessoryItemResponse> {}

export interface GetAccessoryDetailResponse {
  id: number;
  name: string;
  slug: string;
  mainImage: string;
  description?: string;
  basePrice?: number;
  selled: number;
  viewCount: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  category: AccessoryListCategoryDto;
  brand: AccessoryListBrandDto;
  images: AccessoryImageDto[];
  sellableItem?: AccessoryDetailSellableItemDto;
}

export interface AccessoryDetailSellableItemDto {
  id: number;
  sku: string;
  retailPrice?: number;
  onlinePrice?: number;
  isActive: boolean;
  inventory?: AccessoryDetailInventoryDto;
}

export interface AccessoryDetailInventoryDto {
  onHand: number;
  reserved: number;
  available: number;
  storeName: string;
}
