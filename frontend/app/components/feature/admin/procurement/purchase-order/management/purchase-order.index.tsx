import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
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
import { Pagination } from "~/components/common/shared/pagination";
import { PurchaseOrderFilter } from "./purchase-order.filter";
import { PurchaseOrderListItem } from "./purchase-order.list-item";
import { PurchaseOrderQuickStatistic } from "./purchase-order.quick-statistic";
import {
  usePurchaseOrderList,
  usePurchaseOrderStatistics,
  useDeletePurchaseOrder,
} from "~/hooks/react-query/use-purchase-order.query";
import type { GetPurchaseOrderRequest } from "~/services/procurement/purchase-order/dto/get-purchase-order/get-purchase-order.request";
import type { PurchaseOrderItem } from "~/services/procurement/purchase-order/dto/get-purchase-order/get-purchase-order.response";
import type { PurchaseStatus } from "~/types/entities/purchase-order.type";

const DEFAULT_PAGE_SIZE = 10;

export const PurchaseOrderManagementIndex = () => {
  const navigate = useNavigate();

  // Filter state
  const [search, setSearch] = useState("");
  const [vendorId, setVendorId] = useState<number | undefined>(undefined);
  const [storeId, setStoreId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<PurchaseStatus | undefined>(undefined);
  const [fromDate, setFromDate] = useState<string | undefined>(undefined);
  const [toDate, setToDate] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Modal states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PurchaseOrderItem | null>(
    null,
  );

  // Build request params
  const requestParams: GetPurchaseOrderRequest = {
    pageNumber: currentPage,
    pageSize: pageSize,
    search: search || undefined,
    vendorId: vendorId,
    storeId: storeId,
    status: status,
    fromDate: fromDate,
    toDate: toDate,
    sortBy: "createdAt",
    isSortDescending: true,
  };

  // Queries
  const { data: listData, isLoading: isLoadingList } =
    usePurchaseOrderList(requestParams);
  const { data: statisticsData, isLoading: isLoadingStatistics } =
    usePurchaseOrderStatistics();

  // Mutations
  const deleteMutation = useDeletePurchaseOrder();

  // Filter handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleVendorIdChange = useCallback((value: number | undefined) => {
    setVendorId(value);
    setCurrentPage(1);
  }, []);

  const handleStoreIdChange = useCallback((value: number | undefined) => {
    setStoreId(value);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback(
    (value: PurchaseStatus | undefined) => {
      setStatus(value);
      setCurrentPage(1);
    },
    [],
  );

  const handleFromDateChange = useCallback((value: string | undefined) => {
    setFromDate(value);
    setCurrentPage(1);
  }, []);

  const handleToDateChange = useCallback((value: string | undefined) => {
    setToDate(value);
    setCurrentPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setSearch("");
    setVendorId(undefined);
    setStoreId(undefined);
    setStatus(undefined);
    setFromDate(undefined);
    setToDate(undefined);
    setCurrentPage(1);
  }, []);

  // CRUD handlers - navigate to pages instead of modals
  const handleAdd = useCallback(() => {
    navigate("/admin/purchase-orders/create");
  }, [navigate]);

  const handleView = useCallback(
    (item: PurchaseOrderItem) => {
      navigate(`/admin/purchase-orders/${item.id}`);
    },
    [navigate],
  );

  const handleEdit = useCallback(
    (item: PurchaseOrderItem) => {
      navigate(`/admin/purchase-orders/${item.id}/edit`);
    },
    [navigate],
  );

  const handleDelete = useCallback((item: PurchaseOrderItem) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await deleteMutation.mutateAsync(itemToDelete.id);
      toast.success("Xóa đơn đặt hàng thành công");
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error("Xóa đơn đặt hàng thất bại");
    }
  }, [itemToDelete, deleteMutation]);

  // Pagination
  const totalItems = listData?.totalItems ?? 0;
  const totalPages = listData?.totalPages ?? 0;
  const hasPreviousPage = listData?.hasPreviousPage ?? false;
  const hasNextPage = listData?.hasNextPage ?? false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý đơn đặt hàng</h1>
          <p className="text-muted-foreground">
            Quản lý các đơn đặt hàng từ nhà cung cấp
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo đơn đặt hàng
        </Button>
      </div>

      {/* Statistics */}
      <PurchaseOrderQuickStatistic
        statistics={statisticsData ?? undefined}
        isLoading={isLoadingStatistics}
      />

      {/* Filters */}
      <PurchaseOrderFilter
        search={search}
        vendorId={vendorId}
        storeId={storeId}
        status={status}
        fromDate={fromDate}
        toDate={toDate}
        onSearchChange={handleSearchChange}
        onVendorIdChange={handleVendorIdChange}
        onStoreIdChange={handleStoreIdChange}
        onStatusChange={handleStatusChange}
        onFromDateChange={handleFromDateChange}
        onToDateChange={handleToDateChange}
        onReset={handleReset}
      />

      {/* List */}
      <PurchaseOrderListItem
        items={listData?.items}
        isLoading={isLoadingList}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      {/* Pagination */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đơn đặt hàng #{itemToDelete?.id}? Hành
              động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PurchaseOrderManagementIndex;
