import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { ModalLayout } from "~/components/common/modal/modal.layout";
import type { GetStoreItem } from "~/services/shop/store/dto/get-store/get-store.response";
import type { CreateStoreRequest } from "~/services/shop/store/dto/create-store/create-store.request";
import type { UpdateStoreRequest } from "~/services/shop/store/dto/update-store/update-store.request";
import {
  storeFormSchema,
  type StoreFormData,
} from "~/lib/validation/admin/shop/store.schema";

interface StoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store?: GetStoreItem | null;
  onSubmit: (data: CreateStoreRequest | UpdateStoreRequest) => void;
  isLoading?: boolean;
}

export const StoreModal = ({
  open,
  onOpenChange,
  store,
  onSubmit,
  isLoading = false,
}: StoreModalProps) => {
  const isEdit = !!store;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      code: "",
      name: "",
      address: "",
      phone: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  // Reset form when modal opens/closes or store changes
  useEffect(() => {
    if (open) {
      if (store) {
        reset({
          code: store.code,
          name: store.name,
          address: store.address || "",
          phone: store.phone || "",
          isActive: store.isActive,
        });
      } else {
        reset({
          code: "",
          name: "",
          address: "",
          phone: "",
          isActive: true,
        });
      }
    }
  }, [open, store, reset]);

  const handleFormSubmit = (data: StoreFormData) => {
    // Validate code for create
    if (!isEdit && (!data.code || data.code.length === 0)) {
      return;
    }

    if (isEdit) {
      const updateData: UpdateStoreRequest = {
        id: store!.id,
        name: data.name,
        address: data.address || undefined,
        phone: data.phone || undefined,
        isActive: data.isActive,
      };
      onSubmit(updateData);
    } else {
      const createData: CreateStoreRequest = {
        code: data.code!.toUpperCase(),
        name: data.name,
        address: data.address || undefined,
        phone: data.phone || undefined,
      };
      onSubmit(createData);
    }
  };

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa cửa hàng" : "Thêm cửa hàng mới"}
      description={
        isEdit
          ? "Cập nhật thông tin cửa hàng"
          : "Điền thông tin để tạo cửa hàng mới"
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
          <Button type="submit" form="store-form" disabled={isLoading}>
            {isEdit ? "Cập nhật" : "Tạo cửa hàng"}
          </Button>
        </>
      }
    >
      <form
        id="store-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5"
      >
        {/* Mã cửa hàng - only for create */}
        {!isEdit && (
          <div className="space-y-2">
            <Label htmlFor="code">
              Mã cửa hàng <span className="text-destructive">*</span>
            </Label>
            <Input
              id="code"
              placeholder="VD: HN-001, SG-002..."
              {...register("code", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
              aria-invalid={!!errors.code}
              className="uppercase"
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Chỉ chứa chữ in hoa, số và dấu gạch ngang
            </p>
          </div>
        )}

        {/* Show code for edit mode */}
        {isEdit && (
          <div className="space-y-2">
            <Label>Mã cửa hàng</Label>
            <div className="flex h-9 items-center rounded-md border bg-muted px-3">
              <span className="font-mono text-sm">{store?.code}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Mã cửa hàng không thể thay đổi
            </p>
          </div>
        )}

        {/* Tên cửa hàng */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Tên cửa hàng <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Nhập tên cửa hàng"
            {...register("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Địa chỉ */}
        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ</Label>
          <Input
            id="address"
            placeholder="Nhập địa chỉ cửa hàng"
            {...register("address")}
            aria-invalid={!!errors.address}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        {/* Số điện thoại */}
        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            placeholder="VD: 0901234567"
            {...register("phone")}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Status toggle - only for edit */}
        {isEdit && (
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Trạng thái hoạt động</Label>
              <p className="text-sm text-muted-foreground">
                {isActive ? "Cửa hàng đang hoạt động" : "Cửa hàng tạm đóng"}
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

export default StoreModal;
