import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Save,
  FolderOpen,
  Plus,
  Trash2,
  Upload,
  X,
  Tag,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import {
  useCategoryDetail,
  useUpdateCategory,
} from "~/hooks/react-query/use-category.query";
import {
  updateCategorySchema,
  type UpdateCategoryInput,
  type UpdateBrandInput,
} from "~/lib/validation/admin/shop/category.schema";

export const UpdateCategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const categoryId = Number(id);

  const { data: category, isLoading } = useCategoryDetail(categoryId);
  const updateMutation = useUpdateCategory();

  // State for brand image previews
  const [brandPreviews, setBrandPreviews] = useState<{ [key: number]: string }>(
    {},
  );
  // Track which brand ids to remove
  const [brandIdsToRemove, setBrandIdsToRemove] = useState<number[]>([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: "",
      brands: [],
      brandIdsToRemove: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "brands",
  });

  // Load category data into form
  useEffect(() => {
    if (category) {
      const existingBrands: UpdateBrandInput[] =
        category.brands?.map((brand) => ({
          brandId: brand.id,
          name: brand.name,
          thumbnailImage: brand.thumbnailUrl,
          isNew: false,
        })) || [];

      reset({
        name: category.name,
        brands: existingBrands,
        brandIdsToRemove: [],
      });

      // Set image previews for existing brands
      const previews: { [key: number]: string } = {};
      category.brands?.forEach((brand, index) => {
        previews[index] = brand.thumbnailUrl;
      });
      setBrandPreviews(previews);
      setBrandIdsToRemove([]);
    }
  }, [category, reset]);

  // Handle brand image change
  const handleBrandImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(`brands.${index}.thumbnailImage`, file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandPreviews((prev) => ({
          ...prev,
          [index]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle remove brand image
  const handleRemoveBrandImage = (index: number) => {
    const brand = fields[index];
    // Cho phép xóa preview để người dùng chọn hình mới
    // Nếu là existing brand và không upload hình mới, server sẽ giữ hình cũ
    if (brand && !brand.isNew) {
      // Clear file để có thể chọn file mới, nhưng set placeholder để form không error
      setValue(`brands.${index}.thumbnailImage`, "" as unknown as File);
      setBrandPreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[index];
        return newPreviews;
      });
    } else {
      setValue(`brands.${index}.thumbnailImage`, "" as unknown as File);
      setBrandPreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[index];
        return newPreviews;
      });
    }
  };

  // Handle add new brand
  const handleAddBrand = () => {
    append({
      name: "",
      thumbnailImage: "" as unknown as File,
      isNew: true,
    });
  };

  // Handle remove brand
  const handleRemoveBrand = (index: number) => {
    const brand = fields[index];
    // Nếu là existing brand (có brandId), thêm vào danh sách xóa
    if (brand && brand.brandId && !brand.isNew) {
      setBrandIdsToRemove((prev) => [...prev, brand.brandId as number]);
    }
    remove(index);
    // Update previews
    setBrandPreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });
  };

  // Handle form submit
  const onSubmit = async (data: UpdateCategoryInput) => {
    const formData = new FormData();
    formData.append("id", categoryId.toString());

    if (data.name) {
      formData.append("name", data.name);
    }

    // Separate brands into add and update
    let addIndex = 0;
    let updateIndex = 0;

    data.brands?.forEach((brand) => {
      if (brand.isNew) {
        // New brand to add
        formData.append(`brandsToAdd[${addIndex}].name`, brand.name);
        if (brand.thumbnailImage instanceof File) {
          formData.append(
            `brandsToAdd[${addIndex}].thumbnailImage`,
            brand.thumbnailImage,
          );
        }
        addIndex++;
      } else if (brand.brandId) {
        // Existing brand to update
        formData.append(
          `brandsToUpdate[${updateIndex}].id`,
          brand.brandId.toString(),
        );
        formData.append(`brandsToUpdate[${updateIndex}].name`, brand.name);
        if (brand.thumbnailImage instanceof File) {
          formData.append(
            `brandsToUpdate[${updateIndex}].thumbnailImage`,
            brand.thumbnailImage,
          );
        }
        updateIndex++;
      }
    });

    // Add brand ids to remove
    brandIdsToRemove.forEach((id, index) => {
      formData.append(`brandIdsToRemove[${index}]`, id.toString());
    });

    try {
      await updateMutation.mutateAsync({ id: categoryId, formData });
      navigate("/admin/categories");
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
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Không tìm thấy danh mục</h2>
        <p className="text-muted-foreground mb-4">
          Danh mục này có thể đã bị xóa hoặc không tồn tại
        </p>
        <Button onClick={() => navigate("/admin/categories")}>
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
            onClick={() => navigate("/admin/categories")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Chỉnh sửa danh mục
            </h1>
            <p className="text-muted-foreground">
              Cập nhật thông tin danh mục "{category.name}"
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Category Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Thông tin danh mục
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên danh mục <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên danh mục"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Brands Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Quản lý hãng ({fields.length})
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddBrand}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm hãng
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có hãng nào trong danh mục</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={handleAddBrand}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm hãng đầu tiên
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border bg-muted/30"
                  >
                    {/* Brand Image */}
                    <div className="shrink-0">
                      <div className="relative">
                        {brandPreviews[index] ? (
                          <div className="relative w-20 h-20">
                            <img
                              src={brandPreviews[index]}
                              alt={`Brand ${index + 1}`}
                              className="w-20 h-20 rounded-lg object-cover border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={() => handleRemoveBrandImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <label
                            htmlFor={`brand-image-${index}`}
                            className="flex flex-col items-center justify-center w-20 h-20 rounded-lg border-2 border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                            <span className="text-xs text-muted-foreground">
                              Ảnh
                            </span>
                          </label>
                        )}
                        <input
                          id={`brand-image-${index}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleBrandImageChange(index, e)}
                        />
                      </div>
                      {errors.brands?.[index]?.thumbnailImage && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.brands[index]?.thumbnailImage?.message}
                        </p>
                      )}
                    </div>

                    {/* Brand Name & Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`brand-name-${index}`}>
                          Tên hãng <span className="text-destructive">*</span>
                        </Label>
                        {field.isNew ? (
                          <Badge variant="secondary" className="text-xs">
                            Mới
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            ID: {field.brandId}
                          </Badge>
                        )}
                      </div>
                      <Input
                        id={`brand-name-${index}`}
                        placeholder="Nhập tên hãng"
                        {...register(`brands.${index}.name`)}
                      />
                      {errors.brands?.[index]?.name && (
                        <p className="text-sm text-destructive">
                          {errors.brands[index]?.name?.message}
                        </p>
                      )}
                    </div>

                    {/* Delete Button */}
                    <div className="flex items-start">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveBrand(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Show removed brands info */}
            {brandIdsToRemove.length > 0 && (
              <>
                <Separator />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Sẽ xóa {brandIdsToRemove.length} hãng khi lưu</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setBrandIdsToRemove([]);
                      // Reload form to restore removed brands
                      if (category) {
                        const existingBrands: UpdateBrandInput[] =
                          category.brands?.map((brand) => ({
                            brandId: brand.id,
                            name: brand.name,
                            thumbnailImage: brand.thumbnailUrl,
                            isNew: false,
                          })) || [];
                        reset({
                          name: category.name,
                          brands: existingBrands,
                          brandIdsToRemove: [],
                        });
                        const previews: { [key: number]: string } = {};
                        category.brands?.forEach((brand, idx) => {
                          previews[idx] = brand.thumbnailUrl;
                        });
                        setBrandPreviews(previews);
                      }
                    }}
                  >
                    Hoàn tác
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/categories")}
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

export default UpdateCategoryForm;
