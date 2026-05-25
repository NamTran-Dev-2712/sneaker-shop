import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Search,
  Package,
  CalendarIcon,
  Store,
  Building2,
  ShoppingCart,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import {
  useAllVendors,
  useVendorSellableItems,
} from "~/hooks/react-query/use-vendor.query";
import { useAllStores } from "~/hooks/react-query/use-store.query";
import { useCreatePurchaseOrder } from "~/hooks/react-query/use-purchase-order.query";
import {
  formatCurrency,
  formatNumber,
  parseCurrency,
} from "~/common/helpers/format-currency.helper";
import type { VendorSellableItem } from "~/services/procurement/vendor/dto/get-vendor/get-vendor.response";
import { SortSellableItemBy } from "~/types/global/filter/sort-by.filter";
import { SortOrder } from "~/types/global/filter/sort-order.filter";

// Form schema
const createPurchaseOrderSchema = z.object({
  vendorId: z.number().positive("Vui lòng chọn nhà cung cấp"),
  storeId: z.number().positive("Vui lòng chọn cửa hàng"),
  expectedAt: z.date().optional().nullable(),
  note: z.string().optional(),
  items: z
    .array(
      z.object({
        sellableItemId: z.number(),
        sellableItemName: z.string(),
        sku: z.string(),
        colorName: z.string().optional(),
        sizeName: z.string().optional(),
        quantity: z.number().min(1, "Số lượng phải >= 1"),
        unitCost: z.number().min(0, "Đơn giá phải >= 0"),
      }),
    )
    .min(1, "Vui lòng thêm ít nhất 1 sản phẩm"),
});

type FormValues = z.infer<typeof createPurchaseOrderSchema>;

export const PurchaseOrderCreateForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedVendorId = searchParams.get("vendorId");

  // Local state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // React Query hooks
  const { data: vendors, isLoading: isLoadingVendors } = useAllVendors();
  const { data: stores, isLoading: isLoadingStores } = useAllStores();
  const createMutation = useCreatePurchaseOrder();

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(createPurchaseOrderSchema),
    defaultValues: {
      vendorId: preselectedVendorId ? parseInt(preselectedVendorId) : 0,
      storeId: 0,
      expectedAt: null,
      note: "",
      items: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedVendorId = form.watch("vendorId");

  // Get vendor's sellable items
  const { data: vendorSellableItems, isLoading: isLoadingSellables } =
    useVendorSellableItems(watchedVendorId || null, {
      pageNumber: 1,
      pageSize: 100,
      search: debouncedSearch,
      isCurrentlyEffective: true,
      sortBy: SortSellableItemBy.PRODUCT_NAME,
      sortOrder: SortOrder.ASC,
    });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(productSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [productSearch]);

  // Filter out already added items
  const availableProducts = useMemo(() => {
    if (!vendorSellableItems?.items) return [];
    const addedIds = fields.map((f) => f.sellableItemId);
    return vendorSellableItems.items.filter(
      (item) => !addedIds.includes(item.sellableItemId),
    );
  }, [vendorSellableItems, fields]);

  // Calculate totals
  const totals = useMemo(() => {
    const items = form.watch("items") || [];
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalCost = items.reduce(
      (sum, item) => sum + item.quantity * item.unitCost,
      0,
    );
    return { totalItems, totalCost };
  }, [form.watch("items")]);

  const handleBack = useCallback(() => {
    navigate("/admin/purchase-orders");
  }, [navigate]);

  const handleOpenProductModal = useCallback(() => {
    if (!watchedVendorId) {
      form.setError("vendorId", {
        message: "Vui lòng chọn nhà cung cấp trước",
      });
      return;
    }
    setProductSearch("");
    setDebouncedSearch("");
    setIsProductModalOpen(true);
  }, [watchedVendorId, form]);

  const handleAddProduct = useCallback(
    (item: VendorSellableItem) => {
      append({
        sellableItemId: item.sellableItemId,
        sellableItemName: item.productName,
        sku: item.sku,
        colorName: item.variantInfo?.colorName,
        sizeName: item.variantInfo?.sizeValue?.toString(),
        quantity: 1,
        unitCost: item.vendorPrice,
      });
      setIsProductModalOpen(false);
    },
    [append],
  );

  const handleQuantityChange = useCallback(
    (index: number, quantity: number) => {
      const item = fields[index];
      update(index, { ...item, quantity: Math.max(1, quantity) });
    },
    [fields, update],
  );

  const handleUnitCostChange = useCallback(
    (index: number, value: string) => {
      const item = fields[index];
      const numericValue = parseCurrency(value) ?? 0;
      update(index, { ...item, unitCost: Math.max(0, numericValue) });
    },
    [fields, update],
  );

  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await createMutation.mutateAsync({
      vendorId: data.vendorId,
      storeId: data.storeId,
      expectedAt: data.expectedAt ? data.expectedAt.toISOString() : undefined,
      note: data.note || undefined,
      items: data.items.map((item) => ({
        sellableItemId: item.sellableItemId,
        quantity: item.quantity,
        unitCost: item.unitCost,
      })),
    });

    if (result?.id) {
      navigate(`/admin/purchase-orders/${result.id}`);
    }
  });

  // Reset items when vendor changes
  useEffect(() => {
    if (watchedVendorId && fields.length > 0) {
      // Clear items when vendor changes (except on initial load with preselected)
      if (
        !preselectedVendorId ||
        watchedVendorId !== parseInt(preselectedVendorId)
      ) {
        form.setValue("items", []);
      }
    }
  }, [watchedVendorId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Tạo đơn nhập hàng
          </h1>
          <p className="text-muted-foreground text-sm">
            Tạo đơn nhập hàng mới từ nhà cung cấp
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Vendor Select */}
                  <div className="space-y-2">
                    <Label htmlFor="vendorId">Nhà cung cấp *</Label>
                    <Select
                      value={watchedVendorId?.toString() || ""}
                      onValueChange={(value) =>
                        form.setValue("vendorId", parseInt(value), {
                          shouldValidate: true,
                        })
                      }
                      disabled={isLoadingVendors}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhà cung cấp" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors?.map((vendor) => (
                          <SelectItem
                            key={vendor.id}
                            value={vendor.id.toString()}
                          >
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.vendorId && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.vendorId.message}
                      </p>
                    )}
                  </div>

                  {/* Store Select */}
                  <div className="space-y-2">
                    <Label htmlFor="storeId">Cửa hàng nhận *</Label>
                    <Select
                      value={form.watch("storeId")?.toString() || ""}
                      onValueChange={(value) =>
                        form.setValue("storeId", parseInt(value), {
                          shouldValidate: true,
                        })
                      }
                      disabled={isLoadingStores}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn cửa hàng" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores?.items?.map((store) => (
                          <SelectItem
                            key={store.id}
                            value={store.id.toString()}
                          >
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.storeId && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.storeId.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Expected Date */}
                  <div className="space-y-2">
                    <Label>Ngày dự kiến nhận (tùy chọn)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !form.watch("expectedAt") &&
                              "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.watch("expectedAt")
                            ? format(form.watch("expectedAt")!, "dd/MM/yyyy", {
                                locale: vi,
                              })
                            : "Chọn ngày"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={form.watch("expectedAt") || undefined}
                          onSelect={(date) =>
                            form.setValue("expectedAt", date || null)
                          }
                          initialFocus
                          locale={vi}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Note */}
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
                    <Textarea
                      id="note"
                      {...form.register("note")}
                      placeholder="Nhập ghi chú cho đơn hàng..."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Danh sách sản phẩm
                  </CardTitle>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleOpenProductModal}
                    disabled={!watchedVendorId}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm sản phẩm
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {fields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      {!watchedVendorId
                        ? "Vui lòng chọn nhà cung cấp trước"
                        : "Chưa có sản phẩm nào được thêm"}
                    </p>
                    {watchedVendorId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleOpenProductModal}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm sản phẩm
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sản phẩm</TableHead>
                          <TableHead className="w-[120px]">Số lượng</TableHead>
                          <TableHead className="w-[150px]">Đơn giá</TableHead>
                          <TableHead className="text-right">
                            Thành tiền
                          </TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm line-clamp-1">
                                  {field.sellableItemName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  SKU: {field.sku}
                                  {field.colorName && ` • ${field.colorName}`}
                                  {field.sizeName &&
                                    ` • Size ${field.sizeName}`}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min={1}
                                value={field.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    index,
                                    parseInt(e.target.value) || 1,
                                  )
                                }
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="text"
                                inputMode="numeric"
                                value={formatNumber(field.unitCost)}
                                onChange={(e) =>
                                  handleUnitCostChange(index, e.target.value)
                                }
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(field.quantity * field.unitCost)}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {form.formState.errors.items && (
                  <p className="text-sm text-destructive mt-2">
                    {form.formState.errors.items.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Summary */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Tổng kết đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Số sản phẩm:</span>
                    <span className="font-medium">{fields.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Tổng số lượng:
                    </span>
                    <span className="font-medium">{totals.totalItems}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Tổng tiền:</span>
                    <span className="font-bold text-lg text-primary">
                      {formatCurrency(totals.totalCost)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createMutation.isPending || fields.length === 0}
                  >
                    {createMutation.isPending
                      ? "Đang tạo..."
                      : "Tạo đơn nhập hàng"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleBack}
                  >
                    Hủy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Product Search Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>Chọn sản phẩm</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 flex-1 min-h-0">
            {/* Search Input */}
            <div className="relative shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên sản phẩm, SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Product List */}
            <ScrollArea className="flex-1 min-h-0 border rounded-lg">
              {isLoadingSellables ? (
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
              ) : availableProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {vendorSellableItems?.items?.length === 0
                      ? "Nhà cung cấp chưa có sản phẩm nào"
                      : "Tất cả sản phẩm đã được thêm vào đơn hàng"}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {availableProducts.map((item) => (
                    <button
                      key={item.vendorPriceId}
                      type="button"
                      className="w-full p-4 text-left hover:bg-muted/50 transition-colors flex items-center gap-4"
                      onClick={() => handleAddProduct(item)}
                    >
                      <div className="h-12 w-12 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {item.productName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          SKU: {item.sku}
                          {item.variantInfo?.colorName &&
                            ` • ${item.variantInfo.colorName}`}
                          {item.variantInfo?.sizeValue &&
                            ` • Size ${item.variantInfo.sizeValue}`}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge
                          variant={
                            item.productType === "SNEAKER_VARIANT"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {item.productType === "SNEAKER_VARIANT"
                            ? "Giày"
                            : "Phụ kiện"}
                        </Badge>
                        <p className="text-sm font-medium text-primary mt-1">
                          {formatCurrency(item.vendorPrice)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrderCreateForm;
