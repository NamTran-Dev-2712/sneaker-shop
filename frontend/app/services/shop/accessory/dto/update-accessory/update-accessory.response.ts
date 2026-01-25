import type {
  AccessoryBrandDto,
  AccessoryCategoryDto,
  AccessoryImageDto,
  AccessorySellableItemDto,
} from "../create-accessory/create-accessory.response";

export interface UpdateAccessoryResponse {
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
  updatedAt: string; // ISO date string
  imagesAdded: number;
  imagesRemoved: number;
}
