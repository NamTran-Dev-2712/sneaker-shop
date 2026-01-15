import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import type { RootState, AppDispatch } from "~/store/store";
import {
  setMainImagePreview,
  setNewSubImagePreviews,
  addNewSubImagePreview,
  removeNewSubImagePreview,
  setColorwayImagePreview,
  initColorwayPreviews,
  shiftColorwayIndices,
  resetUpdateSneakerForm,
} from "./update-sneaker.slice";

/**
 * Custom hook for Update Sneaker form state management
 */
export const useUpdateSneakerForm = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const mainImagePreview = useSelector(
    (state: RootState) => state.updateSneakerForm.mainImagePreview,
  );
  const newSubImagePreviews = useSelector(
    (state: RootState) => state.updateSneakerForm.newSubImagePreviews,
  );
  const colorwayImagePreviews = useSelector(
    (state: RootState) => state.updateSneakerForm.colorwayImagePreviews,
  );

  // Actions
  const handleSetMainImagePreview = useCallback(
    (preview: string | null) => {
      dispatch(setMainImagePreview(preview));
    },
    [dispatch],
  );

  const handleSetNewSubImagePreviews = useCallback(
    (previews: string[]) => {
      dispatch(setNewSubImagePreviews(previews));
    },
    [dispatch],
  );

  const handleAddNewSubImagePreview = useCallback(
    (preview: string) => {
      dispatch(addNewSubImagePreview(preview));
    },
    [dispatch],
  );

  const handleRemoveNewSubImagePreview = useCallback(
    (index: number) => {
      dispatch(removeNewSubImagePreview(index));
    },
    [dispatch],
  );

  const handleSetColorwayImagePreview = useCallback(
    (index: number, preview: string | null) => {
      dispatch(setColorwayImagePreview({ index, preview }));
    },
    [dispatch],
  );

  const handleInitColorwayPreviews = useCallback(
    (previews: Record<number, string>) => {
      dispatch(initColorwayPreviews(previews));
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
    dispatch(resetUpdateSneakerForm());
  }, [dispatch]);

  return {
    // State
    mainImagePreview,
    newSubImagePreviews,
    colorwayImagePreviews,

    // Actions
    setMainImagePreview: handleSetMainImagePreview,
    setNewSubImagePreviews: handleSetNewSubImagePreviews,
    addNewSubImagePreview: handleAddNewSubImagePreview,
    removeNewSubImagePreview: handleRemoveNewSubImagePreview,
    setColorwayImagePreview: handleSetColorwayImagePreview,
    initColorwayPreviews: handleInitColorwayPreviews,
    shiftColorwayIndices: handleShiftColorwayIndices,
    resetForm: handleResetForm,
  };
};
