export interface CreateBrandResponse {
  id: number;
  name: string;
  slug: string;
  logoUrl: string;
  isActive: boolean;
  createdAt: string; // ISO date string
}

export interface CreateBrandSeriesResponse {
  id: number;
  brandId: number;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string; // ISO date string
}
