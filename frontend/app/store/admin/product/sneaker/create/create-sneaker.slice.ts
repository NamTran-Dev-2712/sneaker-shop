import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  initialCreateSneakerFormState,
  type CreateSneakerFormState,
} from "./create-sneaker.state";

/**
 * Redux slice for Create Sneaker form state management
 */
const createSneakerFormSlice = createSlice({
  name: "createSneakerForm",
  initialState: initialCreateSneakerFormState,
  reducers: {
    // Main image
    setMainImagePreview: (state, action: PayloadAction<string | null>) => {
      state.mainImagePreview = action.payload;
    },

    // Sub-images
    setSubImagePreviews: (state, action: PayloadAction<string[]>) => {
      state.subImagePreviews = action.payload;
    },
    addSubImagePreview: (state, action: PayloadAction<string>) => {
      state.subImagePreviews.push(action.payload);
    },
    removeSubImagePreview: (state, action: PayloadAction<number>) => {
      state.subImagePreviews.splice(action.payload, 1);
    },

    // Colorway image
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
    removeColorwayImagePreview: (state, action: PayloadAction<number>) => {
      delete state.colorwayImagePreviews[action.payload];
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
        // Skip the removed index
      });

      state.colorwayImagePreviews = newPreviews;
    },

    // Reset all state (when leaving form or submitting)
    resetCreateSneakerForm: () => initialCreateSneakerFormState,
  },
});

export const {
  setMainImagePreview,
  setSubImagePreviews,
  addSubImagePreview,
  removeSubImagePreview,
  setColorwayImagePreview,
  removeColorwayImagePreview,
  shiftColorwayIndices,
  resetCreateSneakerForm,
} = createSneakerFormSlice.actions;

export default createSneakerFormSlice.reducer;
