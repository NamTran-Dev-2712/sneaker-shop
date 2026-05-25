import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  FolderOpen,
  Tag,
  Upload,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";
import { useCreateCategory } from "~/hooks/react-query/use-category.query";
import {
  createCategorySchema,
  type CreateCategoryInput,
  type BrandInput,
} from "~/lib/validation/admin/shop/category.schema";

export const CreateCategoryForm = () => {
  const navigate = useNavigate();
  const createMutation = useCreateCategory();
  const [brandPreviews, setBrandPreviews] = useState<{ [key: number]: string }>(
    {},
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      brands: [{ name: "", thumbnailImage: "" as unknown as File }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "brands",
  });

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
    setValue(`brands.${index}.thumbnailImage`, "" as unknown as File);
    setBrandPreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });
  };

  // Handle form submit
  const onSubmit = async (data: CreateCategoryInput) => {
    const formData = new FormData();
    formData.append("name", data.name);

    data.brands.forEach((brand, index) => {
      formData.append(`brands[${index}].name`, brand.name);
      if (brand.thumbnailImage instanceof File) {
        formData.append(
          `brands[${index}].thumbnailImage`,
          brand.thumbnailImage,
        );
      }
    });

    await createMutation.mutateAsync(formData);
    navigate("/admin/categories");
  };

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
              Thêm danh mục phụ kiện
            </h1>
            <p className="text-muted-foreground">
              Tạo danh mục phụ kiện mới với các hãng liên quan
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
                placeholder="Nhập tên danh mục (VD: Mũ nón, Balo, ...)"
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

        {/* Brands */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Danh sách hãng ({fields.length})
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ name: "", thumbnailImage: "" as unknown as File })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm hãng
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.brands && !Array.isArray(errors.brands) && (
              <p className="text-sm text-destructive">
                {errors.brands.message}
              </p>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border rounded-lg bg-muted/30 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Hãng #{index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => {
                        remove(index);
                        handleRemoveBrandImage(index);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Brand Name */}
                  <div className="space-y-2">
                    <Label htmlFor={`brands.${index}.name`}>
                      Tên hãng <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`brands.${index}.name`}
                      placeholder="Nhập tên hãng"
                      {...register(`brands.${index}.name`)}
                    />
                    {errors.brands?.[index]?.name && (
                      <p className="text-sm text-destructive">
                        {errors.brands[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  {/* Brand Thumbnail */}
                  <div className="space-y-2">
                    <Label>
                      Ảnh đại diện <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex items-center gap-4">
                      {brandPreviews[index] ? (
                        <div className="relative">
                          <img
                            src={brandPreviews[index]}
                            alt={`Brand ${index + 1}`}
                            className="h-16 w-16 rounded-lg object-cover border"
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
                          htmlFor={`brands.${index}.thumbnailImage`}
                          className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors"
                        >
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </label>
                      )}
                      <input
                        id={`brands.${index}.thumbnailImage`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleBrandImageChange(index, e)}
                      />
                      {!brandPreviews[index] && (
                        <p className="text-sm text-muted-foreground">
                          Chọn ảnh đại diện cho hãng
                        </p>
                      )}
                    </div>
                    {errors.brands?.[index]?.thumbnailImage && (
                      <p className="text-sm text-destructive">
                        {errors.brands[index]?.thumbnailImage?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/categories")}
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
                Tạo danh mục
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategoryForm;
