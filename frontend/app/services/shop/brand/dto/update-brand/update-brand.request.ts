export interface UpdateBrandRequest {
  id: number;
  name: string;
  logo?: File;
  isActive: boolean;
}

export interface UpdateBrandSeriesRequest {
  id: number;
  brandId: number;
  name: string;
  isActive: boolean;
}
