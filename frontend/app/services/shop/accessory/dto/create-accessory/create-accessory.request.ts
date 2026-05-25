export interface CreateAccessoryRequest {
  categoryId: number;
  brandId: number;
  name: string;
  description?: string;
  mainImage: File;
  subImages?: File[];
  retailPrice?: number;
  onlinePrice?: number;
}
