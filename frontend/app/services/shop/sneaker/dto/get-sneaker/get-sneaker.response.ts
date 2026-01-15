import type { BaseGetResponse } from "~/types/global/base.response";

export interface GetSneakerItem {
  id: number;
  name: string;
  slug: string;
  mainImage: string;
  basePrice?: number;
  isActive: boolean;
  brand: GetSneakerBrandDto;
  brandSeries?: GetSneakerBrandSeriesDto;
  colorCount: number;
  variantCount: number;
  createdAt: string;
}

export interface GetSneakerBrandDto {
  id: number;
  name: string;
}

export interface GetSneakerBrandSeriesDto {
  id: number;
  name: string;
}

export interface GetSneakerResponse extends BaseGetResponse<GetSneakerItem> {}

export interface GetSneakerDetailResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  mainImage: string;
  subImages: GetSneakerDetailSubImageDto[];
  basePrice?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  brand: GetSneakerDetailBrandDto;
  brandSeries?: GetSneakerDetailBrandSeriesDto;
  colorways: GetSneakerDetailColorwayDto[];
}

export interface GetSneakerDetailSubImageDto {
  id: number;
  imageUrl: string;
}

export interface GetSneakerDetailBrandDto {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
}

export interface GetSneakerDetailBrandSeriesDto {
  id: number;
  name: string;
  slug: string;
}

export interface GetSneakerDetailColorwayDto {
  id: number;
  color: GetSneakerDetailColorDto;
  coverImage: string;
  isActive: boolean;
  variants: GetSneakerDetailVariantDto[];
}

export interface GetSneakerDetailColorDto {
  id: number;
  name: string;
  slug: string;
  hex: string;
}

export interface GetSneakerDetailVariantDto {
  id: number;
  size: GetSneakerDetailSizeDto;
  sku: string;
  retailPrice?: number;
  onlinePrice?: number;
  isActive: boolean;
}

export interface GetSneakerDetailSizeDto {
  id: number;
  system: string;
  value: number;
}
