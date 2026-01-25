import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Save,
  Package,
  FolderOpen,
  Upload,
  X,
  Plus,
  Image,
  DollarSign,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { useCategoryAll } from "~/hooks/react-query/use-category.query";
import {
  useAccessoryDetail,
  useUpdateAccessory,
} from "~/hooks/react-query/use-accessory.query";
import {
  updateAccessorySchema,
  type UpdateAccessoryInput,
} from "~/lib/validation/admin/shop/accessory.schema";
import {
  formatNumber,
  parseCurrency,
} from "~/common/helpers/format-currency.helper";

export const UpdateAccessoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const accessoryId = Number(id);

  // Fetch data
  const { data: accessory, isLoading } = useAccessoryDetail(accessoryId);
  const { data: categories } = useCategoryAll();
  const updateMutation = useUpdateAccessory();

  // State for image previews
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);
  const [subImageFiles, setSubImageFiles] = useState<File[]>([]);
  const [existingSubImages, setExistingSubImages] = useState<string[]>([]);

  // State for selected category brands
  const [selectedCategoryBrands, setSelectedCategoryBrands] = useState<
    { id: number; name: string }[]
  >([]);

  // State for formatted price display
  const [retailPriceDisplay, setRetailPriceDisplay] = useState<string>("");
  const [onlinePriceDisplay, setOnlinePriceDisplay] = useState<string>("");

  // Flag to track if initial data has been loaded
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<UpdateAccessoryInput>({
    resolver: zodResolver(updateAccessorySchema),
    defaultValues: {
      categoryId: undefined,
      brandId: undefined,
      name: "",
      description: "",
      mainImage: undefined,
      subImages: [],
      retailPrice: undefined,
      onlinePrice: undefined,
      isActive: true,
    },
  });

  const watchCategoryId = watch("categoryId");
  const watchBrandId = watch("brandId");
  const watchIsActive = watch("isActive");

  // Load accessory data into form
  useEffect(() => {
    if (accessory && categories && !isInitialDataLoaded) {
      // First, set the brands for the category
      const selectedCategory = categories.find(
        (c) => c.id === accessory.category.id,
      );
      if (selectedCategory?.brands) {
        setSelectedCategoryBrands(
          selectedCategory.brands.map((b) => ({ id: b.id, name: b.name })),
        );
      }

      // Then reset the form with the accessory data
      reset({
        categoryId: accessory.category.id,
        brandId: accessory.brand.id,
        name: accessory.name,
        description: accessory.description || "",
        mainImage: accessory.mainImage,
        retailPrice: accessory.sellableItem?.retailPrice,
        onlinePrice: accessory.sellableItem?.onlinePrice,
        isActive: accessory.sellableItem?.isActive ?? true,
      });

      // Set price display
      if (accessory.sellableItem?.retailPrice) {
        setRetailPriceDisplay(formatNumber(accessory.sellableItem.retailPrice));
      }
      if (accessory.sellableItem?.onlinePrice) {
        setOnlinePriceDisplay(formatNumber(accessory.sellableItem.onlinePrice));
      }

      setMainImagePreview(accessory.mainImage);

      // Set existing sub images
      if (accessory.images) {
        const existingUrls = accessory.images.map((img) => img.imageUrl);
        setExistingSubImages(existingUrls);
        setSubImagePreviews(existingUrls);
      }

      setIsInitialDataLoaded(true);
    }
  }, [accessory, categories, reset, isInitialDataLoaded]);

  // Update brands when category changes (only after initial load)
  useEffect(() => {
    if (watchCategoryId && categories && isInitialDataLoaded) {
      const selectedCategory = categories.find((c) => c.id === watchCategoryId);
      if (selectedCategory?.brands) {
        setSelectedCategoryBrands(
          selectedCategory.brands.map((b) => ({ id: b.id, name: b.name })),
        );
        // Reset brand if current brand is not in the new category
        const brandExists = selectedCategory.brands.some(
          (b) => b.id === watchBrandId,
        );
        if (!brandExists) {
          setValue("brandId", undefined as unknown as number);
        }
      } else {
        setSelectedCategoryBrands([]);
        setValue("brandId", undefined as unknown as number);
      }
    }
  }, [
    watchCategoryId,
    categories,
    isInitialDataLoaded,
    watchBrandId,
    setValue,
  ]);

  // Handle price input change with formatting
  const handleRetailPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^\d]/g, "");
      const numValue = rawValue ? parseInt(rawValue, 10) : undefined;
      setValue("retailPrice", numValue);
      setRetailPriceDisplay(numValue ? formatNumber(numValue) : "");
    },
    [setValue],
  );

  const handleOnlinePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^\d]/g, "");
      const numValue = rawValue ? parseInt(rawValue, 10) : undefined;
      setValue("onlinePrice", numValue);
      setOnlinePriceDisplay(numValue ? formatNumber(numValue) : "");
    },
    [setValue],
  );

  // Handle main image change
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("mainImage", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle remove main image
  const handleRemoveMainImage = () => {
    setValue("mainImage", accessory?.mainImage || ("" as unknown as File));
    setMainImagePreview(accessory?.mainImage || null);
  };

  // Handle sub images change
  const handleSubImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const totalImages =
        existingSubImages.length + subImageFiles.length + files.length;
      if (totalImages > 10) {
        return;
      }

      const newFiles = [...subImageFiles, ...files];
      setSubImageFiles(newFiles);

      // Create previews for new files
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSubImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle remove sub image
  const handleRemoveSubImage = (index: number) => {
    if (index < existingSubImages.length) {
      // Remove existing image
      setExistingSubImages((prev) => prev.filter((_, i) => i !== index));
      setSubImagePreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Remove new file
      const fileIndex = index - existingSubImages.length;
      setSubImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
      setSubImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Handle form submit
  const onSubmit = async (data: UpdateAccessoryInput) => {
    const formData = new FormData();
    // Thêm id vào formData theo yêu cầu của UpdateAccessoryCommand
    formData.append("id", accessoryId.toString());
    formData.append("categoryId", data.categoryId.toString());
    formData.append("brandId", data.brandId.toString());
    formData.append("name", data.name);

    if (data.description) {
      formData.append("description", data.description);
    }

    if (data.mainImage instanceof File) {
      formData.append("mainImage", data.mainImage);
    }

    // Add new sub images (ImagesToAdd)
    subImageFiles.forEach((file) => {
      formData.append("imagesToAdd", file);
    });

    // Add image ids to remove (so sánh với original để tìm những cái đã bị xóa)
    if (accessory?.images) {
      const existingImageIds = existingSubImages
        .map((url) => {
          const found = accessory.images.find((img) => img.imageUrl === url);
          return found?.id;
        })
        .filter(Boolean);

      const originalImageIds = accessory.images.map((img) => img.id);
      const idsToRemove = originalImageIds.filter(
        (id) => !existingImageIds.includes(id),
      );

      idsToRemove.forEach((id) => {
        formData.append("imageIdsToRemove", id.toString());
      });
    }

    if (data.retailPrice !== undefined) {
      formData.append("retailPrice", data.retailPrice.toString());
    }

    if (data.onlinePrice !== undefined) {
      formData.append("onlinePrice", data.onlinePrice.toString());
    }

    if (data.isActive !== undefined) {
      formData.append("isActive", data.isActive.toString());
    }

    try {
      await updateMutation.mutateAsync({ id: accessoryId, formData });
      navigate("/admin/accessories");
    } catch {
      // Error is handled by mutation's onError callback (shows toast)
      // Don't navigate on error
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!accessory) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Không tìm thấy phụ kiện</h2>
        <p className="text-muted-foreground mb-4">
          Phụ kiện này có thể đã bị xóa hoặc không tồn tại
        </p>
        <Button onClick={() => navigate("/admin/accessories")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/accessories")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Chỉnh sửa phụ kiện
            </h1>
            <p className="text-muted-foreground">
              Cập nhật thông tin "{accessory.name}"
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Tên phụ kiện <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Nhập tên phụ kiện"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Nhập mô tả phụ kiện..."
                    rows={4}
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Hình ảnh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Image */}
                <div className="space-y-2">
                  <Label>
                    Ảnh chính <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex items-start gap-4">
                    {mainImagePreview ? (
                      <div className="relative">
                        <img
                          src={mainImagePreview}
                          alt="Main preview"
                          className="h-32 w-32 rounded-lg object-cover border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={handleRemoveMainImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="mainImage"
                        className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground">
                          Chọn ảnh
                        </span>
                      </label>
                    )}
                    <input
                      id="mainImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleMainImageChange}
                    />
                  </div>
                  {errors.mainImage && (
                    <p className="text-sm text-destructive">
                      {errors.mainImage.message}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Sub Images */}
                <div className="space-y-2">
                  <Label>
                    Ảnh phụ (tối đa 10 ảnh, hiện có{" "}
                    {existingSubImages.length + subImageFiles.length})
                  </Label>
                  <div className="flex flex-wrap gap-3">
                    {subImagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Sub preview ${index + 1}`}
                          className="h-20 w-20 rounded-lg object-cover border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-5 w-5"
                          onClick={() => handleRemoveSubImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    {subImagePreviews.length < 10 && (
                      <label
                        htmlFor="subImages"
                        className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors"
                      >
                        <Plus className="h-6 w-6 text-muted-foreground" />
                      </label>
                    )}
                    <input
                      id="subImages"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleSubImagesChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Kích hoạt</Label>
                    <p className="text-sm text-muted-foreground">
                      {watchIsActive
                        ? "Phụ kiện đang được bán"
                        : "Phụ kiện tạm ngưng"}
                    </p>
                  </div>
                  <Switch
                    checked={watchIsActive}
                    onCheckedChange={(checked) => setValue("isActive", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category & Brand */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Phân loại
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Danh mục <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={watchCategoryId?.toString()}
                    onValueChange={(value) =>
                      setValue("categoryId", Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-sm text-destructive">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>
                    Hãng <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={watch("brandId")?.toString()}
                    onValueChange={(value) =>
                      setValue("brandId", Number(value))
                    }
                    disabled={!watchCategoryId}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          watchCategoryId ? "Chọn hãng" : "Chọn danh mục trước"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategoryBrands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.brandId && (
                    <p className="text-sm text-destructive">
                      {errors.brandId.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Giá bán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="retailPrice">Giá bán lẻ (VNĐ)</Label>
                  <Input
                    id="retailPrice"
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={retailPriceDisplay}
                    onChange={handleRetailPriceChange}
                  />
                  {errors.retailPrice && (
                    <p className="text-sm text-destructive">
                      {errors.retailPrice.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="onlinePrice">Giá online (VNĐ)</Label>
                  <Input
                    id="onlinePrice"
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={onlinePriceDisplay}
                    onChange={handleOnlinePriceChange}
                  />
                  {errors.onlinePrice && (
                    <p className="text-sm text-destructive">
                      {errors.onlinePrice.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/accessories")}
            disabled={isSubmitting || updateMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAccessoryForm;
