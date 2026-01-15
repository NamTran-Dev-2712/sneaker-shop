import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { DeleteModal } from "~/components/common/modal/modal.delete";
import { Pagination } from "~/components/common/shared/pagination";
import { SneakerFilter } from "./sneaker.filter";
import { SneakerListItem } from "./sneaker.list-item";
import { SneakerQuickStatistic } from "./sneaker.quick-statistic";
import {
  useSneakerList,
  useDeleteSneaker,
} from "~/hooks/react-query/use-sneaker.query";
import type { GetSneakerItem } from "~/services/shop/sneaker/dto/get-sneaker/get-sneaker.response";
import type { GetSneakerRequest } from "~/services/shop/sneaker/dto/get-sneaker/get-sneaker.request";
import { SortBy } from "~/types/global/filter/sort-by.filter";
import { SortOrder } from "~/types/global/filter/sort-order.filter";

export const SneakerIndex = () => {
  const navigate = useNavigate();

  // Filter state
  const [query, setQuery] = useState<GetSneakerRequest>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    brandId: undefined,
    isActive: undefined,
    sortBy: SortBy.CREATED_AT,
    sortOrder: SortOrder.DESC,
  });

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSneaker, setSelectedSneaker] = useState<GetSneakerItem | null>(
    null,
  );

  // React Query hooks
  const { data, isLoading, error } = useSneakerList(query);
  const deleteMutation = useDeleteSneaker();

  // Handlers
  const handleSearchChange = useCallback((search: string) => {
    setQuery((prev) => ({ ...prev, search, pageNumber: 1 }));
  }, []);

  const handleBrandChange = useCallback((brandId: number | undefined) => {
    setQuery((prev) => ({ ...prev, brandId, pageNumber: 1 }));
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
      brandId: undefined,
      isActive: undefined,
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

  const handleAdd = useCallback(() => {
    navigate("/admin/sneakers/create");
  }, [navigate]);

  const handleEdit = useCallback(
    (sneaker: GetSneakerItem) => {
      navigate(`/admin/sneakers/${sneaker.id}/edit`);
    },
    [navigate],
  );

  const handleView = useCallback(
    (sneaker: GetSneakerItem) => {
      navigate(`/admin/sneakers/${sneaker.id}`);
    },
    [navigate],
  );

  const handleDelete = useCallback((sneaker: GetSneakerItem) => {
    setSelectedSneaker(sneaker);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedSneaker) {
      await deleteMutation.mutateAsync(selectedSneaker.id);
      setIsDeleteModalOpen(false);
      setSelectedSneaker(null);
    }
  }, [selectedSneaker, deleteMutation]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý sản phẩm
          </h1>
          <p className="text-muted-foreground">
            Quản lý danh sách các sản phẩm giày sneaker
          </p>
        </div>
        <Button onClick={handleAdd} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Quick Statistics */}
      <SneakerQuickStatistic data={data} isLoading={isLoading} />

      {/* Filter */}
      <SneakerFilter
        search={query.search || ""}
        brandId={query.brandId}
        isActive={query.isActive}
        sortBy={query.sortBy || SortBy.CREATED_AT}
        sortOrder={query.sortOrder || SortOrder.DESC}
        onSearchChange={handleSearchChange}
        onBrandChange={handleBrandChange}
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
      <SneakerListItem
        sneakers={data?.items}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
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

      {/* Delete Modal */}
      <DeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        itemName={selectedSneaker?.name}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default SneakerIndex;
