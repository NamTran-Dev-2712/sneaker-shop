import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Package,
  CalendarIcon,
  Tag,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";
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
import { Badge } from "~/components/ui/badge";
import { Calendar } from "~/components/ui/calendar";
import { Separator } from "~/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { useUpdateVendorSellableItem } from "~/hooks/react-query/use-vendor.query";
import type { VendorPriceDetail } from "~/services/procurement/vendor/dto/get-vendor/get-vendor.response";
import {
  formatCurrency,
  formatNumber,
  parseCurrency,
} from "~/common/helpers/format-currency.helper";

// Form schema
const priceFormSchema = z
  .object({
    price: z.number().positive("Giá phải lớn hơn 0"),
    effectiveFrom: z.date(),
    effectiveTo: z.date().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.effectiveTo && data.effectiveFrom) {
        return data.effectiveTo > data.effectiveFrom;
      }
      return true;
    },
    {
      message: "Ngày kết thúc phải sau ngày bắt đầu",
      path: ["effectiveTo"],
    },
  );

type PriceFormValues = z.infer<typeof priceFormSchema>;

interface EditVendorPriceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorId: number;
  vendorPrice: VendorPriceDetail | null;
}

export const EditVendorPriceModal = ({
  open,
  onOpenChange,
  vendorId,
  vendorPrice,
}: EditVendorPriceModalProps) => {
  const updateMutation = useUpdateVendorSellableItem();
  const [priceDisplay, setPriceDisplay] = useState("");

  const form = useForm<PriceFormValues>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: {
      price: 0,
      effectiveFrom: new Date(),
      effectiveTo: null,
    },
  });

  // Reset form when vendorPrice changes
  useEffect(() => {
    if (vendorPrice) {
      form.reset({
        price: vendorPrice.price,
        effectiveFrom: new Date(vendorPrice.effectiveFrom),
        effectiveTo: vendorPrice.effectiveTo
          ? new Date(vendorPrice.effectiveTo)
          : null,
      });
      setPriceDisplay(formatNumber(vendorPrice.price));
    }
  }, [vendorPrice, form]);

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, "");
      const numValue = parseInt(rawValue) || 0;
      form.setValue("price", numValue, { shouldValidate: true });
      setPriceDisplay(rawValue ? formatNumber(numValue) : "");
    },
    [form],
  );

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!vendorPrice) return;

    await updateMutation.mutateAsync({
      vendorId,
      vendorPriceId: vendorPrice.id,
      data: {
        price: data.price,
        effectiveFrom: data.effectiveFrom.toISOString(),
        effectiveTo: data.effectiveTo
          ? data.effectiveTo.toISOString()
          : undefined,
      },
    });

    onOpenChange(false);
  });

  const handleClose = useCallback(
    (open: boolean) => {
      if (!open) {
        form.reset();
        setPriceDisplay("");
      }
      onOpenChange(open);
    },
    [form, onOpenChange],
  );

  if (!vendorPrice) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            Chỉnh sửa giá sản phẩm
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Info Card - Redesigned */}
          <div className="rounded-xl border bg-linear-to-br from-muted/30 to-muted/50 p-4 space-y-3">
            {/* Product Header */}
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-lg bg-background border shadow-sm flex items-center justify-center shrink-0">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p
                  className="font-semibold text-sm leading-tight line-clamp-2"
                  title={vendorPrice.productName}
                >
                  {vendorPrice.productName}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={
                      vendorPrice.productType === "SNEAKER_VARIANT"
                        ? "default"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {vendorPrice.productType === "SNEAKER_VARIANT"
                      ? "Giày"
                      : "Phụ kiện"}
                  </Badge>
                  <Badge
                    variant={
                      vendorPrice.isCurrentlyEffective ? "success" : "outline"
                    }
                    className="text-xs"
                  >
                    {vendorPrice.isCurrentlyEffective
                      ? "Đang hiệu lực"
                      : "Hết hạn"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-medium truncate" title={vendorPrice.sku}>
                  {vendorPrice.sku}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Giá hiện tại:</span>
                <span className="font-semibold text-primary">
                  {formatCurrency(vendorPrice.price)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Price Input */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Giá nhập mới (VNĐ) *
            </Label>
            <div className="relative">
              <Input
                id="price"
                type="text"
                inputMode="numeric"
                value={priceDisplay}
                onChange={handlePriceChange}
                placeholder="Nhập giá nhập mới"
                className="pr-12 text-base font-medium h-11"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                ₫
              </span>
            </div>
            {form.formState.errors.price && (
              <p className="text-xs text-destructive">
                {form.formState.errors.price.message}
              </p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            {/* Effective From */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Bắt đầu *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10",
                      !form.watch("effectiveFrom") && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("effectiveFrom")
                      ? format(form.watch("effectiveFrom"), "dd/MM/yyyy", {
                          locale: vi,
                        })
                      : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch("effectiveFrom")}
                    onSelect={(date) =>
                      date && form.setValue("effectiveFrom", date)
                    }
                    initialFocus
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.effectiveFrom && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.effectiveFrom.message}
                </p>
              )}
            </div>

            {/* Effective To */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Kết thúc
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10",
                      !form.watch("effectiveTo") && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("effectiveTo")
                      ? format(
                          form.watch("effectiveTo") as Date,
                          "dd/MM/yyyy",
                          { locale: vi },
                        )
                      : "Không giới hạn"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch("effectiveTo") ?? undefined}
                    onSelect={(date) =>
                      form.setValue("effectiveTo", date ?? null)
                    }
                    initialFocus
                    locale={vi}
                    disabled={(date) =>
                      form.watch("effectiveFrom")
                        ? date <= form.watch("effectiveFrom")
                        : false
                    }
                  />
                </PopoverContent>
              </Popover>
              {form.watch("effectiveTo") && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => form.setValue("effectiveTo", null)}
                  className="text-xs h-6 px-2 mt-1"
                >
                  Xóa ngày kết thúc
                </Button>
              )}
              {form.formState.errors.effectiveTo && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.effectiveTo.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              className="flex-1 sm:flex-none"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 sm:flex-none"
            >
              {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
