import { useRef, useCallback, useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  ImagePlus,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import type { UseFormReturn } from "react-hook-form";
import type { CreateSneakerFormData } from "~/lib/validation/admin/shop/sneaker.schema";
import { useAllColors } from "~/hooks/react-query/use-color.query";
import { VariantItem } from "../create/variant.item";
import { useFieldArray } from "react-hook-form";
import { useUpdateSneakerForm } from "~/store/admin/product/sneaker/update/update-sneaker.hook";

interface ColorwayItemUpdateProps {
  form: UseFormReturn<CreateSneakerFormData>;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
  existingCoverImageUrl?: string;
}

export const ColorwayItemUpdate = ({
  form,
  index,
  onRemove,
  canRemove,
  existingCoverImageUrl,
}: ColorwayItemUpdateProps) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  const [isOpen, setIsOpen] = useState(true);
  const [isNewColor, setIsNewColor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redux state for image preview
  const { colorwayImagePreviews, setColorwayImagePreview } =
    useUpdateSneakerForm();
  const imagePreview = colorwayImagePreviews[index] || null;

  // Lấy danh sách colors (không phân trang)
  const { data: colorsData } = useAllColors();

  // Field array cho variants
  const variantsArray = useFieldArray({
    control: form.control,
    name: `colorways.${index}.variants`,
  });

  const colorwayErrors = errors.colorways?.[index];
  const selectedColorId = watch(`colorways.${index}.colorId`);
  const selectedColor = colorsData?.find((c) => c.id === selectedColorId);

  // Initialize preview from existing URL if no preview set
  useEffect(() => {
    if (existingCoverImageUrl && !colorwayImagePreviews[index]) {
      setColorwayImagePreview(index, existingCoverImageUrl);
    }
  }, [
    existingCoverImageUrl,
    index,
    colorwayImagePreviews,
    setColorwayImagePreview,
  ]);

  // Sync isNewColor state with form data on mount
  useEffect(() => {
    const newColor = watch(`colorways.${index}.newColor`);
    if (newColor?.name || newColor?.hex) {
      setIsNewColor(true);
    }
  }, [index, watch]);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setValue(`colorways.${index}.coverImage`, file, {
          shouldValidate: true,
        });
        const reader = new FileReader();
        reader.onloadend = () => {
          setColorwayImagePreview(index, reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [setValue, index, setColorwayImagePreview],
  );

  const handleRemoveImage = useCallback(() => {
    setValue(`colorways.${index}.coverImage`, undefined, {
      shouldValidate: true,
    });
    setColorwayImagePreview(index, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [setValue, index, setColorwayImagePreview]);

  // Add variant with copied prices from previous variant
  const handleAddVariant = useCallback(() => {
    const currentVariants = watch(`colorways.${index}.variants`) || [];
    const lastVariant = currentVariants[currentVariants.length - 1];

    variantsArray.append({
      sizeId: 0,
      retailPrice: lastVariant?.retailPrice ?? undefined,
      onlinePrice: lastVariant?.onlinePrice ?? undefined,
    });
  }, [variantsArray, watch, index]);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 p-0 h-auto font-medium"
              >
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span>Phối màu #{index + 1}</span>
                {selectedColor && (
                  <div className="flex items-center gap-2 ml-2">
                    <div
                      className="h-4 w-4 rounded-full border"
                      style={{ backgroundColor: selectedColor.hex }}
                    />
                    <span className="text-muted-foreground">
                      {selectedColor.name}
                    </span>
                  </div>
                )}
              </Button>
            </CollapsibleTrigger>
            {canRemove && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={onRemove}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="p-4 pt-0 space-y-6">
            {/* Toggle between existing color and new color */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant={!isNewColor ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsNewColor(false);
                  setValue(`colorways.${index}.newColor`, undefined);
                }}
              >
                Chọn màu có sẵn
              </Button>
              <Button
                type="button"
                variant={isNewColor ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsNewColor(true);
                  setValue(`colorways.${index}.colorId`, undefined);
                }}
              >
                Tạo màu mới
              </Button>
            </div>

            {/* Select existing color */}
            {!isNewColor && (
              <div className="space-y-2">
                <Label>Chọn màu</Label>
                <Select
                  value={selectedColorId?.toString() || ""}
                  onValueChange={(value) => {
                    setValue(`colorways.${index}.colorId`, parseInt(value), {
                      shouldValidate: true,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn màu" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorsData?.map((color) => (
                      <SelectItem key={color.id} value={color.id.toString()}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {color.hex}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {colorwayErrors?.colorId && (
                  <p className="text-sm text-destructive">
                    {colorwayErrors.colorId.message}
                  </p>
                )}
              </div>
            )}

            {/* Create new color */}
            {isNewColor && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên màu</Label>
                  <Input
                    placeholder="Nhập tên màu"
                    {...form.register(`colorways.${index}.newColor.name`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mã màu HEX</Label>
                  <Input
                    placeholder="#FF5733"
                    className="font-mono uppercase"
                    {...form.register(`colorways.${index}.newColor.hex`)}
                  />
                </div>
              </div>
            )}

            {/* Cover image */}
            <div className="space-y-2">
              <Label>Ảnh bìa phối màu</Label>
              <div className="flex gap-4">
                {imagePreview ? (
                  <div className="relative w-24 h-24 rounded-lg border overflow-hidden group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {existingCoverImageUrl &&
                      imagePreview === existingCoverImageUrl && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                          Hiện tại
                        </div>
                      )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
                  >
                    <ImagePlus className="h-6 w-6" />
                    <span className="text-xs">Chọn ảnh</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Variants */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Biến thể size</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddVariant}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm size
                </Button>
              </div>

              {colorwayErrors?.variants &&
                !Array.isArray(colorwayErrors.variants) && (
                  <p className="text-sm text-destructive">
                    {colorwayErrors.variants.message}
                  </p>
                )}

              <div className="space-y-3">
                {variantsArray.fields.map((field, variantIndex) => (
                  <VariantItem
                    key={field.id}
                    form={form}
                    colorwayIndex={index}
                    variantIndex={variantIndex}
                    onRemove={() => variantsArray.remove(variantIndex)}
                    canRemove={variantsArray.fields.length > 1}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ColorwayItemUpdate;
