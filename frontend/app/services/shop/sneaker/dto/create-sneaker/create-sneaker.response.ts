export interface CreateSneakerResponse {
  id: number;
  name: string;
  slug: string;
  mainImage: string;
  subImages: SubImageDto[];
  description?: string;
  brand: BrandDto;
  brandSeries?: BrandSeriesDto;
  colorways: ColorwayDto[];
  createdAt: string;
}

export interface SubImageDto {
  id: number;
  imageUrl: string;
}

export interface BrandDto {
  id: number;
  name: string;
}

export interface BrandSeriesDto {
  id: number;
  name: string;
}

export interface ColorwayDto {
  id: number;
  color: ColorDto;
  coverImage: string;
  variants: VariantDto[];
}

export interface ColorDto {
  id: number;
  name: string;
  hex: string;
}

export interface VariantDto {
  id: number;
  size: SizeDto;
  sku: string;
  retailPrice?: number;
  onlinePrice?: number;
}

export interface SizeDto {
  id: number;
  system: string;
  value: number;
}
