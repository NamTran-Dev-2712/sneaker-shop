import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { DeleteModal } from "~/components/common/modal/modal.delete";
import { Pagination } from "~/components/common/shared/pagination";
import { CategoryFilter } from "./category.filter";
import { CategoryListItem } from "./category.list-item";
import { CategoryQuickStatistic } from "./category.quick-statistic";
import { CategoryDetailModal } from "./category.modal";
import {
  useCategoryList,
  useCategoryDetail,
  useDeleteCategory,
  useCategoryStatistics,
} from "~/hooks/react-query/use-category.query";
import type { GetCategoryAccessoryItem } from "~/services/shop/category/dto/get-category-accessory/get-category-accessory.response";
import type { GetCategoryAccessoryRequest } from "~/services/shop/category/dto/get-category-accessory/get-category-accessory.request";
import { SortBy } from "~/types/global/filter/sort-by.filter";
import { SortOrder } from "~/types/global/filter/sort-order.filter";

export const CategoryIndex = () => {
  const navigate = useNavigate();

  // Filter state
  const [query, setQuery] = useState<GetCategoryAccessoryRequest>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    sortBy: SortBy.CREATED_AT,
    sortOrder: SortOrder.DESC,
  });

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<GetCategoryAccessoryItem | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  // React Query hooks
  const { data, isLoading, error } = useCategoryList(query);
  const { data: statisticsData, isLoading: statisticsLoading } =
    useCategoryStatistics();
  const { data: categoryDetail, isLoading: detailLoading } = useCategoryDetail(
    selectedCategoryId || 0,
  );
  const deleteMutation = useDeleteCategory();

  // Handlers
  const handleSearchChange = useCallback((search: string) => {
    setQuery((prev) => ({ ...prev, search, pageNumber: 1 }));
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
    navigate("/admin/categories/create");
  }, [navigate]);

  const handleEdit = useCallback(
    (category: GetCategoryAccessoryItem) => {
      navigate(`/admin/categories/${category.id}/edit`);
    },
    [navigate],
  );

  const handleView = useCallback((category: GetCategoryAccessoryItem) => {
    setSelectedCategoryId(category.id);
    setIsDetailModalOpen(true);
  }, []);

  const handleDelete = useCallback((category: GetCategoryAccessoryItem) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedCategory) {
      await deleteMutation.mutateAsync(selectedCategory.id);
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    }
  }, [selectedCategory, deleteMutation]);

  const handleEditFromModal = useCallback(() => {
    if (selectedCategoryId) {
      navigate(`/admin/categories/${selectedCategoryId}/edit`);
    }
  }, [selectedCategoryId, navigate]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý danh mục phụ kiện
          </h1>
          <p className="text-muted-foreground">
            Quản lý các danh mục phụ kiện trong hệ thống
          </p>
        </div>
        <Button onClick={handleAdd} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>

      {/* Quick Statistics */}
      <CategoryQuickStatistic
        data={statisticsData ?? undefined}
        isLoading={statisticsLoading}
      />

      {/* Filter */}
      <CategoryFilter
        search={query.search || ""}
        sortBy={query.sortBy || SortBy.CREATED_AT}
        sortOrder={query.sortOrder || SortOrder.DESC}
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
      <CategoryListItem
        categories={data?.items}
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
        title="Xóa danh mục phụ kiện"
        itemName={selectedCategory?.name}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />

      {/* Detail Modal */}
      <CategoryDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        category={categoryDetail ?? undefined}
        isLoading={detailLoading}
        onEdit={handleEditFromModal}
      />
    </div>
  );
};

export default CategoryIndex;
