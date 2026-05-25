export interface CreateBrandInput {
  name: string;
  thumbnailImage: File;
}

export interface CreateCategoryAccessoryRequest {
  name: string;
  brands: CreateBrandInput[];
}
