import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ModalLayout } from "~/components/common/modal/modal.layout";
import type { GetSizeItem } from "~/services/attribute/size/dto/get-size/get-size.response";
import {
  createSizeSchema,
  updateSizeSchema,
  SIZE_SYSTEMS,
  type CreateSizeFormData,
  type UpdateSizeFormData,
} from "~/lib/validation/admin/attribute/size.schema";

interface SizeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size?: GetSizeItem | null;
  onSubmit: (data: CreateSizeFormData | UpdateSizeFormData) => void;
  isLoading?: boolean;
}

export const SizeModal = ({
  open,
  onOpenChange,
  size,
  onSubmit,
  isLoading = false,
}: SizeModalProps) => {
  const isEdit = !!size;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateSizeFormData>({
    resolver: zodResolver(isEdit ? updateSizeSchema : createSizeSchema),
    defaultValues: {
      system: "US",
      value: 0,
    },
  });

  const selectedSystem = watch("system");

  // Reset form when modal opens/closes or size changes
  useEffect(() => {
    if (open) {
      if (size) {
        reset({
          system: size.system as "US" | "UK" | "EU" | "CM",
          value: size.value,
        });
      } else {
        reset({
          system: "US",
          value: 0,
        });
      }
    }
  }, [open, size, reset]);

  const handleFormSubmit = (data: CreateSizeFormData) => {
    onSubmit(data);
  };

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa size" : "Thêm size mới"}
      description={
        isEdit ? "Cập nhật thông tin size" : "Điền thông tin để tạo size mới"
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
          <Button type="submit" form="size-form" disabled={isLoading}>
            {isEdit ? "Cập nhật" : "Tạo size"}
          </Button>
        </>
      }
    >
      <form
        id="size-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5"
      >
        {/* Hệ thống size */}
        <div className="space-y-2">
          <Label htmlFor="system">
            Hệ thống size <span className="text-destructive">*</span>
          </Label>
          <Select
            value={selectedSystem}
            onValueChange={(value) =>
              setValue("system", value as "US" | "UK" | "EU" | "CM", {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="system">
              <SelectValue placeholder="Chọn hệ thống size" />
            </SelectTrigger>
            <SelectContent>
              {SIZE_SYSTEMS.map((sys) => (
                <SelectItem key={sys} value={sys}>
                  {sys} - {getSystemDescription(sys)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.system && (
            <p className="text-sm text-destructive">{errors.system.message}</p>
          )}
        </div>

        {/* Giá trị size */}
        <div className="space-y-2">
          <Label htmlFor="value">
            Giá trị size <span className="text-destructive">*</span>
          </Label>
          <Input
            id="value"
            type="number"
            step="0.5"
            min="1"
            max="100"
            placeholder="Nhập giá trị size"
            {...register("value", { valueAsNumber: true })}
            aria-invalid={!!errors.value}
          />
          {errors.value && (
            <p className="text-sm text-destructive">{errors.value.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Nhập giá trị từ 1 đến 100 (có thể nhập số thập phân)
          </p>
        </div>

        {/* Preview */}
        <div className="rounded-lg border p-4 bg-muted/30">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Xem trước</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {watch("value") || 0}
                </span>
                <span className="text-lg text-muted-foreground">
                  {selectedSystem}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </ModalLayout>
  );
};

// Helper function to get system description
function getSystemDescription(system: string): string {
  const descriptions: Record<string, string> = {
    US: "Mỹ",
    UK: "Anh",
    EU: "Châu Âu",
    CM: "Centimet",
  };
  return descriptions[system] || system;
}

export default SizeModal;
