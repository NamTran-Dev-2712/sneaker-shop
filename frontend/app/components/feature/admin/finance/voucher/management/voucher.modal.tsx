import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Switch } from "~/components/ui/switch";
import { Spinner } from "~/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { DiscountType, VoucherScope } from "~/types/entities/voucher.type";
import type { VoucherItem } from "~/services/finance/voucher/dto/get-voucher/get-voucher.response";
import type { CreateVoucherRequest } from "~/services/finance/voucher/dto/create-voucher/create-voucher.request";
import type { UpdateVoucherRequest } from "~/services/finance/voucher/dto/update-voucher/update-voucher.request";

const voucherSchema = z
  .object({
    code: z
      .string()
      .min(3, "Mã voucher phải có ít nhất 3 ký tự")
      .max(50, "Mã voucher không được vượt quá 50 ký tự")
      .regex(
        /^[A-Z0-9_\-]+$/,
        "Mã voucher chỉ được chứa chữ hoa, số, dấu gạch dưới và gạch ngang",
      ),
    discountType: z.nativeEnum(DiscountType),
    discountValue: z
      .number({ message: "Vui lòng nhập giá trị giảm" })
      .positive("Giá trị giảm phải lớn hơn 0"),
    maxDiscount: z
      .number()
      .positive("Số tiền giảm tối đa phải lớn hơn 0")
      .optional(),
    minOrderTotal: z
      .number()
      .min(0, "Giá trị đơn hàng tối thiểu phải >= 0")
      .optional(),
    scope: z.nativeEnum(VoucherScope),
    usageLimit: z
      .number()
      .int()
      .positive("Giới hạn sử dụng phải lớn hơn 0")
      .optional(),
    usagePerCustomer: z
      .number()
      .int()
      .positive("Giới hạn sử dụng mỗi khách phải lớn hơn 0")
      .optional(),
    startsAt: z.string().optional(),
    endsAt: z.string().optional(),
    isActive: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.discountType === DiscountType.PERCENT) {
      if (typeof data.discountValue === "number" && data.discountValue > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["discountValue"],
          message: "Giá trị giảm theo phần trăm không được vượt quá 100",
        });
      }
      if (!data.maxDiscount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["maxDiscount"],
          message: "Số tiền giảm tối đa là bắt buộc khi giảm theo phần trăm",
        });
      }
    }
    if (data.startsAt && data.endsAt && data.startsAt >= data.endsAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endsAt"],
        message: "Ngày kết thúc phải sau ngày bắt đầu",
      });
    }
  });

type VoucherFormData = z.infer<typeof voucherSchema>;

interface VoucherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voucher: VoucherItem | null;
  onSubmit: (
    data: CreateVoucherRequest | UpdateVoucherRequest,
  ) => Promise<void>;
  isLoading: boolean;
}

const toLocalDateInput = (iso?: string) => {
  if (!iso) return "";
  return iso.slice(0, 10);
};

export const VoucherModal = ({
  open,
  onOpenChange,
  voucher,
  onSubmit,
  isLoading,
}: VoucherModalProps) => {
  const isEditing = voucher !== null;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      code: "",
      discountType: DiscountType.PERCENT,
      discountValue: 10,
      maxDiscount: undefined,
      minOrderTotal: undefined,
      scope: VoucherScope.ALL,
      usageLimit: undefined,
      usagePerCustomer: undefined,
      startsAt: "",
      endsAt: "",
      isActive: true,
    },
  });

  const discountType = watch("discountType");
  const isActive = watch("isActive");

  useEffect(() => {
    if (open) {
      if (voucher) {
        reset({
          code: voucher.code,
          discountType: voucher.discountType as DiscountType,
          discountValue: voucher.discountValue,
          maxDiscount: voucher.maxDiscount,
          minOrderTotal: voucher.minOrderTotal,
          scope: voucher.scope as VoucherScope,
          usageLimit: voucher.usageLimit,
          usagePerCustomer: voucher.usagePerCustomer,
          startsAt: toLocalDateInput(voucher.startsAt),
          endsAt: toLocalDateInput(voucher.endsAt),
          isActive: voucher.isActive,
        });
      } else {
        reset({
          code: "",
          discountType: DiscountType.PERCENT,
          discountValue: 10,
          maxDiscount: undefined,
          minOrderTotal: undefined,
          scope: VoucherScope.ALL,
          usageLimit: undefined,
          usagePerCustomer: undefined,
          startsAt: "",
          endsAt: "",
          isActive: true,
        });
      }
    }
  }, [open, voucher, reset]);

  const handleFormSubmit = async (data: VoucherFormData) => {
    const toIso = (val?: string) =>
      val ? new Date(val).toISOString() : undefined;

    if (isEditing && voucher) {
      await onSubmit({
        id: voucher.id,
        discountType: data.discountType,
        discountValue: data.discountValue,
        maxDiscount:
          data.discountType === DiscountType.PERCENT
            ? data.maxDiscount
            : undefined,
        minOrderTotal: data.minOrderTotal,
        scope: data.scope,
        usageLimit: data.usageLimit,
        usagePerCustomer: data.usagePerCustomer,
        startsAt: toIso(data.startsAt),
        endsAt: toIso(data.endsAt),
        isActive: data.isActive,
      } as UpdateVoucherRequest);
    } else {
      await onSubmit({
        code: data.code.trim().toUpperCase(),
        discountType: data.discountType,
        discountValue: data.discountValue,
        maxDiscount:
          data.discountType === DiscountType.PERCENT
            ? data.maxDiscount
            : undefined,
        minOrderTotal: data.minOrderTotal,
        scope: data.scope,
        usageLimit: data.usageLimit,
        usagePerCustomer: data.usagePerCustomer,
        startsAt: toIso(data.startsAt),
        endsAt: toIso(data.endsAt),
        isActive: data.isActive,
      } as CreateVoucherRequest);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-140 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? `Chỉnh sửa voucher: ${voucher.code}`
              : "Thêm voucher mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Code - readonly when editing */}
          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="code">
                Mã voucher <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                placeholder="VD: SUMMER2025"
                {...register("code")}
                className={errors.code ? "border-destructive" : ""}
                style={{ textTransform: "uppercase" }}
              />
              {errors.code && (
                <p className="text-sm text-destructive">
                  {errors.code.message}
                </p>
              )}
            </div>
          )}

          {/* Discount Type & Value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Loại giảm giá <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="discountType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={
                        errors.discountType ? "border-destructive" : ""
                      }
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DiscountType.PERCENT}>
                        Phần trăm (%)
                      </SelectItem>
                      <SelectItem value={DiscountType.FIXED}>
                        Số tiền cố định (₫)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountValue">
                Giá trị giảm <span className="text-destructive">*</span>
              </Label>
              <Input
                id="discountValue"
                type="number"
                min={0}
                step={discountType === DiscountType.PERCENT ? 1 : 1000}
                placeholder={
                  discountType === DiscountType.PERCENT ? "10" : "50000"
                }
                {...register("discountValue", {
                  setValueAs: (v: unknown) =>
                    v === "" || v === undefined || v === null
                      ? undefined
                      : Number(v),
                })}
                className={errors.discountValue ? "border-destructive" : ""}
              />
              {errors.discountValue && (
                <p className="text-sm text-destructive">
                  {errors.discountValue.message}
                </p>
              )}
            </div>
          </div>

          {/* Max Discount - only for PERCENT */}
          {discountType === DiscountType.PERCENT && (
            <div className="space-y-2">
              <Label htmlFor="maxDiscount">
                Giảm tối đa (₫) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="maxDiscount"
                type="number"
                min={0}
                step={1000}
                placeholder="200000"
                {...register("maxDiscount", {
                  setValueAs: (v: unknown) =>
                    v === "" || v === undefined || v === null
                      ? undefined
                      : Number(v),
                })}
                className={errors.maxDiscount ? "border-destructive" : ""}
              />
              {errors.maxDiscount && (
                <p className="text-sm text-destructive">
                  {errors.maxDiscount.message}
                </p>
              )}
            </div>
          )}

          {/* Min Order Total & Scope */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minOrderTotal">Đơn hàng tối thiểu (₫)</Label>
              <Input
                id="minOrderTotal"
                type="number"
                min={0}
                step={1000}
                placeholder="Không giới hạn"
                {...register("minOrderTotal", {
                  setValueAs: (v: unknown) =>
                    v === "" || v === undefined || v === null
                      ? undefined
                      : Number(v),
                })}
                className={errors.minOrderTotal ? "border-destructive" : ""}
              />
              {errors.minOrderTotal && (
                <p className="text-sm text-destructive">
                  {errors.minOrderTotal.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>
                Phạm vi áp dụng <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="scope"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={errors.scope ? "border-destructive" : ""}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={VoucherScope.ALL}>
                        Tất cả kênh
                      </SelectItem>
                      <SelectItem value={VoucherScope.ONLINE}>
                        Online
                      </SelectItem>
                      <SelectItem value={VoucherScope.POS}>POS</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Usage limits */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Tổng lượt dùng</Label>
              <Input
                id="usageLimit"
                type="number"
                min={1}
                placeholder="Không giới hạn"
                {...register("usageLimit", {
                  setValueAs: (v: unknown) =>
                    v === "" || v === undefined || v === null
                      ? undefined
                      : Number(v),
                })}
                className={errors.usageLimit ? "border-destructive" : ""}
              />
              {errors.usageLimit && (
                <p className="text-sm text-destructive">
                  {errors.usageLimit.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="usagePerCustomer">Lượt dùng/khách</Label>
              <Input
                id="usagePerCustomer"
                type="number"
                min={1}
                placeholder="Không giới hạn"
                {...register("usagePerCustomer", {
                  setValueAs: (v: unknown) =>
                    v === "" || v === undefined || v === null
                      ? undefined
                      : Number(v),
                })}
                className={errors.usagePerCustomer ? "border-destructive" : ""}
              />
              {errors.usagePerCustomer && (
                <p className="text-sm text-destructive">
                  {errors.usagePerCustomer.message}
                </p>
              )}
            </div>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startsAt">Ngày bắt đầu</Label>
              <Input
                id="startsAt"
                type="date"
                {...register("startsAt")}
                className={errors.startsAt ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endsAt">Ngày kết thúc</Label>
              <Input
                id="endsAt"
                type="date"
                {...register("endsAt")}
                className={errors.endsAt ? "border-destructive" : ""}
              />
              {errors.endsAt && (
                <p className="text-sm text-destructive">
                  {errors.endsAt.message}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between py-2 border-t">
            <div className="space-y-0.5">
              <Label>Trạng thái</Label>
              <p className="text-sm text-muted-foreground">
                Voucher {isActive ? "sẽ được kích hoạt" : "sẽ bị vô hiệu hoá"}
              </p>
            </div>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

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

export default VoucherModal;
