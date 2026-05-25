export interface UpdateSneakerResponse {
  id: number;
  name: string;
  slug: string;
  mainImage: string;
  description?: string;
  isActive: boolean;
  updatedAt: string;
  colorwaysAdded: number;
  variantsAdded: number;
  variantsUpdated: number;
  subImagesAdded: number;
  subImagesRemoved: number;
}
