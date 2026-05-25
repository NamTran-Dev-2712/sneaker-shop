export interface CreateBrandUpdateInput {
  name: string;
  thumbnailImage: File;
}

export interface UpdateBrandInput {
  id: number;
  name?: string;
  thumbnailImage?: File;
}

export interface UpdateCategoryAccessoryRequest {
  id: number;
  name?: string;
  brandsToAdd: CreateBrandUpdateInput[];
  brandsToUpdate: UpdateBrandInput[];
  brandIdsToRemove: number[];
}
