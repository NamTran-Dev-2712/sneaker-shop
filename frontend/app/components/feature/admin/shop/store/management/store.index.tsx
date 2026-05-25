import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DeleteModal } from "~/components/common/modal/modal.delete";
import { Pagination } from "~/components/common/shared/pagination";
import { StoreFilter } from "./store.filter";
import { StoreListItem } from "./store.list-item";
import { StoreModal } from "./store.modal";
import { StoreQuickStatistic } from "./store.quick-statistic";
import {
  useStoreList,
  useCreateStore,
  useUpdateStore,
  useDeleteStore,
  useStoreStatistics,
} from "~/hooks/react-query/use-store.query";
import type { GetStoreItem } from "~/services/shop/store/dto/get-store/get-store.response";
import type { GetStoreRequest } from "~/services/shop/store/dto/get-store/get-store.request";
import type { CreateStoreRequest } from "~/services/shop/store/dto/create-store/create-store.request";
import type { UpdateStoreRequest } from "~/services/shop/store/dto/update-store/update-store.request";
import { SortBy } from "~/types/global/filter/sort-by.filter";
import { SortOrder } from "~/types/global/filter/sort-order.filter";

export const StoreIndex = () => {
  // Filter state
  const [query, setQuery] = useState<GetStoreRequest>({
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
  const [selectedStore, setSelectedStore] = useState<GetStoreItem | null>(null);

  // React Query hooks
  const { data, isLoading, error } = useStoreList(query);
  const { data: statisticsData, isLoading: statisticsLoading } =
    useStoreStatistics();
  const createMutation = useCreateStore();
  const updateMutation = useUpdateStore();
  const deleteMutation = useDeleteStore();

  // Handlers
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

  const handleAdd = useCallback(() => {
    setSelectedStore(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((store: GetStoreItem) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((store: GetStoreItem) => {
    setSelectedStore(store);
    setIsDeleteModalOpen(true);
  }, []);

  const handleModalSubmit = useCallback(
    async (data: CreateStoreRequest | UpdateStoreRequest) => {
      if (selectedStore) {
        await updateMutation.mutateAsync({
          id: selectedStore.id,
          data: data as UpdateStoreRequest,
        });
      } else {
        await createMutation.mutateAsync(data as CreateStoreRequest);
      }
      setIsModalOpen(false);
      setSelectedStore(null);
    },
    [selectedStore, createMutation, updateMutation],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (selectedStore) {
      await deleteMutation.mutateAsync(selectedStore.id);
      setIsDeleteModalOpen(false);
      setSelectedStore(null);
    }
  }, [selectedStore, deleteMutation]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý cửa hàng
          </h1>
          <p className="text-muted-foreground">
            Quản lý các cửa hàng trong hệ thống
          </p>
        </div>
        <Button onClick={handleAdd} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Thêm cửa hàng
        </Button>
      </div>

      {/* Quick Statistics */}
      <StoreQuickStatistic
        data={statisticsData}
        isLoading={statisticsLoading}
      />

      {/* Filter */}
      <StoreFilter
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
      <StoreListItem
        stores={data?.items}
        isLoading={isLoading}
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
      <StoreModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        store={selectedStore}
        onSubmit={handleModalSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        itemName={selectedStore?.name}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default StoreIndex;
