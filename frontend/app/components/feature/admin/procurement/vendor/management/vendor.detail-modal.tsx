import { useState, useCallback } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Package, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { EmptyList } from "~/components/common/shared/empty-list";
import type {
  GetVendorDetailResponse,
  VendorPriceDetail,
} from "~/services/procurement/vendor/dto/get-vendor/get-vendor.response";
import { formatCurrency } from "~/common/helpers/format-currency.helper";

interface VendorDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: GetVendorDetailResponse | null | undefined;
  isLoading: boolean;
  onAddSellable: () => void;
  onEditSellable: (item: VendorPriceDetail) => void;
  onDeleteSellable: (item: VendorPriceDetail) => void;
  isDeleting: boolean;
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
};

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
};

export const VendorDetailModal = ({
  open,
  onOpenChange,
  data,
  isLoading,
  onAddSellable,
  onEditSellable,
  onDeleteSellable,
  isDeleting,
}: VendorDetailModalProps) => {
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  const handleDelete = useCallback(
    (item: VendorPriceDetail) => {
      setDeletingItemId(item.id);
      onDeleteSellable(item);
    },
    [onDeleteSellable],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Chi tiết nhà cung cấp</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </div>
        ) : data ? (
          <ScrollArea className="max-h-[calc(90vh-120px)]">
            <div className="space-y-6 pr-4">
              {/* Vendor Info */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{data.name}</h3>
                  <Badge variant={data.isActive ? "success" : "secondary"}>
                    {data.isActive ? "Hoạt động" : "Ngừng hoạt động"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{data.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Số điện thoại</p>
                    <p className="font-medium">{data.phone}</p>
                  </div>
                  {data.address && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Địa chỉ</p>
                      <p className="font-medium">{data.address}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Ngày tạo</p>
                    <p className="font-medium">
                      {formatDateTime(data.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cập nhật lần cuối</p>
                    <p className="font-medium">
                      {formatDateTime(data.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {data.totalPurchaseOrders}
                  </p>
                  <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 text-center">
                  <p className="text-2xl font-bold text-amber-600">
                    {data.pendingPurchaseOrders}
                  </p>
                  <p className="text-sm text-muted-foreground">Đơn chờ xử lý</p>
                </div>
              </div>

              <Separator />

              {/* Vendor Prices / Sellable Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Danh sách giá sản phẩm</h4>
                  <Button size="sm" onClick={onAddSellable}>
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm sản phẩm
                  </Button>
                </div>

                {data.vendorPrices.length === 0 ? (
                  <EmptyList
                    icon={Package}
                    title="Chưa có sản phẩm"
                    description="Nhà cung cấp này chưa có sản phẩm nào được thêm."
                    actionLabel="Thêm sản phẩm"
                    onAction={onAddSellable}
                    className="py-8"
                  />
                ) : (
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sản phẩm</TableHead>
                          <TableHead className="text-right">Giá nhập</TableHead>
                          <TableHead>Hiệu lực</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.vendorPrices.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">
                                  {item.productName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  SKU: {item.sku} •{" "}
                                  {item.productType === "SNEAKER_VARIANT"
                                    ? "Giày"
                                    : "Phụ kiện"}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(item.price)}
                            </TableCell>
                            <TableCell>
                              <div className="text-xs">
                                <p>Từ: {formatDate(item.effectiveFrom)}</p>
                                {item.effectiveTo && (
                                  <p>Đến: {formatDate(item.effectiveTo)}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.isCurrentlyEffective ? (
                                <Badge variant="success" className="gap-1">
                                  <Check className="h-3 w-3" />
                                  Đang áp dụng
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="gap-1">
                                  <X className="h-3 w-3" />
                                  Hết hạn
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => onEditSellable(item)}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDelete(item)}
                                  disabled={
                                    isDeleting && deletingItemId === item.id
                                  }
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Không tìm thấy thông tin
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VendorDetailModal;
