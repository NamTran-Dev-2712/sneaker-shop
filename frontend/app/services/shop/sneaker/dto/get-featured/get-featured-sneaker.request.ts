export type FeaturedType = "TopRated" | "MostViewed" | "BestSelling";

export interface GetFeaturedSneakerRequest {
  featuredType?: FeaturedType;
  limit?: number;
}
