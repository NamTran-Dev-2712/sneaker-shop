import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DeleteModal } from "~/components/common/modal/modal.delete";
import { Pagination } from "~/components/common/shared/pagination";
import { VoucherFilter } from "./voucher.filter";
import { VoucherListItem } from "./voucher.list-item";
import { VoucherModal } from "./voucher.modal";
import { VoucherQuickStatistic } from "./voucher.quick-statistic";
import {
  useVoucherList,
  useCreateVoucher,
  useUpdateVoucher,
  useToggleVoucherActive,
  useDeleteVoucher,
} from "~/hooks/react-query/use-voucher.query";
import type { VoucherItem } from "~/services/finance/voucher/dto/get-voucher/get-voucher.response";
import type { GetVoucherRequest } from "~/services/finance/voucher/dto/get-voucher/get-voucher.request";
import type { CreateVoucherRequest } from "~/services/finance/voucher/dto/create-voucher/create-voucher.request";
import type { UpdateVoucherRequest } from "~/services/finance/voucher/dto/update-voucher/update-voucher.request";
import {
  DiscountType,
  VoucherComputedStatus,
  VoucherScope,
} from "~/types/entities/voucher.type";
import { SortBy } from "~/types/global/filter/sort-by.filter";
import { SortOrder } from "~/types/global/filter/sort-order.filter";

export const VoucherIndex = () => {
  const [query, setQuery] = useState<GetVoucherRequest>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    status: undefined,
    scope: undefined,
    discountType: undefined,
    sortBy: SortBy.CREATED_AT,
    sortOrder: SortOrder.DESC,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherItem | null>(
    null,
  );

  const { data, isLoading, error } = useVoucherList(query);
  const createMutation = useCreateVoucher();
  const updateMutation = useUpdateVoucher();
  const toggleMutation = useToggleVoucherActive();
  const deleteMutation = useDeleteVoucher();

  // Compute quick stats from all items (approximate based on current page + totalItems)
  const items = data?.items ?? [];
  const activeCount = items.filter(
    (v) => v.computedStatus === VoucherComputedStatus.ACTIVE,
  ).length;
  const scheduledCount = items.filter(
    (v) => v.computedStatus === VoucherComputedStatus.SCHEDULED,
  ).length;
  const expiredCount = items.filter(
    (v) => v.computedStatus === VoucherComputedStatus.EXPIRED,
  ).length;
  const inactiveCount = items.filter(
    (v) => v.computedStatus === VoucherComputedStatus.INACTIVE,
  ).length;

  // Filter handlers
  const handleSearchChange = useCallback((search: string) => {
    setQuery((prev) => ({ ...prev, search, pageNumber: 1 }));
  }, []);

  const handleStatusChange = useCallback(
    (status: VoucherComputedStatus | undefined) => {
      setQuery((prev) => ({ ...prev, status, pageNumber: 1 }));
    },
    [],
  );

  const handleScopeChange = useCallback((scope: VoucherScope | undefined) => {
    setQuery((prev) => ({ ...prev, scope, pageNumber: 1 }));
  }, []);

  const handleDiscountTypeChange = useCallback(
    (discountType: DiscountType | undefined) => {
      setQuery((prev) => ({ ...prev, discountType, pageNumber: 1 }));
    },
    [],
  );

  const handleSortByChange = useCallback((sortBy: SortBy) => {
    setQuery((prev) => ({ ...prev, sortBy }));
  }, []);

  const handleSortOrderChange = useCallback((sortOrder: SortOrder) => {
    setQuery((prev) => ({ ...prev, sortOrder }));
  }, []);

  const handleResetFilter = useCallback(() => {
    setQuery({
      pageNumber: 1,
      pageSize: 10,
      search: "",
      status: undefined,
      scope: undefined,
      discountType: undefined,
      sortBy: SortBy.CREATED_AT,
      sortOrder: SortOrder.DESC,
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, pageNumber: page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize, pageNumber: 1 }));
  }, []);

  // CRUD handlers
  const handleAdd = useCallback(() => {
    setSelectedVoucher(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((voucher: VoucherItem) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((voucher: VoucherItem) => {
    setSelectedVoucher(voucher);
    setIsDeleteModalOpen(true);
  }, []);

  const handleToggle = useCallback(
    async (voucher: VoucherItem) => {
      await toggleMutation.mutateAsync(voucher.id);
    },
    [toggleMutation],
  );

  const handleModalSubmit = useCallback(
    async (formData: CreateVoucherRequest | UpdateVoucherRequest) => {
      if (selectedVoucher) {
        await updateMutation.mutateAsync(formData as UpdateVoucherRequest);
      } else {
        await createMutation.mutateAsync(formData as CreateVoucherRequest);
      }
      setIsModalOpen(false);
      setSelectedVoucher(null);
    },
    [selectedVoucher, createMutation, updateMutation],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (selectedVoucher) {
      await deleteMutation.mutateAsync(selectedVoucher.id);
      setIsDeleteModalOpen(false);
      setSelectedVoucher(null);
    }
  }, [selectedVoucher, deleteMutation]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Voucher</h1>
          <p className="text-muted-foreground">
            Tạo và quản lý các mã giảm giá cho cửa hàng
          </p>
        </div>
        <Button onClick={handleAdd} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Thêm voucher
        </Button>
      </div>

      {/* Quick Statistics */}
      <VoucherQuickStatistic
        totalItems={data?.totalItems}
        activeCount={activeCount}
        scheduledCount={scheduledCount}
        expiredCount={expiredCount}
        inactiveCount={inactiveCount}
        isLoading={isLoading}
      />

      {/* Filter */}
      <VoucherFilter
        search={query.search || ""}
        status={query.status}
        scope={query.scope}
        discountType={query.discountType}
        sortBy={query.sortBy || SortBy.CREATED_AT}
        sortOrder={query.sortOrder || SortOrder.DESC}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onScopeChange={handleScopeChange}
        onDiscountTypeChange={handleDiscountTypeChange}
        onSortByChange={handleSortByChange}
        onSortOrderChange={handleSortOrderChange}
        onReset={handleResetFilter}
      />

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p className="text-sm font-medium">Lỗi khi tải dữ liệu</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {/* List */}
      <VoucherListItem
        items={data?.items}
        isLoading={isLoading}
        isTogglePending={toggleMutation.isPending}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggle={handleToggle}
        onAdd={handleAdd}
      />

      {/* Pagination */}
      {data && data.totalPages > 0 && (
        <Pagination
          currentPage={query.pageNumber || 1}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
          pageSize={query.pageSize || 10}
          hasPreviousPage={data.hasPreviousPage}
          hasNextPage={data.hasNextPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Create/Edit Modal */}
      <VoucherModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        voucher={selectedVoucher}
        onSubmit={handleModalSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        itemName={selectedVoucher?.code}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default VoucherIndex;
