/**
 * State interface for Update Sneaker form
 * Stores image preview URLs to persist across tab switches
 */
export interface UpdateSneakerFormState {
  // Main image preview (base64 string) - only when user uploads new image
  mainImagePreview: string | null;

  // Sub-images previews for new uploads
  newSubImagePreviews: string[];

  // Colorway cover image previews: { colorwayIndex: previewUrl }
  // Includes both existing (from API) and new uploads
  colorwayImagePreviews: Record<number, string>;
}

/**
 * Initial state
 */
export const initialUpdateSneakerFormState: UpdateSneakerFormState = {
  mainImagePreview: null,
  newSubImagePreviews: [],
  colorwayImagePreviews: {},
};
