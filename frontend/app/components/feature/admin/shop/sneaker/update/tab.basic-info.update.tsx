import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useBrandList } from "~/hooks/react-query/use-brand.query";
import type { UseFormReturn } from "react-hook-form";
import type { UpdateSneakerFormData } from "~/lib/validation/admin/shop/sneaker.schema";
import { useState, useRef, useCallback } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "~/components/ui/button";

interface TabBasicInfoUpdateProps {
  form: UseFormReturn<UpdateSneakerFormData>;
  existingMainImageUrl?: string;
}

/**
 * Tab Basic Info for Update form
 */
export const TabBasicInfoUpdate = ({
  form,
  existingMainImageUrl,
}: TabBasicInfoUpdateProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const mainImageInputRef = useRef<HTMLInputElement>(null);

  // Lấy danh sách brands
  const { data: brandsData, isLoading: brandsLoading } = useBrandList({
    pageNumber: 1,
    pageSize: 100,
    isActive: true,
  });

  const selectedBrandId = watch("brandId");
  const selectedBrandSeriesId = watch("brandSeriesId");

  // Lấy series của brand được chọn
  const selectedBrand = brandsData?.items?.find(
    (b) => b.id === selectedBrandId,
  );
  const brandSeries = selectedBrand?.series || [];

  // Handle main image change
  const handleMainImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setValue("mainImage", file, { shouldValidate: false });
        const reader = new FileReader();
        reader.onloadend = () => {
          setMainImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [setValue],
  );

  const handleRemoveMainImage = useCallback(() => {
    setValue("mainImage", undefined, { shouldValidate: false });
    setMainImagePreview(null);
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = "";
    }
  }, [setValue]);

  return (
    <div className="space-y-6">
      {/* Hãng */}
      <div className="space-y-2">
        <Label htmlFor="brandId">
          Hãng <span className="text-destructive">*</span>
        </Label>
        <Select
          value={selectedBrandId > 0 ? selectedBrandId.toString() : ""}
          onValueChange={(value) => {
            const brandId = parseInt(value);
            setValue("brandId", brandId, { shouldValidate: false });
            // Reset series when brand changes
            setValue("brandSeriesId", 0, { shouldValidate: false });
          }}
          disabled={brandsLoading}
        >
          <SelectTrigger id="brandId">
            <SelectValue
              placeholder={brandsLoading ? "Đang tải..." : "Chọn hãng"}
            />
          </SelectTrigger>
          <SelectContent>
            {brandsData?.items?.map((brand) => (
              <SelectItem key={brand.id} value={brand.id.toString()}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.brandId && (
          <p className="text-sm text-destructive">{errors.brandId.message}</p>
        )}
      </div>

      {/* Series (Bắt buộc) */}
      <div className="space-y-2">
        <Label htmlFor="brandSeriesId">
          Dòng sản phẩm <span className="text-destructive">*</span>
        </Label>
        <Select
          value={
            selectedBrandSeriesId > 0 ? selectedBrandSeriesId.toString() : ""
          }
          onValueChange={(value) => {
            setValue("brandSeriesId", parseInt(value), {
              shouldValidate: false,
            });
          }}
          disabled={selectedBrandId <= 0 || brandSeries.length === 0}
        >
          <SelectTrigger id="brandSeriesId">
            <SelectValue
              placeholder={
                selectedBrandId <= 0
                  ? "Vui lòng chọn hãng trước"
                  : brandSeries.length === 0
                    ? "Không có dòng sản phẩm"
                    : "Chọn dòng sản phẩm"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {brandSeries.map((series) => (
              <SelectItem key={series.id} value={series.id.toString()}>
                {series.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.brandSeriesId && (
          <p className="text-sm text-destructive">
            {errors.brandSeriesId.message}
          </p>
        )}
      </div>

      {/* Tên sản phẩm */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Tên sản phẩm <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Nhập tên sản phẩm"
          {...register("name")}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Mô tả */}
      <div className="space-y-2">
        <Label htmlFor="description">Mô tả (không bắt buộc)</Label>
        <Textarea
          id="description"
          placeholder="Nhập mô tả sản phẩm"
          rows={4}
          {...register("description")}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Ảnh chính */}
      <div className="space-y-2">
        <Label>Ảnh chính</Label>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 flex-wrap">
            {/* Show existing image */}
            {existingMainImageUrl && !mainImagePreview && (
              <div className="relative w-40 h-40 rounded-lg border overflow-hidden">
                <img
                  src={existingMainImageUrl}
                  alt="Ảnh hiện tại"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1">
                  Ảnh hiện tại
                </div>
              </div>
            )}

            {mainImagePreview ? (
              <div className="relative w-40 h-40 rounded-lg border overflow-hidden group">
                <img
                  src={mainImagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleRemoveMainImage}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-green-600/80 text-white text-xs text-center py-1">
                  Ảnh mới
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => mainImageInputRef.current?.click()}
                className="w-40 h-40 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
              >
                <ImagePlus className="h-8 w-8" />
                <span className="text-sm">Đổi ảnh</span>
              </button>
            )}
          </div>
          <input
            ref={mainImageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleMainImageChange}
          />
          <p className="text-xs text-muted-foreground">
            Chỉ cần chọn ảnh mới nếu muốn thay đổi ảnh chính.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TabBasicInfoUpdate;
