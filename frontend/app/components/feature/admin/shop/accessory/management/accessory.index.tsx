import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { DeleteModal } from "~/components/common/modal/modal.delete";
import { Pagination } from "~/components/common/shared/pagination";
import { AccessoryFilter } from "./accessory.filter";
import { AccessoryListItem } from "./accessory.list-item";
import { AccessoryQuickStatistic } from "./accessory.quick-statistic";
import {
  useAccessoryList,
  useDeleteAccessory,
  useAccessoryStatistics,
} from "~/hooks/react-query/use-accessory.query";
import type { GetAccessoryItemResponse } from "~/services/shop/accessory/dto/get-accessory/get-accessory.response";
import type { GetAccessoryRequest } from "~/services/shop/accessory/dto/get-accessory/get-accessory.request";

export const AccessoryIndex = () => {
  const navigate = useNavigate();

  // Filter state
  const [query, setQuery] = useState<GetAccessoryRequest>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    categoryId: undefined,
    brandId: undefined,
    isActive: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccessory, setSelectedAccessory] =
    useState<GetAccessoryItemResponse | null>(null);

  // React Query hooks
  const { data, isLoading, error } = useAccessoryList(query);
  const { data: statisticsData, isLoading: statisticsLoading } =
    useAccessoryStatistics();
  const deleteMutation = useDeleteAccessory();

  // Handlers
  const handleSearchChange = useCallback((search: string) => {
    setQuery((prev) => ({ ...prev, search, pageNumber: 1 }));
  }, []);

  const handleCategoryChange = useCallback((categoryId: number | undefined) => {
    setQuery((prev) => ({ ...prev, categoryId, pageNumber: 1 }));
  }, []);

  const handleIsActiveChange = useCallback((isActive: boolean | undefined) => {
    setQuery((prev) => ({ ...prev, isActive, pageNumber: 1 }));
  }, []);

  const handleMinPriceChange = useCallback((minPrice: number | undefined) => {
    setQuery((prev) => ({ ...prev, minPrice, pageNumber: 1 }));
  }, []);

  const handleMaxPriceChange = useCallback((maxPrice: number | undefined) => {
    setQuery((prev) => ({ ...prev, maxPrice, pageNumber: 1 }));
  }, []);

  const handleSortByChange = useCallback((sortBy: string) => {
    setQuery((prev) => ({ ...prev, sortBy }));
  }, []);

  const handleSortOrderChange = useCallback((sortOrder: string) => {
    setQuery((prev) => ({ ...prev, sortOrder }));
  }, []);

  const handleResetFilter = useCallback(() => {
    setQuery({
      pageNumber: 1,
      pageSize: 10,
      search: "",
      categoryId: undefined,
      brandId: undefined,
      isActive: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, pageNumber: page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize, pageNumber: 1 }));
  }, []);

  const handleAdd = useCallback(() => {
    navigate("/admin/accessories/create");
  }, [navigate]);

  const handleEdit = useCallback(
    (accessory: GetAccessoryItemResponse) => {
      navigate(`/admin/accessories/${accessory.id}/edit`);
    },
    [navigate],
  );

  const handleView = useCallback(
    (accessory: GetAccessoryItemResponse) => {
      navigate(`/admin/accessories/${accessory.id}`);
    },
    [navigate],
  );

  const handleDelete = useCallback((accessory: GetAccessoryItemResponse) => {
    setSelectedAccessory(accessory);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedAccessory) {
      await deleteMutation.mutateAsync(selectedAccessory.id);
      setIsDeleteModalOpen(false);
      setSelectedAccessory(null);
    }
  }, [selectedAccessory, deleteMutation]);

  // Transform data for list component
  const accessoryItems = data?.items;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý phụ kiện
          </h1>
          <p className="text-muted-foreground">
            Quản lý các phụ kiện trong hệ thống
          </p>
        </div>
        <Button onClick={handleAdd} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Thêm phụ kiện
        </Button>
      </div>

      {/* Quick Statistics */}
      <AccessoryQuickStatistic
        data={statisticsData ?? undefined}
        isLoading={statisticsLoading}
      />

      {/* Filter */}
      <AccessoryFilter
        search={query.search || ""}
        categoryId={query.categoryId}
        isActive={query.isActive}
        minPrice={query.minPrice}
        maxPrice={query.maxPrice}
        sortBy={query.sortBy || "createdAt"}
        sortOrder={query.sortOrder || "desc"}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onIsActiveChange={handleIsActiveChange}
        onMinPriceChange={handleMinPriceChange}
        onMaxPriceChange={handleMaxPriceChange}
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
      <AccessoryListItem
        accessories={accessoryItems}
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
        title="Xóa phụ kiện"
        itemName={selectedAccessory?.name}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AccessoryIndex;
