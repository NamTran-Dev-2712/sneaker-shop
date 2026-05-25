import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Save,
  Package,
  FolderOpen,
  Tag,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";
import { useCategoryAll } from "~/hooks/react-query/use-category.query";
import { useCreateAccessory } from "~/hooks/react-query/use-accessory.query";
import {
  createAccessorySchema,
  type CreateAccessoryInput,
} from "~/lib/validation/admin/shop/accessory.schema";
import { formatNumber } from "~/common/helpers/format-currency.helper";

export const CreateAccessoryForm = () => {
  const navigate = useNavigate();
  const createMutation = useCreateAccessory();

  // Fetch categories
  const { data: categories } = useCategoryAll();

  // State for image previews
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);
  const [subImageFiles, setSubImageFiles] = useState<File[]>([]);

  // State for selected category brands
  const [selectedCategoryBrands, setSelectedCategoryBrands] = useState<
    { id: number; name: string }[]
  >([]);

  // State for formatted price display
  const [retailPriceDisplay, setRetailPriceDisplay] = useState<string>("");
  const [onlinePriceDisplay, setOnlinePriceDisplay] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CreateAccessoryInput>({
    resolver: zodResolver(createAccessorySchema),
    defaultValues: {
      categoryId: undefined,
      brandId: undefined,
      name: "",
      description: "",
      mainImage: undefined,
      subImages: [],
      retailPrice: undefined,
      onlinePrice: undefined,
    },
  });

  const watchCategoryId = watch("categoryId");

  // Update brands when category changes
  useEffect(() => {
    if (watchCategoryId && categories) {
      const selectedCategory = categories.find((c) => c.id === watchCategoryId);
      if (selectedCategory?.brands) {
        setSelectedCategoryBrands(
          selectedCategory.brands.map((b) => ({ id: b.id, name: b.name })),
        );
        // Reset brand selection
        setValue("brandId", undefined as unknown as number);
      } else {
        setSelectedCategoryBrands([]);
      }
    }
  }, [watchCategoryId, categories, setValue]);

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
    setValue("mainImage", undefined as unknown as File);
    setMainImagePreview(null);
  };

  // Handle sub images change
  const handleSubImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = [...subImageFiles, ...files].slice(0, 10);
      setSubImageFiles(newFiles);
      setValue("subImages", newFiles);

      // Create previews
      const newPreviews = [...subImagePreviews];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          setSubImagePreviews([...newPreviews].slice(0, 10));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle remove sub image
  const handleRemoveSubImage = (index: number) => {
    const newFiles = subImageFiles.filter((_, i) => i !== index);
    const newPreviews = subImagePreviews.filter((_, i) => i !== index);
    setSubImageFiles(newFiles);
    setSubImagePreviews(newPreviews);
    setValue("subImages", newFiles);
  };

  // Handle form submit
  const onSubmit = async (data: CreateAccessoryInput) => {
    const formData = new FormData();
    formData.append("categoryId", data.categoryId.toString());
    formData.append("brandId", data.brandId.toString());
    formData.append("name", data.name);

    if (data.description) {
      formData.append("description", data.description);
    }

    if (data.mainImage instanceof File) {
      formData.append("mainImage", data.mainImage);
    }

    if (subImageFiles.length > 0) {
      subImageFiles.forEach((file) => {
        formData.append("subImages", file);
      });
    }

    if (data.retailPrice) {
      formData.append("retailPrice", data.retailPrice.toString());
    }

    if (data.onlinePrice) {
      formData.append("onlinePrice", data.onlinePrice.toString());
    }

    try {
      await createMutation.mutateAsync(formData);
      navigate("/admin/accessories");
    } catch {
      // Error is handled by mutation's onError callback (shows toast)
      // Don't navigate on error
    }
  };

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
              Thêm phụ kiện mới
            </h1>
            <p className="text-muted-foreground">
              Tạo phụ kiện mới trong hệ thống
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
                  <Label>Ảnh phụ (tối đa 10 ảnh)</Label>
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
            disabled={isSubmitting || createMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Đang tạo...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Tạo phụ kiện
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccessoryForm;
