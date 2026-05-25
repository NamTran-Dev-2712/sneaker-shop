export interface GetFeaturedSneakerItem {
  id: number;
  name: string;
  slug: string;
  mainImage: string;
  basePrice?: number;
  selled: number;
  viewCount: number;
  ratingCount: number;
  averageRating: number;
  brand: FeaturedSneakerBrandDto;
  brandSeries?: FeaturedSneakerBrandSeriesDto;
}

export interface FeaturedSneakerBrandDto {
  id: number;
  name: string;
}

export interface FeaturedSneakerBrandSeriesDto {
  id: number;
  name: string;
}
