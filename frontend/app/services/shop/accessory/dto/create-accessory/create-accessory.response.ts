export interface AccessoryCategoryDto {
  id: number;
  name: string;
  slug: string;
}

export interface AccessoryBrandDto {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl: string;
}

export interface AccessoryImageDto {
  id: number;
  imageUrl: string;
}

export interface AccessorySellableItemDto {
  id: number;
  sku: string;
  retailPrice?: number;
  onlinePrice?: number;
  isActive: boolean;
}

export interface CreateAccessoryResponse {
  id: number;
  name: string;
  slug: string;
  mainImage: string;
  description?: string;
  basePrice?: number;
  category: AccessoryCategoryDto;
  brand: AccessoryBrandDto;
  subImages: AccessoryImageDto[];
  sellableItem: AccessorySellableItemDto;
  createdAt: string; // ISO date string
}
