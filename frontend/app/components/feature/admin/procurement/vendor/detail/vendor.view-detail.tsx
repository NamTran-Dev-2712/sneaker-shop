import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ArrowLeft,
  Edit,
  Package,
  Plus,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Clock,
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
import { EmptyList } from "~/components/common/shared/empty-list";
import {
  useVendorDetail,
  useRemoveVendorSellableItem,
} from "~/hooks/react-query/use-vendor.query";
import { formatCurrency } from "~/common/helpers/format-currency.helper";
import { VendorModal } from "../management/vendor.modal";
import { AddSellableItemModal } from "./add-sellable-item.modal";
import { EditVendorPriceModal } from "./edit-vendor-price.modal";
import type {
  VendorItem,
  VendorPriceDetail,
} from "~/services/procurement/vendor/dto/get-vendor/get-vendor.response";
import type { UpdateVendorRequest } from "~/services/procurement/vendor/dto/update-vendor/update-vendor.request";
import type { CreateVendorRequest } from "~/services/procurement/vendor/dto/create-vendor/create-vendor.request";
import { useUpdateVendor } from "~/hooks/react-query/use-vendor.query";

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
};

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
};

export const VendorViewDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const vendorId = parseInt(params.id || "0");

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSellableModalOpen, setIsAddSellableModalOpen] = useState(false);
  const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVendorPrice, setSelectedVendorPrice] =
    useState<VendorPriceDetail | null>(null);

  // React Query hooks
  const { data: vendor, isLoading, error } = useVendorDetail(vendorId);
  const updateMutation = useUpdateVendor();
  const removeSellableMutation = useRemoveVendorSellableItem();

  const handleBack = useCallback(() => {
    navigate("/admin/vendors");
  }, [navigate]);

  const handleEditVendor = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handleAddSellable = useCallback(() => {
    setIsAddSellableModalOpen(true);
  }, []);

  const handleEditPrice = useCallback((item: VendorPriceDetail) => {
    setSelectedVendorPrice(item);
    setIsEditPriceModalOpen(true);
  }, []);

  const handleDeletePrice = useCallback((item: VendorPriceDetail) => {
    setSelectedVendorPrice(item);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedVendorPrice) {
      await removeSellableMutation.mutateAsync({
        vendorId,
        vendorPriceId: selectedVendorPrice.id,
      });
      setIsDeleteDialogOpen(false);
      setSelectedVendorPrice(null);
    }
  }, [selectedVendorPrice, vendorId, removeSellableMutation]);

  const handleVendorModalSubmit = useCallback(
    async (formData: UpdateVendorRequest) => {
      await updateMutation.mutateAsync(formData);
      setIsEditModalOpen(false);
    },
    [updateMutation],
  );

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
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !vendor) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Không tìm thấy nhà cung cấp hoặc có lỗi xảy ra
        </p>
        <Button variant="outline" className="mt-4" onClick={handleBack}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  // Convert to VendorItem for modal
  const vendorForModal: VendorItem = {
    id: vendor.id,
    name: vendor.name,
    phone: vendor.phone,
    email: vendor.email,
    address: vendor.address,
    isActive: vendor.isActive,
    productCount: vendor.vendorPrices.length,
    createdAt: vendor.createdAt,
  };

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
                {vendor.name}
              </h1>
              <Badge variant={vendor.isActive ? "success" : "secondary"}>
                {vendor.isActive ? "Hoạt động" : "Ngừng hoạt động"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Mã nhà cung cấp: #{vendor.id}
            </p>
          </div>
        </div>
        <Button onClick={handleEditVendor}>
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin nhà cung cấp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{vendor.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Số điện thoại
                    </p>
                    <p className="font-medium">{vendor.phone}</p>
                  </div>
                </div>
                {vendor.address && (
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Địa chỉ</p>
                      <p className="font-medium">{vendor.address}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày tạo</p>
                    <p className="font-medium">
                      {formatDateTime(vendor.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Cập nhật lần cuối
                    </p>
                    <p className="font-medium">
                      {formatDateTime(vendor.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Prices Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Danh sách giá sản phẩm
                </CardTitle>
                <Button size="sm" onClick={handleAddSellable}>
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm sản phẩm
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {vendor.vendorPrices.length === 0 ? (
                <EmptyList
                  icon={Package}
                  title="Chưa có sản phẩm"
                  description="Nhà cung cấp này chưa có sản phẩm nào được thêm."
                  actionLabel="Thêm sản phẩm"
                  onAction={handleAddSellable}
                  className="py-8"
                />
              ) : (
                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="text-right">Giá nhập</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Hiệu lực
                        </TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendor.vendorPrices.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm line-clamp-1">
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
                          <TableCell className="hidden sm:table-cell">
                            <div className="text-xs">
                              <p>Từ: {formatDate(item.effectiveFrom)}</p>
                              {item.effectiveTo && (
                                <p>Đến: {formatDate(item.effectiveTo)}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.isCurrentlyEffective ? (
                              <Badge variant="success">Hiệu lực</Badge>
                            ) : (
                              <Badge variant="secondary">Hết hạn</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEditPrice(item)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDeletePrice(item)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Statistics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Tổng đơn hàng</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {vendor.totalPurchaseOrders}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-amber-50">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <span className="text-sm">Đơn chờ xử lý</span>
                </div>
                <span className="text-2xl font-bold text-amber-600">
                  {vendor.pendingPurchaseOrders}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Số sản phẩm</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {vendor.vendorPrices.length}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleAddSellable}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm sản phẩm mới
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  navigate(`/admin/purchase-orders/create?vendorId=${vendorId}`)
                }
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Tạo đơn nhập hàng
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Vendor Modal */}
      <VendorModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={
          handleVendorModalSubmit as (
            data: CreateVendorRequest | UpdateVendorRequest,
          ) => Promise<void>
        }
        vendor={vendorForModal}
        isLoading={updateMutation.isPending}
      />

      {/* Add Sellable Item Modal */}
      <AddSellableItemModal
        open={isAddSellableModalOpen}
        onOpenChange={setIsAddSellableModalOpen}
        vendorId={vendorId}
        existingSellableIds={vendor.vendorPrices.map((p) => p.sellableItemId)}
      />

      {/* Edit Vendor Price Modal */}
      <EditVendorPriceModal
        open={isEditPriceModalOpen}
        onOpenChange={setIsEditPriceModalOpen}
        vendorId={vendorId}
        vendorPrice={selectedVendorPrice}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa giá sản phẩm "
              {selectedVendorPrice?.productName}" khỏi nhà cung cấp này? Hành
              động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeSellableMutation.isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VendorViewDetail;
