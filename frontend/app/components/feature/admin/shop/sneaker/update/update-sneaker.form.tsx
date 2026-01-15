import { useNavigate, useParams } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save, X, ImagePlus, Images } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import {
  useSneakerDetail,
  useUpdateSneaker,
} from "~/hooks/react-query/use-sneaker.query";
import {
  updateSneakerSchema,
  type UpdateSneakerFormData,
  type ExistingSubImageFormData,
} from "~/lib/validation/admin/shop/sneaker.schema";
import { useState, useEffect, useCallback, useRef } from "react";
import { TabBasicInfoUpdate } from "./tab.basic-info.update";
import { TabColorwaysUpdate } from "./tab.colorways.update";
import { useUpdateSneakerForm } from "~/store/admin/product/sneaker/update/update-sneaker.hook";

export const UpdateSneakerForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const sneakerId = parseInt(params.id || "0");
  const [activeTab, setActiveTab] = useState("basic-info");
  const [formReady, setFormReady] = useState(false);

  // Sub-images state
  const [existingSubImages, setExistingSubImages] = useState<
    ExistingSubImageFormData[]
  >([]);
  const [newSubImageFiles, setNewSubImageFiles] = useState<File[]>([]);
  const newSubImagesInputRef = useRef<HTMLInputElement>(null);

  // Redux hook for image previews
  const {
    newSubImagePreviews,
    initColorwayPreviews,
    addNewSubImagePreview,
    removeNewSubImagePreview: removeNewSubImagePreviewRedux,
    resetForm: resetReduxForm,
  } = useUpdateSneakerForm();

  // Fetch sneaker detail
  const { data: sneaker, isLoading } = useSneakerDetail(sneakerId);
  const updateMutation = useUpdateSneaker();

  // Store existing colorway coverImages for display
  const [existingColorways, setExistingColorways] = useState<
    Array<{ coverImage?: string }>
  >([]);

  const form = useForm<UpdateSneakerFormData>({
    resolver: zodResolver(updateSneakerSchema),
    mode: "onSubmit", // Only validate on submit
    defaultValues: {
      id: sneakerId,
      brandId: 0,
      brandSeriesId: 0,
      name: "",
      description: "",
      mainImage: undefined,
      isActive: true,
      colorways: [],
    },
  });

  const [isActive, setIsActive] = useState(true);

  // Reset Redux state on mount
  useEffect(() => {
    resetReduxForm();
    return () => {
      resetReduxForm();
    };
  }, [resetReduxForm]);

  // Populate form when data loaded
  useEffect(() => {
    if (sneaker && !formReady) {
      // Reset form with sneaker data
      form.reset({
        id: sneaker.id,
        brandId: sneaker.brand.id,
        brandSeriesId: sneaker.brandSeries?.id || 0,
        name: sneaker.name,
        description: sneaker.description || "",
        mainImage: undefined,
        isActive: sneaker.isActive,
        colorways:
          sneaker.colorways?.map((cw) => ({
            id: cw.id,
            colorId: cw.color.id,
            newColor: undefined,
            coverImage: undefined,
            coverImageUrl: cw.coverImage,
            isActive: cw.isActive,
            variants:
              cw.variants?.map((v) => ({
                id: v.id,
                sizeId: v.size.id,
                retailPrice: v.retailPrice,
                onlinePrice: v.onlinePrice,
                isActive: v.isActive,
              })) || [],
          })) || [],
      });
      setIsActive(sneaker.isActive);
      setFormReady(true);

      // Set existing sub-images
      if (sneaker.subImages) {
        setExistingSubImages(
          sneaker.subImages.map((img) => ({
            id: img.id,
            imageUrl: img.imageUrl,
            toRemove: false,
          })),
        );
      }

      // Store existing colorway images for display
      if (sneaker.colorways) {
        setExistingColorways(
          sneaker.colorways.map((cw) => ({ coverImage: cw.coverImage })),
        );

        // Initialize Redux with existing colorway cover images
        const colorwayPreviews: Record<number, string> = {};
        sneaker.colorways.forEach((cw, index) => {
          if (cw.coverImage) {
            colorwayPreviews[index] = cw.coverImage;
          }
        });
        initColorwayPreviews(colorwayPreviews);
      }
    }
  }, [sneaker, form, initColorwayPreviews, formReady]);

  const colorwaysArray = useFieldArray({
    control: form.control,
    name: "colorways",
  });

  // Handle marking existing sub-image for removal
  const handleToggleRemoveExisting = useCallback((id: number) => {
    setExistingSubImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, toRemove: !img.toRemove } : img,
      ),
    );
  }, []);

  // Handle adding new sub-images
  const handleAddNewSubImages = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const newFiles = Array.from(files);
        setNewSubImageFiles((prev) => [...prev, ...newFiles]);

        // Add previews to Redux
        newFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            addNewSubImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      }
    },
    [addNewSubImagePreview],
  );

  // Handle removing new sub-image
  const handleRemoveNewSubImage = useCallback(
    (index: number) => {
      setNewSubImageFiles((prev) => prev.filter((_, i) => i !== index));
      removeNewSubImagePreviewRedux(index);
    },
    [removeNewSubImagePreviewRedux],
  );

  const handleSubmit = async (data: UpdateSneakerFormData) => {
    const formData = new FormData();

    formData.append("id", sneakerId.toString());
    formData.append("brandId", data.brandId.toString());
    formData.append("brandSeriesId", data.brandSeriesId.toString());
    formData.append("name", data.name);
    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.mainImage) {
      formData.append("mainImage", data.mainImage);
    }
    formData.append("isActive", isActive.toString());

    // New sub-images
    newSubImageFiles.forEach((file) => {
      formData.append("newSubImages", file);
    });

    // Sub-images to remove
    const subImagesToRemove = existingSubImages
      .filter((img) => img.toRemove)
      .map((img) => img.id);
    subImagesToRemove.forEach((id) => {
      formData.append("removeSubImageIds", id.toString());
    });

    // Append colorways
    data.colorways?.forEach((colorway, colorwayIndex) => {
      if (colorway.id) {
        formData.append(
          `colorways[${colorwayIndex}].id`,
          colorway.id.toString(),
        );
      }
      if (colorway.colorId) {
        formData.append(
          `colorways[${colorwayIndex}].colorId`,
          colorway.colorId.toString(),
        );
      }
      if (colorway.newColor) {
        formData.append(
          `colorways[${colorwayIndex}].newColor.name`,
          colorway.newColor.name,
        );
        formData.append(
          `colorways[${colorwayIndex}].newColor.hex`,
          colorway.newColor.hex,
        );
      }
      if (colorway.coverImage) {
        formData.append(
          `colorways[${colorwayIndex}].coverImage`,
          colorway.coverImage,
        );
      }
      if (colorway.isActive !== undefined) {
        formData.append(
          `colorways[${colorwayIndex}].isActive`,
          colorway.isActive.toString(),
        );
      }

      // Append variants
      colorway.variants?.forEach((variant, variantIndex) => {
        if (variant.id) {
          formData.append(
            `colorways[${colorwayIndex}].variants[${variantIndex}].id`,
            variant.id.toString(),
          );
        }
        formData.append(
          `colorways[${colorwayIndex}].variants[${variantIndex}].sizeId`,
          variant.sizeId.toString(),
        );
        if (variant.retailPrice !== undefined && variant.retailPrice !== null) {
          formData.append(
            `colorways[${colorwayIndex}].variants[${variantIndex}].retailPrice`,
            variant.retailPrice.toString(),
          );
        }
        if (variant.onlinePrice !== undefined && variant.onlinePrice !== null) {
          formData.append(
            `colorways[${colorwayIndex}].variants[${variantIndex}].onlinePrice`,
            variant.onlinePrice.toString(),
          );
        }
        if (variant.isActive !== undefined) {
          formData.append(
            `colorways[${colorwayIndex}].variants[${variantIndex}].isActive`,
            variant.isActive.toString(),
          );
        }
      });
    });

    await updateMutation.mutateAsync({ id: sneakerId, formData });
    resetReduxForm();
    navigate("/admin/sneakers");
  };

  const handleBack = () => {
    resetReduxForm();
    navigate("/admin/sneakers");
  };

  // Loading state
  if (isLoading || !formReady) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Not found
  if (!sneaker) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Không tìm thấy sản phẩm</p>
        <Button variant="outline" className="mt-4" onClick={handleBack}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Chỉnh sửa sản phẩm
            </h1>
            <p className="text-muted-foreground">{sneaker.name}</p>
          </div>
        </div>

        {/* Status toggle */}
        <div className="flex items-center gap-3">
          <Label htmlFor="isActive">Trạng thái</Label>
          <Switch
            id="isActive"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
          <span className="text-sm text-muted-foreground">
            {isActive ? "Đang bán" : "Tạm ẩn"}
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic-info">Thông tin cơ bản</TabsTrigger>
            <TabsTrigger value="colorways">Phối màu & Biến thể</TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info" className="mt-6">
            <TabBasicInfoUpdate
              form={form as any}
              existingMainImageUrl={sneaker.mainImage}
            />

            {/* Existing sub-images */}
            <div className="mt-6 space-y-2">
              <Label className="flex items-center gap-2">
                <Images className="h-4 w-4" />
                Ảnh phụ (Gallery)
              </Label>

              {/* Existing sub-images */}
              {existingSubImages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Ảnh hiện có (click để đánh dấu xóa):
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {existingSubImages.map((img) => (
                      <div
                        key={img.id}
                        className={`relative w-24 h-24 rounded-lg border overflow-hidden cursor-pointer transition-all ${
                          img.toRemove
                            ? "opacity-50 ring-2 ring-destructive"
                            : ""
                        }`}
                        onClick={() => handleToggleRemoveExisting(img.id)}
                      >
                        <img
                          src={img.imageUrl}
                          alt={`Sub ${img.id}`}
                          className="w-full h-full object-cover"
                        />
                        {img.toRemove && (
                          <div className="absolute inset-0 bg-destructive/30 flex items-center justify-center">
                            <X className="h-8 w-8 text-destructive" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New sub-images */}
              <div className="space-y-2 mt-4">
                <p className="text-sm text-muted-foreground">Thêm ảnh mới:</p>
                <div className="flex flex-wrap gap-3">
                  {newSubImagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 rounded-lg border overflow-hidden group"
                    >
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveNewSubImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => newSubImagesInputRef.current?.click()}
                    className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
                  >
                    <ImagePlus className="h-5 w-5" />
                    <span className="text-xs">Thêm ảnh</span>
                  </button>
                </div>
                <input
                  ref={newSubImagesInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleAddNewSubImages}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="colorways" className="mt-6">
            <TabColorwaysUpdate
              form={form as any}
              colorwaysArray={colorwaysArray as any}
              existingColorways={existingColorways}
            />
          </TabsContent>
        </Tabs>

        {/* Submit button */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
          <Button type="button" variant="outline" onClick={handleBack}>
            Hủy
          </Button>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSneakerForm;
