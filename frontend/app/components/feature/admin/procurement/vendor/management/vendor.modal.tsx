import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Spinner } from "~/components/ui/spinner";
import type { VendorItem } from "~/services/procurement/vendor/dto/get-vendor/get-vendor.response";
import type { CreateVendorRequest } from "~/services/procurement/vendor/dto/create-vendor/create-vendor.request";
import type { UpdateVendorRequest } from "~/services/procurement/vendor/dto/update-vendor/update-vendor.request";

// Validation schema
const vendorSchema = z.object({
  name: z
    .string()
    .min(1, "Tên nhà cung cấp là bắt buộc")
    .max(200, "Tên không được vượt quá 200 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(15, "Số điện thoại không hợp lệ"),
  address: z
    .string()
    .max(500, "Địa chỉ không được vượt quá 500 ký tự")
    .optional(),
  isActive: z.boolean(),
});

type VendorFormData = z.infer<typeof vendorSchema>;

interface VendorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: VendorItem | null;
  onSubmit: (data: CreateVendorRequest | UpdateVendorRequest) => Promise<void>;
  isLoading: boolean;
}

export const VendorModal = ({
  open,
  onOpenChange,
  vendor,
  onSubmit,
  isLoading,
}: VendorModalProps) => {
  const isEditing = vendor !== null;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  // Reset form when modal opens/closes or vendor changes
  useEffect(() => {
    if (open) {
      if (vendor) {
        reset({
          name: vendor.name,
          email: vendor.email,
          phone: vendor.phone,
          address: vendor.address || "",
          isActive: vendor.isActive,
        });
      } else {
        reset({
          name: "",
          email: "",
          phone: "",
          address: "",
          isActive: true,
        });
      }
    }
  }, [open, vendor, reset]);

  const handleFormSubmit = async (data: VendorFormData) => {
    if (isEditing && vendor) {
      await onSubmit({
        id: vendor.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address || undefined,
        isActive: data.isActive,
      } as UpdateVendorRequest);
    } else {
      await onSubmit({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address || undefined,
      } as CreateVendorRequest);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên nhà cung cấp <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Nhập tên nhà cung cấp"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="vendor@example.com"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Số điện thoại <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              placeholder="0901234567"
              {...register("phone")}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Textarea
              id="address"
              placeholder="Nhập địa chỉ nhà cung cấp"
              rows={3}
              {...register("address")}
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Status - only show when editing */}
          {isEditing && (
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Trạng thái hoạt động</Label>
                <p className="text-sm text-muted-foreground">
                  Nhà cung cấp {isActive ? "đang hoạt động" : "ngừng hoạt động"}
                </p>
              </div>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Spinner className="mr-2 h-4 w-4" />}
              {isEditing ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VendorModal;
