import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ModalLayout } from "~/components/common/modal/modal.layout";
import type { GetStaffItem } from "~/services/user/staff/dto/get-staff/get-staff.response";
import type { CreateStaffRequest } from "~/services/user/staff/dto/create-staff/create-staff.request";
import type { UpdateStaffRequest } from "~/services/user/staff/dto/update-staff/update-staff.request";
import {
  staffCreateSchema,
  staffUpdateSchema,
  type StaffCreateData,
  type StaffUpdateData,
} from "~/lib/validation/admin/user/staff.schema";
import { useAllStores } from "~/hooks/react-query/use-store.query";

interface StaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: GetStaffItem | null;
  onSubmit: (data: CreateStaffRequest | UpdateStaffRequest) => void;
  isLoading?: boolean;
}

export const StaffModal = ({
  open,
  onOpenChange,
  staff,
  onSubmit,
  isLoading = false,
}: StaffModalProps) => {
  const isEdit = !!staff;
  const { data: storesData } = useAllStores();

  // Use different schemas for create vs edit
  const createForm = useForm<StaffCreateData>({
    resolver: zodResolver(staffCreateSchema),
    defaultValues: {
      email: "",
      phone: "",
      fullName: "",
      storeId: 0,
    },
  });

  const updateForm = useForm<StaffUpdateData>({
    resolver: zodResolver(staffUpdateSchema),
    defaultValues: {
      fullName: "",
      storeId: 0,
      isActive: true,
    },
  });

  const activeForm = isEdit ? updateForm : createForm;

  // Reset form when modal opens/closes or staff changes
  useEffect(() => {
    if (open) {
      if (staff) {
        updateForm.reset({
          fullName: staff.fullName,
          storeId: staff.storeId,
          isActive: staff.isActive,
        });
      } else {
        createForm.reset({
          email: "",
          phone: "",
          fullName: "",
          storeId: 0,
        });
      }
    }
  }, [open, staff, createForm, updateForm]);

  const handleCreateSubmit = (data: StaffCreateData) => {
    const createData: CreateStaffRequest = {
      email: data.email,
      phone: data.phone,
      fullName: data.fullName,
      storeId: data.storeId,
    };
    onSubmit(createData);
  };

  const handleUpdateSubmit = (data: StaffUpdateData) => {
    const updateData: UpdateStaffRequest = {
      id: staff!.id,
      fullName: data.fullName,
      storeId: data.storeId,
      isActive: data.isActive,
    };
    onSubmit(updateData);
  };

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
      description={
        isEdit
          ? "Cập nhật thông tin nhân viên"
          : "Điền thông tin để tạo nhân viên mới. Mật khẩu sẽ được tạo tự động và gửi qua email."
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
          <Button type="submit" form="staff-form" disabled={isLoading}>
            {isEdit ? "Cập nhật" : "Tạo nhân viên"}
          </Button>
        </>
      }
    >
      {/* Create Form */}
      {!isEdit && (
        <form
          id="staff-form"
          onSubmit={createForm.handleSubmit(handleCreateSubmit)}
          className="space-y-5"
        >
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Nhập email nhân viên"
              {...createForm.register("email")}
              aria-invalid={!!createForm.formState.errors.email}
            />
            {createForm.formState.errors.email && (
              <p className="text-sm text-destructive">
                {createForm.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Số điện thoại <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              placeholder="VD: 0901234567"
              {...createForm.register("phone")}
              aria-invalid={!!createForm.formState.errors.phone}
            />
            {createForm.formState.errors.phone && (
              <p className="text-sm text-destructive">
                {createForm.formState.errors.phone.message}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Họ và tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="Nhập họ và tên nhân viên"
              {...createForm.register("fullName")}
              aria-invalid={!!createForm.formState.errors.fullName}
            />
            {createForm.formState.errors.fullName && (
              <p className="text-sm text-destructive">
                {createForm.formState.errors.fullName.message}
              </p>
            )}
          </div>

          {/* Store */}
          <div className="space-y-2">
            <Label>
              Cửa hàng <span className="text-destructive">*</span>
            </Label>
            <Select
              value={createForm.watch("storeId")?.toString() || ""}
              onValueChange={(value) =>
                createForm.setValue("storeId", parseInt(value), {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className="w-full"
                aria-invalid={!!createForm.formState.errors.storeId}
              >
                <SelectValue placeholder="Chọn cửa hàng" />
              </SelectTrigger>
              <SelectContent>
                {storesData?.items
                  ?.filter((s) => s.isActive)
                  .map((store) => (
                    <SelectItem key={store.id} value={store.id.toString()}>
                      {store.name} ({store.code})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {createForm.formState.errors.storeId && (
              <p className="text-sm text-destructive">
                {createForm.formState.errors.storeId.message}
              </p>
            )}
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Mật khẩu sẽ được tạo tự động và gửi đến email của nhân viên.
            </p>
          </div>
        </form>
      )}

      {/* Edit Form */}
      {isEdit && (
        <form
          id="staff-form"
          onSubmit={updateForm.handleSubmit(handleUpdateSubmit)}
          className="space-y-5"
        >
          {/* Show email (readonly) */}
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="flex h-9 items-center rounded-md border bg-muted px-3">
              <span className="text-sm">{staff?.email}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Email không thể thay đổi
            </p>
          </div>

          {/* Show phone (readonly) */}
          <div className="space-y-2">
            <Label>Số điện thoại</Label>
            <div className="flex h-9 items-center rounded-md border bg-muted px-3">
              <span className="text-sm">{staff?.phone}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Số điện thoại không thể thay đổi
            </p>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="editFullName">
              Họ và tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="editFullName"
              placeholder="Nhập họ và tên nhân viên"
              {...updateForm.register("fullName")}
              aria-invalid={!!updateForm.formState.errors.fullName}
            />
            {updateForm.formState.errors.fullName && (
              <p className="text-sm text-destructive">
                {updateForm.formState.errors.fullName.message}
              </p>
            )}
          </div>

          {/* Store */}
          <div className="space-y-2">
            <Label>
              Cửa hàng <span className="text-destructive">*</span>
            </Label>
            <Select
              value={updateForm.watch("storeId")?.toString() || ""}
              onValueChange={(value) =>
                updateForm.setValue("storeId", parseInt(value), {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className="w-full"
                aria-invalid={!!updateForm.formState.errors.storeId}
              >
                <SelectValue placeholder="Chọn cửa hàng" />
              </SelectTrigger>
              <SelectContent>
                {storesData?.items
                  ?.filter((s) => s.isActive)
                  .map((store) => (
                    <SelectItem key={store.id} value={store.id.toString()}>
                      {store.name} ({store.code})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {updateForm.formState.errors.storeId && (
              <p className="text-sm text-destructive">
                {updateForm.formState.errors.storeId.message}
              </p>
            )}
          </div>

          {/* Status toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Trạng thái hoạt động</Label>
              <p className="text-sm text-muted-foreground">
                {updateForm.watch("isActive")
                  ? "Nhân viên đang hoạt động"
                  : "Nhân viên đã vô hiệu hóa"}
              </p>
            </div>
            <Switch
              id="isActive"
              checked={updateForm.watch("isActive")}
              onCheckedChange={(checked) =>
                updateForm.setValue("isActive", checked)
              }
            />
          </div>
        </form>
      )}
    </ModalLayout>
  );
};

export default StaffModal;
