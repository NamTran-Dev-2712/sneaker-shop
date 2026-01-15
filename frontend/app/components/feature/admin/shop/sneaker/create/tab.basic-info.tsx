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
import type { CreateSneakerFormData } from "~/lib/validation/admin/shop/sneaker.schema";
import { useRef, useCallback } from "react";
import { ImagePlus, X, Images } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useCreateSneakerForm } from "~/store/admin/product/sneaker/create/create-sneaker.hook";

interface TabBasicInfoProps {
  form: UseFormReturn<CreateSneakerFormData>;
  existingMainImageUrl?: string;
}

export const TabBasicInfo = ({
  form,
  existingMainImageUrl,
}: TabBasicInfoProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  // Redux state for image previews
  const {
    mainImagePreview,
    subImagePreviews,
    setMainImagePreview,
    addSubImagePreview,
    removeSubImagePreview,
  } = useCreateSneakerForm();

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const subImagesInputRef = useRef<HTMLInputElement>(null);

  // Lấy danh sách brands
  const { data: brandsData, isLoading: brandsLoading } = useBrandList({
    pageNumber: 1,
    pageSize: 100,
    isActive: true,
  });

  const selectedBrandId = watch("brandId");

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
        setValue("mainImage", file, { shouldValidate: true });
        const reader = new FileReader();
        reader.onloadend = () => {
          setMainImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [setValue, setMainImagePreview],
  );

  const handleRemoveMainImage = useCallback(() => {
    setValue("mainImage", undefined as any, { shouldValidate: true });
    setMainImagePreview(null);
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = "";
    }
  }, [setValue, setMainImagePreview]);

  // Handle sub-images change
  const handleSubImagesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const currentSubImages = watch("subImages") || [];
        const newFiles = Array.from(files);

        // Update form value
        setValue("subImages", [...currentSubImages, ...newFiles]);

        // Update Redux previews
        newFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            addSubImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      }
    },
    [setValue, watch, addSubImagePreview],
  );

  const handleRemoveSubImage = useCallback(
    (index: number) => {
      const currentSubImages = watch("subImages") || [];
      setValue(
        "subImages",
        currentSubImages.filter((_, i) => i !== index),
      );
      removeSubImagePreview(index);
    },
    [setValue, watch, removeSubImagePreview],
  );

  return (
    <div className="space-y-6">
      {/* Hãng */}
      <div className="space-y-2">
        <Label htmlFor="brandId">
          Hãng <span className="text-destructive">*</span>
        </Label>
        <Select
          value={selectedBrandId?.toString() || ""}
          onValueChange={(value) => {
            setValue("brandId", parseInt(value), { shouldValidate: true });
            // Reset series when brand changes - clear error, don't validate yet
            form.clearErrors("brandSeriesId");
            setValue("brandSeriesId", undefined as any, {
              shouldValidate: false,
            });
          }}
          disabled={brandsLoading}
        >
          <SelectTrigger id="brandId">
            <SelectValue placeholder="Chọn hãng" />
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
          value={watch("brandSeriesId")?.toString() || ""}
          onValueChange={(value) => {
            setValue("brandSeriesId", parseInt(value), {
              shouldValidate: true,
            });
          }}
          disabled={!selectedBrandId || brandSeries.length === 0}
        >
          <SelectTrigger id="brandSeriesId">
            <SelectValue
              placeholder={
                !selectedBrandId
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
        <Label>
          Ảnh chính <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 flex-wrap">
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
              </div>
            ) : (
              <button
                type="button"
                onClick={() => mainImageInputRef.current?.click()}
                className="w-40 h-40 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
              >
                <ImagePlus className="h-8 w-8" />
                <span className="text-sm">
                  {existingMainImageUrl ? "Đổi ảnh" : "Chọn ảnh"}
                </span>
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
          {errors.mainImage && (
            <p className="text-sm text-destructive">
              {errors.mainImage.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Ảnh định dạng JPG, PNG, WebP. Kích thước tối đa 5MB.
          </p>
        </div>
      </div>

      {/* Ảnh phụ - Gallery */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Images className="h-4 w-4" />
          Ảnh phụ (Gallery)
        </Label>
        <p className="text-sm text-muted-foreground">
          Thêm các hình ảnh chi tiết khác của sản phẩm
        </p>
        <div className="flex flex-wrap gap-3 mt-3">
          {subImagePreviews.map((preview, index) => (
            <div
              key={index}
              className="relative w-24 h-24 rounded-lg border overflow-hidden group"
            >
              <img
                src={preview}
                alt={`Sub ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveSubImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => subImagesInputRef.current?.click()}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
          >
            <ImagePlus className="h-5 w-5" />
            <span className="text-xs">Thêm ảnh</span>
          </button>
        </div>
        <input
          ref={subImagesInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleSubImagesChange}
        />
        <p className="text-xs text-muted-foreground">
          Có thể chọn nhiều ảnh cùng lúc. Tối đa 10 ảnh.
        </p>
      </div>
    </div>
  );
};

export default TabBasicInfo;
