export interface BrandResultDto {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl: string;
}

export interface CreateCategoryAccessoryResponse {
  id: number;
  name: string;
  slug: string;
  createdAt: string; // ISO date string
  brands: BrandResultDto[];
}
