import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { ModalLayout } from "~/components/common/modal/modal.layout";
import type { GetBrandSeries } from "~/services/shop/brand/dto/get-brand/get-brand.response";

// Schema for editing single series
const editSeriesSchema = z.object({
  id: z.number(),
  brandId: z.number(),
  name: z
    .string()
    .min(1, "Tên dòng sản phẩm không được để trống")
    .max(100, "Tên dòng sản phẩm không được quá 100 ký tự")
    .regex(
      /^[a-zA-Z0-9\s\-&.]+$/,
      "Tên dòng sản phẩm chỉ chứa chữ cái, số và các ký tự đặc biệt: - & .",
    ),
  isActive: z.boolean(),
});

type EditSeriesFormData = z.infer<typeof editSeriesSchema>;

interface BrandSeriesEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandId: number;
  brandName: string;
  series: GetBrandSeries | null;
  onSubmit: (data: EditSeriesFormData) => void;
  isLoading?: boolean;
}

export const BrandSeriesEditModal = ({
  open,
  onOpenChange,
  brandId,
  brandName,
  series,
  onSubmit,
  isLoading = false,
}: BrandSeriesEditModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditSeriesFormData>({
    resolver: zodResolver(editSeriesSchema),
    defaultValues: {
      id: 0,
      brandId: 0,
      name: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  useEffect(() => {
    if (series) {
      reset({
        id: series.id,
        brandId: brandId,
        name: series.name,
        isActive: series.isActive,
      });
    }
  }, [series, brandId, reset]);

  const handleFormSubmit = (data: EditSeriesFormData) => {
    onSubmit(data);
  };

  if (!series) return null;

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={`Chỉnh sửa dòng sản phẩm`}
      description={`Cập nhật thông tin cho dòng sản phẩm của ${brandName}`}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <input type="hidden" {...register("id", { valueAsNumber: true })} />
        <input
          type="hidden"
          {...register("brandId", { valueAsNumber: true })}
        />

        {/* Series Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Tên dòng sản phẩm <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Ví dụ: Air Max, Jordan, Yeezy..."
            {...register("name")}
            className="bg-white"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50/50">
          <div className="space-y-0.5">
            <Label htmlFor="isActive" className="text-base">
              Trạng thái hoạt động
            </Label>
            <p className="text-sm text-gray-500">
              Cho phép hiển thị dòng sản phẩm này trên website
            </p>
          </div>
          <Switch
            id="isActive"
            checked={isActive}
            onCheckedChange={(checked) => setValue("isActive", checked)}
          />
        </div>

        {/* Series Info */}
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-sm">ℹ️</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-medium mb-1">
                Thông tin dòng sản phẩm
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Slug: {series.slug}</li>
                <li>• Số sản phẩm: {series.sneakerCount}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </ModalLayout>
  );
};
