/**
 * State interface for Create Sneaker form
 * Stores image preview URLs (base64) to persist across tab switches
 */
export interface CreateSneakerFormState {
  // Main image preview (base64 string)
  mainImagePreview: string | null;

  // Sub-images previews (base64 strings)
  subImagePreviews: string[];

  // Colorway cover image previews: { colorwayIndex: previewUrl }
  colorwayImagePreviews: Record<number, string>;
}

/**
 * Initial state
 */
export const initialCreateSneakerFormState: CreateSneakerFormState = {
  mainImagePreview: null,
  subImagePreviews: [],
  colorwayImagePreviews: {},
};
