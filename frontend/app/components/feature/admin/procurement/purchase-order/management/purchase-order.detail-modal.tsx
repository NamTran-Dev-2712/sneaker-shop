import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Check,
  ChevronRight,
  Loader2,
  Package,
  Printer,
  Truck,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";
import {
  PurchaseOrderStatusBadge,
  getValidNextStatuses,
  getPurchaseStatusLabel,
} from "./purchase-order.status-badge";
import { formatCurrency } from "~/common/helpers/format-currency.helper";
import { PurchaseStatus } from "~/types/entities/purchase-order.type";
import type { GetPurchaseOrderDetailResponse } from "~/services/procurement/purchase-order/dto/get-purchase-order/get-purchase-order.response";

interface PurchaseOrderDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: GetPurchaseOrderDetailResponse | undefined;
  isLoading: boolean;
  onUpdateStatus: (newStatus: PurchaseStatus) => void;
  isUpdatingStatus: boolean;
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
};

const formatDateOnly = (dateString: string | undefined) => {
  if (!dateString) return "Chưa xác định";
  return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
};

const StatusActionButton = ({
  status,
  onClick,
  disabled,
}: {
  status: PurchaseStatus;
  onClick: () => void;
  disabled: boolean;
}) => {
  const buttonConfig: Record<
    PurchaseStatus,
    {
      label: string;
      icon: React.ReactNode;
      variant: "default" | "outline" | "destructive";
    }
  > = {
    [PurchaseStatus.CREATED]: {
      label: "Tạo mới",
      icon: <Package className="h-4 w-4 mr-2" />,
      variant: "default",
    },
    [PurchaseStatus.ORDERED]: {
      label: "Đặt hàng",
      icon: <Truck className="h-4 w-4 mr-2" />,
      variant: "default",
    },
    [PurchaseStatus.RECEIVED]: {
      label: "Nhận hàng",
      icon: <Check className="h-4 w-4 mr-2" />,
      variant: "default",
    },
    [PurchaseStatus.CANCELLED]: {
      label: "Hủy đơn",
      icon: <XCircle className="h-4 w-4 mr-2" />,
      variant: "destructive",
    },
  };

  const config = buttonConfig[status];

  return (
    <Button
      variant={config.variant}
      size="sm"
      onClick={onClick}
      disabled={disabled}
    >
      {config.icon}
      {config.label}
    </Button>
  );
};

export const PurchaseOrderDetailModal = ({
  open,
  onOpenChange,
  data,
  isLoading,
  onUpdateStatus,
  isUpdatingStatus,
}: PurchaseOrderDetailModalProps) => {
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <Skeleton className="h-6 w-48" />
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
            <Skeleton className="h-48 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!data) return null;

  const validNextStatuses = getValidNextStatuses(data.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <span>Chi tiết đơn đặt hàng #{data.id}</span>
              <PurchaseOrderStatusBadge status={data.status} />
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nhà cung cấp</p>
              <p className="font-medium">{data.vendorName}</p>
              {data.vendorPhone && (
                <p className="text-sm text-muted-foreground">
                  {data.vendorPhone}
                </p>
              )}
              {data.vendorEmail && (
                <p className="text-sm text-muted-foreground">
                  {data.vendorEmail}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cửa hàng nhận</p>
              <p className="font-medium">{data.storeName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ngày dự kiến nhận</p>
              <p className="font-medium">{formatDateOnly(data.expectedAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ngày tạo</p>
              <p className="font-medium">{formatDate(data.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cập nhật lần cuối</p>
              <p className="font-medium">{formatDate(data.updatedAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng sản phẩm</p>
              <p className="font-medium">{data.itemCount} mặt hàng</p>
            </div>
          </div>

          {/* Note */}
          {data.note && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ghi chú</p>
              <p className="text-sm bg-muted p-3 rounded-lg">{data.note}</p>
            </div>
          )}

          <Separator />

          {/* Status Flow */}
          <div>
            <p className="text-sm font-medium mb-3">Luồng trạng thái</p>
            <div className="flex items-center gap-2 flex-wrap">
              {Object.values(PurchaseStatus).map((status, index, arr) => {
                const isCurrent = data.status === status;
                const isPast =
                  Object.values(PurchaseStatus).indexOf(data.status) >
                  Object.values(PurchaseStatus).indexOf(status);
                const isCancelled = data.status === PurchaseStatus.CANCELLED;

                return (
                  <div key={status} className="flex items-center gap-2">
                    <Badge
                      variant={
                        isCurrent ? "default" : isPast ? "secondary" : "outline"
                      }
                      className={
                        isCurrent
                          ? "bg-primary"
                          : isPast && !isCancelled
                            ? "bg-green-100 text-green-800"
                            : ""
                      }
                    >
                      {getPurchaseStatusLabel(status)}
                    </Badge>
                    {index < arr.length - 1 &&
                      status !== PurchaseStatus.CANCELLED && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Items Table */}
          <div>
            <p className="text-sm font-medium mb-3">Chi tiết sản phẩm</p>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">SKU</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead className="text-center">Số lượng</TableHead>
                    <TableHead className="text-right">Đơn giá</TableHead>
                    <TableHead className="text-right">Thành tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">
                        {item.sku}
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">
                            {item.sellableItemName}
                          </span>
                          {item.colorName && item.sizeName && (
                            <span className="text-sm text-muted-foreground ml-1">
                              - {item.colorName} / {item.sizeName}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.sellableType}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.unitCost)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.totalCost)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total Row */}
                  <TableRow>
                    <TableCell colSpan={5} className="text-right font-semibold">
                      Tổng cộng:
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg">
                      {formatCurrency(data.totalCost)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {/* Status Update Actions */}
          {validNextStatuses.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground mr-2">
                Chuyển trạng thái:
              </span>
              {isUpdatingStatus ? (
                <Button variant="outline" size="sm" disabled>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang cập nhật...
                </Button>
              ) : (
                validNextStatuses.map((status) => (
                  <StatusActionButton
                    key={status}
                    status={status}
                    onClick={() => onUpdateStatus(status)}
                    disabled={isUpdatingStatus}
                  />
                ))
              )}
            </div>
          )}

          <div className="flex-1" />

          <Button
            variant="outline"
            onClick={() => {
              // TODO: Implement print functionality
              window.print();
            }}
          >
            <Printer className="h-4 w-4 mr-2" />
            In đơn hàng
          </Button>

          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseOrderDetailModal;
