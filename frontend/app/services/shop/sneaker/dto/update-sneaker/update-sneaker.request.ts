export interface UpdateSneakerRequest {
  id: number;
  brandId: number;
  brandSeriesId?: number;
  name: string;
  description?: string;
  mainImage?: File;
  isActive: boolean;
  newSubImages?: File[];
  removeSubImageIds?: number[];
  colorways?: UpdateColorwayInput[];
}

export interface UpdateColorwayInput {
  id?: number;
  colorId?: number;
  newColor?: CreateInlineColorInput;
  coverImage?: File;
  isActive?: boolean;
  variants?: UpdateVariantInput[];
}

export interface UpdateVariantInput {
  id?: number;
  sizeId?: number;
  retailPrice?: number;
  onlinePrice?: number;
  isActive?: boolean;
}

export interface CreateInlineColorInput {
  name: string;
  hex: string;
}
