import type { BaseGetResponse } from "~/types/global/base.response";
import type { BrandResultDto } from "../create-category-accessory/create-category-accessory.response";

export interface GetCategoryAccessoryItem {
  id: number;
  name: string;
  slug: string;
  brands: BrandResultDto[];
  brandCount: number;
  accessoryCount: number;
  createdAt: string; // ISO date string
}

export interface GetCategoryAccessoryResponse extends BaseGetResponse<GetCategoryAccessoryItem> {}

export interface GetCategoryAccessoryBrandDto {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl: string;
  createdAt: string; // ISO date string
  accessoryCount: number;
}

export interface GetCategoryAccessoryDetailResponse {
  id: number;
  name: string;
  slug: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  brands: GetCategoryAccessoryBrandDto[];
  accessoryCount: number;
}
