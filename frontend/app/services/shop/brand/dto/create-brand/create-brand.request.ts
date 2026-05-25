export interface CreateBrandRequest {
  name: string;
  logo: File;
}

export interface CreateBrandSeriesRequest {
  brandId: number;
  name: string;
}
