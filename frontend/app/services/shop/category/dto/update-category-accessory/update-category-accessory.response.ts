import type { BrandResultDto } from "../create-category-accessory/create-category-accessory.response";

export interface UpdateCategoryAccessoryResponse {
  id: number;
  name: string;
  slug: string;
  updatedAt: string; // ISO date string
  brands: BrandResultDto[];
  brandsAdded: number;
  brandsUpdated: number;
  brandsRemoved: number;
}
