import { useNavigate } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TabBasicInfo } from "./tab.basic-info";
import { TabColorways } from "./tab.colorways";
import { useCreateSneaker } from "~/hooks/react-query/use-sneaker.query";
import {
  createSneakerSchema,
  type CreateSneakerFormData,
} from "~/lib/validation/admin/shop/sneaker.schema";
import { useState, useEffect } from "react";
import { useCreateSneakerForm } from "~/store/admin/product/sneaker/create/create-sneaker.hook";

export const CreateSneakerForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic-info");
  const createMutation = useCreateSneaker();

  // Redux hook for form state management
  const { resetForm } = useCreateSneakerForm();

  // Reset Redux state on mount
  useEffect(() => {
    resetForm();
    return () => {
      resetForm(); // Cleanup on unmount
    };
  }, [resetForm]);

  const form = useForm<CreateSneakerFormData>({
    resolver: zodResolver(createSneakerSchema),
    defaultValues: {
      brandId: undefined as unknown as number,
      brandSeriesId: undefined as unknown as number,
      name: "",
      description: "",
      mainImage: undefined,
      subImages: [],
      colorways: [
        {
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
        },
      ],
    },
  });

  const colorwaysArray = useFieldArray({
    control: form.control,
    name: "colorways",
  });

  const handleSubmit = async (data: CreateSneakerFormData) => {
    const formData = new FormData();

    // Basic info
    formData.append("brandId", data.brandId.toString());
    formData.append("brandSeriesId", data.brandSeriesId.toString());
    formData.append("name", data.name);
    if (data.description) {
      formData.append("description", data.description);
    }

    // Main image
    if (data.mainImage) {
      formData.append("mainImage", data.mainImage);
    }

    // Sub-images (gallery)
    if (data.subImages && data.subImages.length > 0) {
      data.subImages.forEach((file) => {
        formData.append("subImages", file);
      });
    }

    // Append colorways
    data.colorways.forEach((colorway, colorwayIndex) => {
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

      // Append variants
      colorway.variants.forEach((variant, variantIndex) => {
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
      });
    });

    await createMutation.mutateAsync(formData);
    resetForm(); // Clean up Redux state after submit
    navigate("/admin/sneakers");
  };

  const handleBack = () => {
    resetForm(); // Clean up Redux state when leaving
    navigate("/admin/sneakers");
  };

  // Check if form has errors in specific tabs
  const hasBasicInfoErrors =
    form.formState.errors.brandId ||
    form.formState.errors.name ||
    form.formState.errors.description ||
    form.formState.errors.mainImage ||
    form.formState.errors.subImages;

  const hasColorwaysErrors = form.formState.errors.colorways;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Thêm sản phẩm mới
          </h1>
          <p className="text-muted-foreground">
            Điền thông tin để tạo sản phẩm mới
          </p>
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
            <TabsTrigger
              value="basic-info"
              className={hasBasicInfoErrors ? "text-destructive" : ""}
            >
              Thông tin cơ bản
              {hasBasicInfoErrors && (
                <span className="ml-2 h-2 w-2 rounded-full bg-destructive" />
              )}
            </TabsTrigger>
            <TabsTrigger
              value="colorways"
              className={hasColorwaysErrors ? "text-destructive" : ""}
            >
              Phối màu & Biến thể
              {hasColorwaysErrors && (
                <span className="ml-2 h-2 w-2 rounded-full bg-destructive" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info" className="mt-6">
            <TabBasicInfo form={form} />
          </TabsContent>

          <TabsContent value="colorways" className="mt-6">
            <TabColorways form={form} colorwaysArray={colorwaysArray} />
          </TabsContent>
        </Tabs>

        {/* Submit button */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
          <Button type="button" variant="outline" onClick={handleBack}>
            Hủy
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Tạo sản phẩm
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSneakerForm;
