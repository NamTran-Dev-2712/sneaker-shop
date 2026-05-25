import { useEffect, useState, useMemo, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, Plus, Trash2, Search, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Calendar } from "~/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import {
  useAllVendors,
  useVendorSellableItems,
} from "~/hooks/react-query/use-vendor.query";
import { useAllStores } from "~/hooks/react-query/use-store.query";
import { formatCurrency } from "~/common/helpers/format-currency.helper";
import type { GetPurchaseOrderDetailResponse } from "~/services/procurement/purchase-order/dto/get-purchase-order/get-purchase-order.response";
import type { VendorSellableItem } from "~/services/procurement/vendor/dto/get-vendor/get-vendor.response";
import { SortSellableItemBy } from "~/types/global/filter/sort-by.filter";
import { SortOrder } from "~/types/global/filter/sort-order.filter";

const purchaseOrderItemSchema = z.object({
  id: z.number().optional(),
  sellableItemId: z.number().min(1, "Vui lòng chọn sản phẩm"),
  sellableItemName: z.string().optional(),
  sku: z.string().optional(),
  quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
  unitCost: z.number().min(0, "Đơn giá phải >= 0"),
});

const purchaseOrderSchema = z.object({
  vendorId: z.number().min(1, "Vui lòng chọn nhà cung cấp"),
  storeId: z.number().min(1, "Vui lòng chọn cửa hàng"),
  expectedAt: z.date().optional(),
  note: z.string().optional(),
  items: z
    .array(purchaseOrderItemSchema)
    .min(1, "Vui lòng thêm ít nhất 1 sản phẩm"),
});

type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>;

interface PurchaseOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: GetPurchaseOrderDetailResponse;
  onSubmit: (data: PurchaseOrderFormData) => void;
  isSubmitting: boolean;
}

export const PurchaseOrderModal = ({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isSubmitting,
}: PurchaseOrderModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSellableSearch, setShowSellableSearch] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      vendorId: 0,
      storeId: 0,
      expectedAt: undefined,
      note: "",
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedVendorId = watch("vendorId");
  const watchedItems = watch("items");

  // Fetch data
  const { data: vendorsData } = useAllVendors();
  const { data: storesData } = useAllStores();
  const { data: vendorSellableItems, isLoading: isLoadingSellables } =
    useVendorSellableItems(watchedVendorId, {
      pageNumber: 1,
      pageSize: 100,
      search: searchTerm,
      isCurrentlyEffective: true,
      sortBy: SortSellableItemBy.EFFECTIVE_FROM,
      sortOrder: SortOrder.DESC,
    });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        reset({
          vendorId: initialData.vendorId,
          storeId: initialData.storeId,
          expectedAt: initialData.expectedAt
            ? new Date(initialData.expectedAt)
            : undefined,
          note: initialData.note || "",
          items: initialData.items.map((item) => ({
            id: item.id,
            sellableItemId: item.sellableItemId,
            sellableItemName: item.sellableItemName,
            sku: item.sku,
            quantity: item.quantity,
            unitCost: item.unitCost,
          })),
        });
      } else {
        reset({
          vendorId: 0,
          storeId: 0,
          expectedAt: undefined,
          note: "",
          items: [],
        });
      }
      setSearchTerm("");
      setShowSellableSearch(false);
    }
  }, [open, mode, initialData, reset]);

  // Filter out already added items
  const availableSellables = useMemo(() => {
    if (!vendorSellableItems?.items) return [];
    const addedIds = new Set(fields.map((f) => f.sellableItemId));
    return vendorSellableItems.items.filter(
      (item: VendorSellableItem) =>
        !addedIds.has(item.sellableItemId) && item.isCurrentlyEffective,
    );
  }, [vendorSellableItems?.items, fields]);

  // Calculate total
  const totalCost = useMemo(() => {
    return watchedItems.reduce((sum, item) => {
      return sum + (item.quantity || 0) * (item.unitCost || 0);
    }, 0);
  }, [watchedItems]);

  const handleAddItem = useCallback(
    (item: VendorSellableItem) => {
      append({
        sellableItemId: item.sellableItemId,
        sellableItemName: `${item.productName}${item.variantInfo ? ` - ${item.variantInfo.colorName} / ${item.variantInfo.sizeValue}` : ""}`,
        sku: item.sku,
        quantity: 1,
        unitCost: item.vendorPrice,
      });
      setShowSellableSearch(false);
      setSearchTerm("");
    },
    [append],
  );

  const handleFormSubmit = (data: PurchaseOrderFormData) => {
    onSubmit(data);
  };

  const handleVendorChange = (value: string) => {
    setValue("vendorId", Number(value));
    // Clear items when vendor changes in create mode
    if (mode !== "edit") {
      setValue("items", []);
    }
  };

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Chỉnh sửa đơn đặt hàng" : "Tạo đơn đặt hàng mới";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nhà cung cấp *</Label>
              <Controller
                control={control}
                name="vendorId"
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() || ""}
                    onValueChange={handleVendorChange}
                    disabled={isEditMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhà cung cấp" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendorsData?.map((vendor) => (
                        <SelectItem
                          key={vendor.id}
                          value={vendor.id.toString()}
                        >
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.vendorId && (
                <p className="text-sm text-destructive">
                  {errors.vendorId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Cửa hàng *</Label>
              <Controller
                control={control}
                name="storeId"
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() || ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                    disabled={isEditMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn cửa hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      {storesData?.items?.map((store) => (
                        <SelectItem key={store.id} value={store.id.toString()}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.storeId && (
                <p className="text-sm text-destructive">
                  {errors.storeId.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ngày dự kiến nhận hàng</Label>
              <Controller
                control={control}
                name="expectedAt"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: vi })
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                placeholder="Nhập ghi chú cho đơn hàng..."
                className="resize-none"
                {...register("note")}
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Danh sách sản phẩm *</Label>
              {watchedVendorId > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSellableSearch(!showSellableSearch)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm sản phẩm
                </Button>
              )}
            </div>

            {watchedVendorId === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Vui lòng chọn nhà cung cấp để thêm sản phẩm
              </p>
            )}

            {/* Sellable Search */}
            {showSellableSearch && watchedVendorId > 0 && (
              <div className="border rounded-lg p-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm sản phẩm theo tên, SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {isLoadingSellables ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span className="text-sm text-muted-foreground">
                      Đang tải...
                    </span>
                  </div>
                ) : availableSellables.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Không tìm thấy sản phẩm phù hợp
                  </p>
                ) : (
                  <div className="max-h-48 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>SKU</TableHead>
                          <TableHead>Tên sản phẩm</TableHead>
                          <TableHead className="text-right">Giá NCC</TableHead>
                          <TableHead className="w-20"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availableSellables
                          .slice(0, 10)
                          .map((item: VendorSellableItem) => (
                            <TableRow key={item.sellableItemId}>
                              <TableCell className="font-mono text-sm">
                                {item.sku}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <span className="font-medium">
                                    {item.productName}
                                  </span>
                                  {item.variantInfo && (
                                    <span className="text-sm text-muted-foreground ml-1">
                                      - {item.variantInfo.colorName} /{" "}
                                      {item.variantInfo.sizeValue}
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(item.vendorPrice)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleAddItem(item)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}

            {/* Selected Items Table */}
            {fields.length > 0 && (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">SKU</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="w-28">Số lượng</TableHead>
                      <TableHead className="w-36">Đơn giá</TableHead>
                      <TableHead className="text-right w-28">
                        Thành tiền
                      </TableHead>
                      <TableHead className="w-14"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const quantity = watchedItems[index]?.quantity || 0;
                      const unitCost = watchedItems[index]?.unitCost || 0;
                      const lineTotal = quantity * unitCost;

                      return (
                        <TableRow key={field.id}>
                          <TableCell className="font-mono text-sm">
                            {field.sku}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {field.sellableItemName}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={1}
                              {...register(`items.${index}.quantity`, {
                                valueAsNumber: true,
                              })}
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              {...register(`items.${index}.unitCost`, {
                                valueAsNumber: true,
                              })}
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(lineTotal)}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              className="text-destructive hover:text-destructive h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {/* Total Row */}
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-right font-semibold"
                      >
                        Tổng cộng:
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        {formatCurrency(totalCost)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}

            {errors.items?.root?.message && (
              <p className="text-sm text-destructive">
                {errors.items.root.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditMode ? "Cập nhật" : "Tạo đơn hàng"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseOrderModal;
