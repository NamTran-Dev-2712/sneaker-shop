import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  initialUpdateSneakerFormState,
  type UpdateSneakerFormState,
} from "./update-sneaker.state";

/**
 * Redux slice for Update Sneaker form state management
 */
const updateSneakerFormSlice = createSlice({
  name: "updateSneakerForm",
  initialState: initialUpdateSneakerFormState,
  reducers: {
    // Main image
    setMainImagePreview: (state, action: PayloadAction<string | null>) => {
      state.mainImagePreview = action.payload;
    },

    // New sub-images
    setNewSubImagePreviews: (state, action: PayloadAction<string[]>) => {
      state.newSubImagePreviews = action.payload;
    },
    addNewSubImagePreview: (state, action: PayloadAction<string>) => {
      state.newSubImagePreviews.push(action.payload);
    },
    removeNewSubImagePreview: (state, action: PayloadAction<number>) => {
      state.newSubImagePreviews.splice(action.payload, 1);
    },

    // Colorway image - can be existing URL or new upload preview
    setColorwayImagePreview: (
      state,
      action: PayloadAction<{ index: number; preview: string | null }>,
    ) => {
      const { index, preview } = action.payload;
      if (preview) {
        state.colorwayImagePreviews[index] = preview;
      } else {
        delete state.colorwayImagePreviews[index];
      }
    },

    // Initialize colorway previews from existing data
    initColorwayPreviews: (
      state,
      action: PayloadAction<Record<number, string>>,
    ) => {
      state.colorwayImagePreviews = action.payload;
    },

    // Shift colorway indices when removing a colorway
    shiftColorwayIndices: (
      state,
      action: PayloadAction<number>, // removed index
    ) => {
      const removedIndex = action.payload;
      const newPreviews: Record<number, string> = {};

      Object.entries(state.colorwayImagePreviews).forEach(([key, value]) => {
        const currentIndex = parseInt(key);
        if (currentIndex < removedIndex) {
          newPreviews[currentIndex] = value;
        } else if (currentIndex > removedIndex) {
          newPreviews[currentIndex - 1] = value;
        }
      });

      state.colorwayImagePreviews = newPreviews;
    },

    // Reset all state
    resetUpdateSneakerForm: () => initialUpdateSneakerFormState,
  },
});

export const {
  setMainImagePreview,
  setNewSubImagePreviews,
  addNewSubImagePreview,
  removeNewSubImagePreview,
  setColorwayImagePreview,
  initColorwayPreviews,
  shiftColorwayIndices,
  resetUpdateSneakerForm,
} = updateSneakerFormSlice.actions;

export default updateSneakerFormSlice.reducer;
