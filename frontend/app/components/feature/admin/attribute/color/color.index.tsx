import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DeleteModal } from "~/components/common/modal/modal.delete";
import { Pagination } from "~/components/common/shared/pagination";
import { ColorFilter } from "./color.filter";
import { ColorListItem } from "./color.list-item";
import { ColorModal } from "./color.modal";
import { ColorQuickStatistic } from "./color.quick-statistic";
import {
  useColorList,
  useCreateColor,
  useUpdateColor,
  useDeleteColor,
  useColorStatistics,
} from "~/hooks/react-query/use-color.query";
import type { GetColorItem } from "~/services/attribute/color/dto/get-color/get-color.response";
import type { GetColorRequest } from "~/services/attribute/color/dto/get-color/get-color.request";
import type { CreateColorFormData } from "~/lib/validation/admin/attribute/color.schema";
import { SortColorBy } from "~/types/global/filter/sort-by.filter";
import { SortOrder } from "~/types/global/filter/sort-order.filter";

export const ColorIndex = () => {
  // Filter state
  const [query, setQuery] = useState<GetColorRequest>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    sortBy: SortColorBy.NAME,
    sortOrder: SortOrder.ASC,
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<GetColorItem | null>(null);

  // React Query hooks
  const { data, isLoading, error } = useColorList(query);
  const { data: statisticsData, isLoading: statisticsLoading } =
    useColorStatistics();
  const createMutation = useCreateColor();
  const updateMutation = useUpdateColor();
  const deleteMutation = useDeleteColor();

  // Handlers
  const handleSearchChange = useCallback((search: string) => {
    setQuery((prev) => ({ ...prev, search, pageNumber: 1 }));
  }, []);

  const handleSortByChange = useCallback((sortBy: SortColorBy) => {
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
      sortBy: SortColorBy.NAME,
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
    setSelectedColor(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((color: GetColorItem) => {
    setSelectedColor(color);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((color: GetColorItem) => {
    setSelectedColor(color);
    setIsDeleteModalOpen(true);
  }, []);

  const handleModalSubmit = useCallback(
    async (formData: CreateColorFormData) => {
      if (selectedColor) {
        await updateMutation.mutateAsync({
          id: selectedColor.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setIsModalOpen(false);
      setSelectedColor(null);
    },
    [selectedColor, createMutation, updateMutation],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (selectedColor) {
      await deleteMutation.mutateAsync(selectedColor.id);
      setIsDeleteModalOpen(false);
      setSelectedColor(null);
    }
  }, [selectedColor, deleteMutation]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý màu sắc</h1>
          <p className="text-muted-foreground">
            Quản lý danh sách các màu sắc cho sản phẩm
          </p>
        </div>
        <Button onClick={handleAdd} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Thêm màu
        </Button>
      </div>

      {/* Quick Statistics */}
      <ColorQuickStatistic
        data={statisticsData}
        isLoading={statisticsLoading}
      />

      {/* Filter */}
      <ColorFilter
        search={query.search || ""}
        sortBy={query.sortBy || SortColorBy.NAME}
        sortOrder={query.sortOrder || SortOrder.ASC}
        onSearchChange={handleSearchChange}
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
      <ColorListItem
        colors={data?.items}
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
      <ColorModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        color={selectedColor}
        onSubmit={handleModalSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        itemName={selectedColor?.name}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ColorIndex;
