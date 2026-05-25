import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import type { RootState, AppDispatch } from "~/store/store";
import {
  setMainImagePreview,
  setSubImagePreviews,
  addSubImagePreview,
  removeSubImagePreview,
  setColorwayImagePreview,
  removeColorwayImagePreview,
  shiftColorwayIndices,
  resetCreateSneakerForm,
} from "./create-sneaker.slice";

/**
 * Custom hook for Create Sneaker form state management
 * Provides typed actions and selectors
 */
export const useCreateSneakerForm = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const mainImagePreview = useSelector(
    (state: RootState) => state.createSneakerForm.mainImagePreview,
  );
  const subImagePreviews = useSelector(
    (state: RootState) => state.createSneakerForm.subImagePreviews,
  );
  const colorwayImagePreviews = useSelector(
    (state: RootState) => state.createSneakerForm.colorwayImagePreviews,
  );

  // Actions
  const handleSetMainImagePreview = useCallback(
    (preview: string | null) => {
      dispatch(setMainImagePreview(preview));
    },
    [dispatch],
  );

  const handleSetSubImagePreviews = useCallback(
    (previews: string[]) => {
      dispatch(setSubImagePreviews(previews));
    },
    [dispatch],
  );

  const handleAddSubImagePreview = useCallback(
    (preview: string) => {
      dispatch(addSubImagePreview(preview));
    },
    [dispatch],
  );

  const handleRemoveSubImagePreview = useCallback(
    (index: number) => {
      dispatch(removeSubImagePreview(index));
    },
    [dispatch],
  );

  const handleSetColorwayImagePreview = useCallback(
    (index: number, preview: string | null) => {
      dispatch(setColorwayImagePreview({ index, preview }));
    },
    [dispatch],
  );

  const handleRemoveColorwayImagePreview = useCallback(
    (index: number) => {
      dispatch(removeColorwayImagePreview(index));
    },
    [dispatch],
  );

  const handleShiftColorwayIndices = useCallback(
    (removedIndex: number) => {
      dispatch(shiftColorwayIndices(removedIndex));
    },
    [dispatch],
  );

  const handleResetForm = useCallback(() => {
    dispatch(resetCreateSneakerForm());
  }, [dispatch]);

  return {
    // State
    mainImagePreview,
    subImagePreviews,
    colorwayImagePreviews,

    // Actions
    setMainImagePreview: handleSetMainImagePreview,
    setSubImagePreviews: handleSetSubImagePreviews,
    addSubImagePreview: handleAddSubImagePreview,
    removeSubImagePreview: handleRemoveSubImagePreview,
    setColorwayImagePreview: handleSetColorwayImagePreview,
    removeColorwayImagePreview: handleRemoveColorwayImagePreview,
    shiftColorwayIndices: handleShiftColorwayIndices,
    resetForm: handleResetForm,
  };
};
