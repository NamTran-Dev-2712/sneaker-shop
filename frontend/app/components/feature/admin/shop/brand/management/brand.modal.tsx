import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { ModalLayout } from "~/components/common/modal/modal.layout";
import { UploadImage } from "~/components/common/shared/upload-image";
import type { GetBrandItem } from "~/services/shop/brand/dto/get-brand/get-brand.response";
import {
  brandFormSchema,
  type BrandFormData,
} from "~/lib/validation/admin/shop/brand.schema";

interface BrandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand?: GetBrandItem | null;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export const BrandModal = ({
  open,
  onOpenChange,
  brand,
  onSubmit,
  isLoading = false,
}: BrandModalProps) => {
  const isEdit = !!brand;
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoError, setLogoError] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  // Reset form when modal opens/closes or brand changes
  useEffect(() => {
    if (open) {
      if (brand) {
        reset({
          name: brand.name,
          isActive: brand.isActive,
        });
        setLogoFile(null);
        setLogoError("");
      } else {
        reset({
          name: "",
          isActive: true,
        });
        setLogoFile(null);
        setLogoError("");
      }
    }
  }, [open, brand, reset]);

  const handleFormSubmit = (data: BrandFormData) => {
    // Validate logo for create
    if (!isEdit && !logoFile) {
      setLogoError("Vui lòng chọn logo cho hãng");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);

    if (isEdit) {
      formData.append("id", brand!.id.toString());
      formData.append("isActive", data.isActive.toString());
    }

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    onSubmit(formData);
  };

  const handleLogoChange = (file: File | null) => {
    setLogoFile(file);
    if (file) {
      setLogoError("");
    }
  };

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa hãng" : "Thêm hãng mới"}
      description={
        isEdit
          ? "Cập nhật thông tin hãng sản phẩm"
          : "Điền thông tin để tạo hãng mới"
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
          <Button type="submit" form="brand-form" disabled={isLoading}>
            {isEdit ? "Cập nhật" : "Tạo hãng"}
          </Button>
        </>
      }
    >
      <form
        id="brand-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5"
      >
        {/* Tên hãng */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Tên hãng <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Nhập tên hãng (vd: Nike, Adidas...)"
            {...register("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Logo upload */}
        <UploadImage
          value={logoFile}
          onChange={handleLogoChange}
          label="Logo hãng"
          required={!isEdit}
          error={logoError}
          disabled={isLoading}
        />

        {/* Preview existing logo for edit */}
        {isEdit && brand?.logoUrl && !logoFile && (
          <div className="space-y-2">
            <Label>Logo hiện tại</Label>
            <div className="h-20 w-20 rounded-lg border bg-muted overflow-hidden">
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="h-full w-full object-contain p-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Chọn ảnh mới nếu muốn thay đổi logo
            </p>
          </div>
        )}

        {/* Status toggle - only for edit */}
        {isEdit && (
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Trạng thái hoạt động</Label>
              <p className="text-sm text-muted-foreground">
                {isActive ? "Hãng đang được hiển thị" : "Hãng đang bị ẩn"}
              </p>
            </div>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>
        )}
      </form>
    </ModalLayout>
  );
};

export default BrandModal;
