import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Store,
  Building2,
  Calendar,
  Clock,
  FileText,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  ArrowRight,
  ShoppingCart,
  PackageCheck,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Separator } from "~/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  usePurchaseOrderDetail,
  useUpdatePurchaseOrderStatus,
  useDeletePurchaseOrder,
} from "~/hooks/react-query/use-purchase-order.query";
import {
  PurchaseOrderStatusBadge,
  getValidNextStatuses,
  getPurchaseStatusLabel,
} from "../management/purchase-order.status-badge";
import { formatCurrency } from "~/common/helpers/format-currency.helper";
import { PurchaseStatus } from "~/types/entities/purchase-order.type";
import { SellableType } from "~/types/entities/sellable.type";

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
};

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
};

// Status timeline component
const StatusTimeline = ({
  currentStatus,
}: {
  currentStatus: PurchaseStatus;
}) => {
  const steps = [
    { status: PurchaseStatus.CREATED, label: "Đã tạo", icon: FileText },
    {
      status: PurchaseStatus.ORDERED,
      label: "Đã đặt hàng",
      icon: ShoppingCart,
    },
    {
      status: PurchaseStatus.RECEIVED,
      label: "Đã nhận hàng",
      icon: PackageCheck,
    },
  ];

  const currentIndex = steps.findIndex((s) => s.status === currentStatus);
  const isCancelled = currentStatus === PurchaseStatus.CANCELLED;

  return (
    <div className="py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
          style={{
            width: isCancelled
              ? "0%"
              : `${(currentIndex / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = !isCancelled && index <= currentIndex;
          const isCurrent = step.status === currentStatus;

          return (
            <div
              key={step.status}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                  ${
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-muted text-muted-foreground"
                  }
                  ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}
                `}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {isCancelled && (
        <div className="mt-4 flex items-center justify-center gap-2 text-destructive">
          <XCircle className="h-5 w-5" />
          <span className="font-medium">Đơn hàng đã bị hủy</span>
        </div>
      )}
    </div>
  );
};

export const PurchaseOrderViewDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const orderId = parseInt(params.id || "0");

  // Dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<PurchaseStatus | null>(null);

  // React Query hooks
  const { data: order, isLoading, error } = usePurchaseOrderDetail(orderId);
  const updateStatusMutation = useUpdatePurchaseOrderStatus();
  const deleteMutation = useDeletePurchaseOrder();

  const handleBack = useCallback(() => {
    navigate("/admin/purchase-orders");
  }, [navigate]);

  const handleEdit = useCallback(() => {
    navigate(`/admin/purchase-orders/${orderId}/edit`);
  }, [navigate, orderId]);

  const handleStatusChange = useCallback((status: PurchaseStatus) => {
    setNextStatus(status);
    setIsStatusDialogOpen(true);
  }, []);

  const handleConfirmStatusChange = useCallback(async () => {
    if (nextStatus) {
      await updateStatusMutation.mutateAsync({
        id: orderId,
        data: { id: orderId, newStatus: nextStatus },
      });
      setIsStatusDialogOpen(false);
      setNextStatus(null);
    }
  }, [nextStatus, orderId, updateStatusMutation]);

  const handleConfirmDelete = useCallback(async () => {
    await deleteMutation.mutateAsync(orderId);
    setIsDeleteDialogOpen(false);
    navigate("/admin/purchase-orders");
  }, [orderId, deleteMutation, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Không tìm thấy đơn nhập hàng hoặc có lỗi xảy ra
        </p>
        <Button variant="outline" className="mt-4" onClick={handleBack}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const validNextStatuses = getValidNextStatuses(order.status);
  const canEdit = order.status === PurchaseStatus.CREATED;
  const canDelete = order.status === PurchaseStatus.CREATED;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Đơn nhập hàng #{order.id}
              </h1>
              <PurchaseOrderStatusBadge status={order.status} />
            </div>
            <p className="text-muted-foreground text-sm">
              Tạo ngày {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          )}
          {canDelete && (
            <Button
              variant="outline"
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa
            </Button>
          )}
        </div>
      </div>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tiến trình đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <StatusTimeline currentStatus={order.status} />

          {/* Status Actions */}
          {validNextStatuses.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Cập nhật trạng thái:
              </p>
              <div className="flex flex-wrap gap-2">
                {validNextStatuses.map((status) => (
                  <Button
                    key={status}
                    variant={
                      status === PurchaseStatus.CANCELLED
                        ? "outline"
                        : "default"
                    }
                    size="sm"
                    onClick={() => handleStatusChange(status)}
                    className={
                      status === PurchaseStatus.CANCELLED
                        ? "text-destructive border-destructive hover:bg-destructive hover:text-white"
                        : ""
                    }
                  >
                    <ArrowRight className="h-4 w-4 mr-1" />
                    {getPurchaseStatusLabel(status)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Danh sách sản phẩm ({order.itemCount} sản phẩm)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="text-center">SL</TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm line-clamp-1">
                              {item.sellableItemName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              SKU: {item.sku}
                              {item.colorName && ` • ${item.colorName}`}
                              {item.sizeName && ` • Size ${item.sizeName}`}
                            </p>
                          </div>
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
                  </TableBody>
                </Table>
              </div>

              {/* Total */}
              <div className="mt-4 flex justify-end">
                <div className="w-full sm:w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Số lượng sản phẩm:
                    </span>
                    <span className="font-medium">{order.itemCount}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Tổng tiền:</span>
                    <span className="font-bold text-lg text-primary">
                      {formatCurrency(order.totalCost)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Note */}
          {order.note && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ghi chú</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {order.note}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Vendor Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nhà cung cấp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{order.vendorName}</p>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => navigate(`/admin/vendors/${order.vendorId}`)}
                  >
                    Xem chi tiết →
                  </Button>
                </div>
              </div>
              {order.vendorEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{order.vendorEmail}</span>
                </div>
              )}
              {order.vendorPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{order.vendorPhone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Store Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cửa hàng nhận</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Store className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{order.storeName}</p>
                  <p className="text-xs text-muted-foreground">
                    Mã: #{order.storeId}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.expectedAt && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Ngày dự kiến nhận
                    </p>
                    <p className="font-medium">
                      {formatDate(order.expectedAt)}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Cập nhật lần cuối
                  </p>
                  <p className="font-medium">
                    {formatDateTime(order.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Change Dialog */}
      <AlertDialog
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận cập nhật trạng thái</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn chuyển trạng thái đơn hàng từ{" "}
              <span className="font-semibold">
                {getPurchaseStatusLabel(order.status)}
              </span>{" "}
              sang{" "}
              <span className="font-semibold">
                {nextStatus && getPurchaseStatusLabel(nextStatus)}
              </span>
              ?
              {nextStatus === PurchaseStatus.RECEIVED && (
                <span className="block mt-2 text-green-600">
                  Sau khi nhận hàng, số lượng sẽ được cập nhật vào kho.
                </span>
              )}
              {nextStatus === PurchaseStatus.CANCELLED && (
                <span className="block mt-2 text-destructive">
                  Hành động này không thể hoàn tác.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmStatusChange}
              className={
                nextStatus === PurchaseStatus.CANCELLED
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {updateStatusMutation.isPending ? "Đang xử lý..." : "Xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa đơn hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đơn nhập hàng #{order.id}?
              <span className="block mt-2 text-destructive">
                Hành động này không thể hoàn tác.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Đang xóa..." : "Xóa đơn hàng"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PurchaseOrderViewDetail;
