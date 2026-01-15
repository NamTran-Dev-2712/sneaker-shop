import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import type { CreateSneakerFormData } from "~/lib/validation/admin/shop/sneaker.schema";
import { ColorwayItemUpdate } from "./colorway.item.update";
import { useUpdateSneakerForm } from "~/store/admin/product/sneaker/update/update-sneaker.hook";
import { useCallback } from "react";

interface TabColorwaysUpdateProps {
  form: UseFormReturn<CreateSneakerFormData>;
  colorwaysArray: UseFieldArrayReturn<CreateSneakerFormData, "colorways">;
  existingColorways?: Array<{ coverImage?: string }>;
}

export const TabColorwaysUpdate = ({
  form,
  colorwaysArray,
  existingColorways = [],
}: TabColorwaysUpdateProps) => {
  const { fields, append, remove } = colorwaysArray;
  const {
    formState: { errors },
    watch,
  } = form;

  const { shiftColorwayIndices } = useUpdateSneakerForm();

  // Add new colorway - copy data from previous (except image)
  const handleAddColorway = useCallback(() => {
    const currentColorways = watch("colorways") || [];
    const lastColorway = currentColorways[currentColorways.length - 1];

    if (lastColorway && lastColorway.variants?.length > 0) {
      append({
        colorId: lastColorway.colorId,
        newColor: lastColorway.newColor
          ? { ...lastColorway.newColor }
          : undefined,
        coverImage: undefined,
        variants: lastColorway.variants.map((v) => ({
          sizeId: 0,
          retailPrice: v.retailPrice,
          onlinePrice: v.onlinePrice,
        })),
      });
    } else {
      append({
        colorId: undefined,
        newColor: undefined,
        coverImage: undefined,
        variants: [
          {
            sizeId: 0,
            retailPrice: undefined,
            onlinePrice: undefined,
          },
        ],
      });
    }
  }, [append, watch]);

  // Remove colorway and shift Redux indices
  const handleRemoveColorway = useCallback(
    (index: number) => {
      remove(index);
      shiftColorwayIndices(index);
    },
    [remove, shiftColorwayIndices],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Phối màu sản phẩm</h3>
          <p className="text-sm text-muted-foreground">
            Quản lý các phối màu và biến thể size
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddColorway}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm phối màu
        </Button>
      </div>

      {/* Error */}
      {errors.colorways && !Array.isArray(errors.colorways) && (
        <p className="text-sm text-destructive">{errors.colorways.message}</p>
      )}

      {/* Colorways list */}
      {fields.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Chưa có phối màu nào. Thêm phối màu để tiếp tục.
          </p>
          <Button type="button" variant="outline" onClick={handleAddColorway}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm phối màu đầu tiên
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <ColorwayItemUpdate
              key={field.id}
              form={form}
              index={index}
              onRemove={() => handleRemoveColorway(index)}
              canRemove={fields.length > 1}
              existingCoverImageUrl={existingColorways[index]?.coverImage}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TabColorwaysUpdate;
