export type FeaturedType = "TopRated" | "MostViewed" | "BestSelling";

export interface GetFeaturedAccessoryRequest {
  featuredType?: FeaturedType;
  limit?: number;
}
