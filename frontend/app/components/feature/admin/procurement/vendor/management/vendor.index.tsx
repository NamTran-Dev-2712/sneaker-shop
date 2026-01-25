import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DeleteModal } from "~/components/common/modal/modal.delete";
import { Pagination } from "~/components/common/shared/pagination";
import { VendorFilter } from "./vendor.filter";
import { VendorListItem } from "./vendor.list-item";
import { VendorModal } from "./vendor.modal";
import { VendorQuickStatistic } from "./vendor.quick-statistic";
import {
  useVendorList,
  useVendorStatistics,
  useCreateVendor,
  useUpdateVendor,
  useDeleteVendor,
} from "~/hooks/react-query/use-vendor.query";
import type { VendorItem } from "~/services/procurement/vendor/dto/get-vendor/get-vendor.response";
import type { GetVendorRequest } from "~/services/procurement/vendor/dto/get-vendor/get-vendor.request";
import type { CreateVendorRequest } from "~/services/procurement/vendor/dto/create-vendor/create-vendor.request";
import type { UpdateVendorRequest } from "~/services/procurement/vendor/dto/update-vendor/update-vendor.request";
import { SortBy } from "~/types/global/filter/sort-by.filter";
import { SortOrder } from "~/types/global/filter/sort-order.filter";

export const VendorIndex = () => {
  const navigate = useNavigate();

  // Filter state
  const [query, setQuery] = useState<GetVendorRequest>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    isActive: undefined,
    sortBy: SortBy.NAME,
    sortOrder: SortOrder.ASC,
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorItem | null>(null);

  // React Query hooks
  const { data, isLoading, error } = useVendorList(query);
  const { data: statisticsData, isLoading: statisticsLoading } =
    useVendorStatistics();

  const createMutation = useCreateVendor();
  const updateMutation = useUpdateVendor();
  const deleteMutation = useDeleteVendor();

  // Filter handlers
  const handleSearchChange = useCallback((search: string) => {
    setQuery((prev) => ({ ...prev, search, pageNumber: 1 }));
  }, []);

  const handleIsActiveChange = useCallback((isActive: boolean | undefined) => {
    setQuery((prev) => ({ ...prev, isActive, pageNumber: 1 }));
  }, []);

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
      isActive: undefined,
      sortBy: SortBy.NAME,
      sortOrder: SortOrder.ASC,
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
    setSelectedVendor(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((vendor: VendorItem) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((vendor: VendorItem) => {
    setSelectedVendor(vendor);
    setIsDeleteModalOpen(true);
  }, []);

  // Navigate to detail page instead of opening modal
  const handleView = useCallback(
    (vendor: VendorItem) => {
      navigate(`/admin/vendors/${vendor.id}`);
    },
    [navigate],
  );

  const handleModalSubmit = useCallback(
    async (formData: CreateVendorRequest | UpdateVendorRequest) => {
      if (selectedVendor) {
        await updateMutation.mutateAsync(formData as UpdateVendorRequest);
      } else {
        await createMutation.mutateAsync(formData as CreateVendorRequest);
      }
      setIsModalOpen(false);
      setSelectedVendor(null);
    },
    [selectedVendor, createMutation, updateMutation],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (selectedVendor) {
      await deleteMutation.mutateAsync(selectedVendor.id);
      setIsDeleteModalOpen(false);
      setSelectedVendor(null);
    }
  }, [selectedVendor, deleteMutation]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý nhà cung cấp
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin các nhà cung cấp sản phẩm
          </p>
        </div>
        <Button onClick={handleAdd} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Thêm nhà cung cấp
        </Button>
      </div>

      {/* Quick Statistics */}
      <VendorQuickStatistic
        data={statisticsData}
        isLoading={statisticsLoading}
      />

      {/* Filter */}
      <VendorFilter
        search={query.search || ""}
        isActive={query.isActive}
        sortBy={query.sortBy || SortBy.NAME}
        sortOrder={query.sortOrder || SortOrder.ASC}
        onSearchChange={handleSearchChange}
        onIsActiveChange={handleIsActiveChange}
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
      <VendorListItem
        items={data?.items}
        isLoading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
      <VendorModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        vendor={selectedVendor}
        onSubmit={handleModalSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        itemName={selectedVendor?.name}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default VendorIndex;
