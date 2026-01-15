export interface CreateSneakerRequest {
  brandId: number;
  brandSeriesId: number;
  name: string;
  description?: string;
  mainImage: File;
  subImages?: File[];
  colorways: CreateColorwayInput[];
}

export interface CreateColorwayInput {
  colorId?: number;
  newColor?: CreateInlineColorInput;
  coverImage: File;
  variants: CreateVariantInput[];
}

export interface CreateInlineColorInput {
  name: string;
  hex: string;
}

export interface CreateVariantInput {
  sizeId: number;
  retailPrice?: number;
  onlinePrice?: number;
}
