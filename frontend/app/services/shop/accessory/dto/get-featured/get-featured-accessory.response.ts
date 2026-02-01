export interface GetFeaturedAccessoryItem {
  id: number;
  name: string;
  slug: string;
  mainImage: string;
  basePrice?: number;
  selled: number;
  viewCount: number;
  ratingCount: number;
  averageRating: number;
  category: FeaturedAccessoryCategoryDto;
  brand: FeaturedAccessoryBrandDto;
}

export interface FeaturedAccessoryCategoryDto {
  id: number;
  name: string;
}

export interface FeaturedAccessoryBrandDto {
  id: number;
  name: string;
}
