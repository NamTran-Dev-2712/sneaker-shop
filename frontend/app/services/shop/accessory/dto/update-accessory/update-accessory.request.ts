export interface UpdateAccessoryRequest {
  id: number;
  categoryId?: number;
  brandId?: number;
  name?: string;
  description?: string;
  mainImage?: File;
  imagesToAdd?: File[];
  imageIdsToRemove?: number[];
  retailPrice?: number;
  onlinePrice?: number;
}
