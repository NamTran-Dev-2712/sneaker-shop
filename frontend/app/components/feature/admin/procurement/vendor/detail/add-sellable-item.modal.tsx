import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Search, Package, CalendarIcon, Check } from "lucide-react";
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
import { Skeleton } from "~/components/ui/skeleton";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { useSellableItemSearch } from "~/hooks/react-query/use-sellable-item.query";
import { useAddVendorSellableItem } from "~/hooks/react-query/use-vendor.query";
import type { AllSellableItemResult } from "~/services/shop/sellable-item/dto/get-sellable-item/get-sellable-item.response";
import {
  formatCurrency,
  formatNumber,
  parseCurrency,
} from "~/common/helpers/format-currency.helper";
import { SellableType } from "~/types/entities/sellable.type";

// Form schema for price entry
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

interface AddSellableItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorId: number;
  existingSellableIds: number[]; // IDs of sellable items already added to this vendor
}

type Step = "search" | "price";

export const AddSellableItemModal = ({
  open,
  onOpenChange,
  vendorId,
  existingSellableIds,
}: AddSellableItemModalProps) => {
  const [step, setStep] = useState<Step>("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] =
    useState<AllSellableItemResult | null>(null);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // React Query hooks
  const { data: sellableItems, isLoading: isSearching } =
    useSellableItemSearch(debouncedSearch);
  const addMutation = useAddVendorSellableItem();

  // Filter out already added items
  const availableItems = useMemo(() => {
    if (!sellableItems) return [];
    return sellableItems.filter(
      (item) => !existingSellableIds.includes(item.id),
    );
  }, [sellableItems, existingSellableIds]);

  // Form for price entry
  const form = useForm<PriceFormValues>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: {
      price: 0,
      effectiveFrom: new Date(),
      effectiveTo: null,
    },
  });

  // State for formatted price display
  const [priceDisplay, setPriceDisplay] = useState("");

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const numericValue = parseCurrency(rawValue) ?? 0;
      setPriceDisplay(rawValue === "" ? "" : formatNumber(numericValue));
      form.setValue("price", numericValue, { shouldValidate: true });
    },
    [form],
  );

  const handleSelectItem = useCallback(
    (item: AllSellableItemResult) => {
      setSelectedItem(item);
      // Pre-fill price if available
      if (item.retailPrice) {
        form.setValue("price", item.retailPrice);
        setPriceDisplay(formatNumber(item.retailPrice));
      } else {
        setPriceDisplay("");
      }
      setStep("price");
    },
    [form],
  );

  const handleBackToSearch = useCallback(() => {
    setStep("search");
    setSelectedItem(null);
    setPriceDisplay("");
    form.reset();
  }, [form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!selectedItem) return;

    await addMutation.mutateAsync({
      vendorId,
      data: {
        sellableItemId: selectedItem.id,
        price: data.price,
        effectiveFrom: data.effectiveFrom.toISOString(),
        effectiveTo: data.effectiveTo
          ? data.effectiveTo.toISOString()
          : undefined,
      },
    });

    // Reset and close
    setStep("search");
    setSearchTerm("");
    setDebouncedSearch("");
    setSelectedItem(null);
    setPriceDisplay("");
    form.reset();
    onOpenChange(false);
  });

  const handleClose = useCallback(
    (open: boolean) => {
      if (!open) {
        setStep("search");
        setSearchTerm("");
        setDebouncedSearch("");
        setSelectedItem(null);
        setPriceDisplay("");
        form.reset();
      }
      onOpenChange(open);
    },
    [form, onOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {step === "search"
              ? "Thêm sản phẩm vào nhà cung cấp"
              : "Nhập giá sản phẩm"}
          </DialogTitle>
        </DialogHeader>

        {step === "search" ? (
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            {/* Search Input */}
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên sản phẩm, SKU..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Search Results */}
            <ScrollArea className="flex-1 border rounded-lg min-h-0">
              {isSearching ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : availableItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Không tìm thấy sản phẩm phù hợp"
                      : "Nhập từ khóa để tìm kiếm sản phẩm"}
                  </p>
                  {existingSellableIds.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Đã lọc bỏ {existingSellableIds.length} sản phẩm đã có
                      trong danh sách
                    </p>
                  )}
                </div>
              ) : (
                <div className="divide-y">
                  {availableItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="w-full p-4 text-left hover:bg-muted/50 transition-colors flex items-center gap-4"
                      onClick={() => handleSelectItem(item)}
                    >
                      <div className="h-12 w-12 rounded bg-muted flex items-center justify-center shrink-0">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {item.productName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          SKU: {item.sku}
                          {item.colorName && ` • ${item.colorName}`}
                          {item.sizeName && ` • Size ${item.sizeName}`}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge
                          variant={
                            item.type === SellableType.SNEAKER_VARIANT
                              ? "default"
                              : "secondary"
                          }
                        >
                          {item.type === SellableType.SNEAKER_VARIANT
                            ? "Giày"
                            : "Phụ kiện"}
                        </Badge>
                        {item.retailPrice && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatCurrency(item.retailPrice)}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        ) : (
          <ScrollArea className="flex-1 min-h-0">
            <form onSubmit={handleSubmit} className="space-y-6 px-1">
              {/* Selected Item Info */}
              {selectedItem && (
                <div className="p-4 rounded-lg bg-muted/50 flex items-center gap-4">
                  <div className="h-12 w-12 rounded bg-background flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {selectedItem.productName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      SKU: {selectedItem.sku}
                      {selectedItem.colorName && ` • ${selectedItem.colorName}`}
                      {selectedItem.sizeName &&
                        ` • Size ${selectedItem.sizeName}`}
                    </p>
                  </div>
                  <Badge
                    variant={
                      selectedItem.type === SellableType.SNEAKER_VARIANT
                        ? "default"
                        : "secondary"
                    }
                  >
                    {selectedItem.type === SellableType.SNEAKER_VARIANT
                      ? "Giày"
                      : "Phụ kiện"}
                  </Badge>
                </div>
              )}

              {/* Price Input */}
              <div className="space-y-2">
                <Label htmlFor="price">Giá nhập (VNĐ) *</Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="text"
                    inputMode="numeric"
                    value={priceDisplay}
                    onChange={handlePriceChange}
                    placeholder="Nhập giá nhập từ nhà cung cấp"
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    ₫
                  </span>
                </div>
                {form.formState.errors.price && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.price.message}
                  </p>
                )}
                {selectedItem?.retailPrice && (
                  <p className="text-xs text-muted-foreground">
                    Giá bán lẻ hiện tại:{" "}
                    {formatCurrency(selectedItem.retailPrice)}
                  </p>
                )}
              </div>

              {/* Effective From */}
              <div className="space-y-2">
                <Label>Ngày bắt đầu hiệu lực *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
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
                  <p className="text-sm text-destructive">
                    {form.formState.errors.effectiveFrom.message}
                  </p>
                )}
              </div>

              {/* Effective To (Optional) */}
              <div className="space-y-2">
                <Label>Ngày kết thúc hiệu lực (tùy chọn)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
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
                {form.formState.errors.effectiveTo && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.effectiveTo.message}
                  </p>
                )}
                {form.watch("effectiveTo") && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => form.setValue("effectiveTo", null)}
                    className="text-xs"
                  >
                    Xóa ngày kết thúc
                  </Button>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToSearch}
                >
                  Quay lại
                </Button>
                <Button type="submit" disabled={addMutation.isPending}>
                  {addMutation.isPending ? "Đang thêm..." : "Thêm sản phẩm"}
                </Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
