export interface UpdateBrandResponse {
  id: number;
  name: string;
  slug: string;
  logoUrl: string;
  isActive: boolean;
  updatedAt: string; // ISO date string
}

export interface UpdateBrandSeriesResponse {
  id: number;
  brandId: number;
  name: string;
  slug: string;
  isActive: boolean;
  updatedAt: string; // ISO date string
}
