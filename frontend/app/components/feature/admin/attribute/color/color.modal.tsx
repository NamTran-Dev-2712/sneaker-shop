import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ModalLayout } from "~/components/common/modal/modal.layout";
import type { GetColorItem } from "~/services/attribute/color/dto/get-color/get-color.response";
import {
  createColorSchema,
  updateColorSchema,
  type CreateColorFormData,
  type UpdateColorFormData,
} from "~/lib/validation/admin/attribute/color.schema";

interface ColorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  color?: GetColorItem | null;
  onSubmit: (data: CreateColorFormData | UpdateColorFormData) => void;
  isLoading?: boolean;
}

// Màu mặc định cho color picker
const DEFAULT_COLORS = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#84CC16",
  "#22C55E",
  "#10B981",
  "#14B8A6",
  "#06B6D4",
  "#0EA5E9",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#A855F7",
  "#D946EF",
  "#EC4899",
  "#F43F5E",
  "#000000",
  "#FFFFFF",
  "#6B7280",
];

export const ColorModal = ({
  open,
  onOpenChange,
  color,
  onSubmit,
  isLoading = false,
}: ColorModalProps) => {
  const isEdit = !!color;
  const [selectedHex, setSelectedHex] = useState("#3B82F6");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateColorFormData>({
    resolver: zodResolver(isEdit ? updateColorSchema : createColorSchema),
    defaultValues: {
      name: "",
      hex: "#3B82F6",
    },
  });

  const hexValue = watch("hex");

  // Reset form when modal opens/closes or color changes
  useEffect(() => {
    if (open) {
      if (color) {
        reset({
          name: color.name,
          hex: color.hex,
        });
        setSelectedHex(color.hex);
      } else {
        reset({
          name: "",
          hex: "#3B82F6",
        });
        setSelectedHex("#3B82F6");
      }
    }
  }, [open, color, reset]);

  // Sync selectedHex with form value
  useEffect(() => {
    if (hexValue && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexValue)) {
      setSelectedHex(hexValue);
    }
  }, [hexValue]);

  const handleColorSelect = useCallback(
    (hex: string) => {
      setSelectedHex(hex);
      setValue("hex", hex, { shouldValidate: true });
    },
    [setValue],
  );

  const handleFormSubmit = (data: CreateColorFormData) => {
    onSubmit(data);
  };

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa màu" : "Thêm màu mới"}
      description={
        isEdit ? "Cập nhật thông tin màu sắc" : "Điền thông tin để tạo màu mới"
      }
      isLoading={isLoading}
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" form="color-form" disabled={isLoading}>
            {isEdit ? "Cập nhật" : "Tạo màu"}
          </Button>
        </>
      }
    >
      <form
        id="color-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5"
      >
        {/* Tên màu */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Tên màu <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Nhập tên màu (vd: Đỏ đậm, Xanh dương...)"
            {...register("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Color picker preset */}
        <div className="space-y-2">
          <Label>Chọn màu nhanh</Label>
          <div className="grid grid-cols-10 gap-2">
            {DEFAULT_COLORS.map((hex) => (
              <button
                key={hex}
                type="button"
                className={`h-8 w-8 rounded-full border-2 transition-all hover:scale-110 ${
                  selectedHex === hex
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border"
                }`}
                style={{ backgroundColor: hex }}
                onClick={() => handleColorSelect(hex)}
                title={hex}
              />
            ))}
          </div>
        </div>

        {/* Mã HEX */}
        <div className="space-y-2">
          <Label htmlFor="hex">
            Mã màu HEX <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Input
                id="hex"
                placeholder="#FF5733"
                {...register("hex")}
                aria-invalid={!!errors.hex}
                className="font-mono uppercase"
              />
            </div>
            <div
              className="h-9 w-14 rounded-md border-2 border-border shrink-0"
              style={{ backgroundColor: selectedHex }}
            />
          </div>
          {errors.hex && (
            <p className="text-sm text-destructive">{errors.hex.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Nhập mã màu HEX (bắt đầu bằng #)
          </p>
        </div>

        {/* Preview */}
        <div className="rounded-lg border p-4 bg-muted/30">
          <div className="flex items-center gap-4">
            <div
              className="h-16 w-16 rounded-full border-2 border-border shadow-md"
              style={{ backgroundColor: selectedHex }}
            />
            <div>
              <p className="font-medium">{watch("name") || "Tên màu"}</p>
              <p className="text-sm text-muted-foreground font-mono">
                {selectedHex}
              </p>
            </div>
          </div>
        </div>
      </form>
    </ModalLayout>
  );
};

export default ColorModal;
