import type { BaseGetResponse } from "~/types/global/base.response";

export interface GetBrandSeries {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  sneakerCount: number;
}

export interface GetBrandItem {
  id: number;
  name: string;
  slug: string;
  logoUrl: string;
  isActive: boolean;
  seriesCount: number;
  series: GetBrandSeries[];
  createdAt: string; // ISO date string
}

export interface GetBrandResponse extends BaseGetResponse<GetBrandItem> {}

export interface GetBrandResponseDetail {
  id: number;
  name: string;
  slug: string;
  logoUrl: string;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  series: GetBrandSeries[];
}
