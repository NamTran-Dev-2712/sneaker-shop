import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ModalLayout } from "~/components/common/modal/modal.layout";
import { z } from "zod/v4";
import {
  brandSeriesSchema,
  type BrandSeriesArrayData,
} from "~/lib/validation/admin/shop/brand.schema";

// Wrapper schema for the form
const formSchema = z.object({
  series: z
    .array(brandSeriesSchema)
    .min(1, "Vui lòng thêm ít nhất một dòng sản phẩm"),
});

interface BrandSeriesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandName: string;
  onSubmit: (data: BrandSeriesArrayData) => void;
  isLoading?: boolean;
}

export const BrandSeriesModal = ({
  open,
  onOpenChange,
  brandName,
  onSubmit,
  isLoading = false,
}: BrandSeriesModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<{ series: BrandSeriesArrayData }>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      series: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "series",
  });

  useEffect(() => {
    if (!open) {
      reset({ series: [{ name: "" }] });
    }
  }, [open, reset]);

  const handleFormSubmit = (data: { series: BrandSeriesArrayData }) => {
    onSubmit(data.series);
  };

  const handleAddSeries = () => {
    append({ name: "" });
  };

  const handleRemoveSeries = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={`Tạo dòng sản phẩm cho ${brandName}`}
      description="Thêm các dòng sản phẩm mới cho hãng này. Bạn có thể thêm nhiều dòng cùng một lúc."
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="relative p-4 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-8 text-gray-400 cursor-move">
                  <GripVertical className="w-5 h-5" />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`series.${index}.name`}>
                        Tên dòng sản phẩm {fields.length > 1 && `#${index + 1}`}
                      </Label>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSeries(index)}
                          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <Input
                      id={`series.${index}.name`}
                      placeholder="Ví dụ: Air Max, Jordan, Yeezy..."
                      {...register(`series.${index}.name`)}
                      className="bg-white"
                    />
                    {errors.series?.[index]?.name && (
                      <p className="text-sm text-red-500">
                        {errors.series[index]?.name?.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Dòng sản phẩm sẽ được tạo ở trạng thái hoạt động mặc
                      định
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {errors.series?.root && (
          <p className="text-sm text-red-500">{errors.series.root.message}</p>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={handleAddSeries}
          className="w-full border-dashed border-2 hover:border-gray-400 hover:bg-gray-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm dòng sản phẩm
        </Button>

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
            {isLoading ? "Đang lưu..." : "Lưu tất cả"}
          </Button>
        </div>
      </form>
    </ModalLayout>
  );
};
