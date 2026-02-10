import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DeleteModal } from "~/components/common/modal/modal.delete";
import { Pagination } from "~/components/common/shared/pagination";
import { SlideFilter } from "./slide.filter";
import { SlideListItem } from "./slide.list-item";
import { SlideModal } from "./slide.modal";
import { SlideQuickStatistic } from "./slide.quick-statistic";
import {
  useSlideList,
  useCreateSlide,
  useUpdateSlide,
  useDeleteSlide,
} from "~/hooks/react-query/use-slide.query";
import type { GetSlideItem } from "~/services/attribute/slide/dto/get-slide/get-slide.response";
import type { GetSlideRequest } from "~/services/attribute/slide/dto/get-slide/get-slide.request";
import type {
  CreateSlideFormData,
  UpdateSlideFormData,
} from "~/lib/validation/admin/attribute/slide.schema";
import { SortSlideBy } from "~/types/global/filter/sort-by.filter";
import { SortOrder } from "~/types/global/filter/sort-order.filter";

export const SlideIndex = () => {
  // Filter state
  const [query, setQuery] = useState<GetSlideRequest>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    sortBy: SortSlideBy.CREATED_AT,
    sortOrder: SortOrder.DESC,
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<GetSlideItem | null>(null);

  // React Query hooks
  const { data, isLoading, error } = useSlideList(query);
  const createMutation = useCreateSlide();
  const updateMutation = useUpdateSlide();
  const deleteMutation = useDeleteSlide();

  // Handlers
  const handleSearchChange = useCallback((search: string) => {
    setQuery((prev) => ({ ...prev, search, pageNumber: 1 }));
  }, []);

  const handleSortByChange = useCallback((sortBy: SortSlideBy) => {
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
      sortBy: SortSlideBy.CREATED_AT,
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
    setSelectedSlide(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((slide: GetSlideItem) => {
    setSelectedSlide(slide);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((slide: GetSlideItem) => {
    setSelectedSlide(slide);
    setIsDeleteModalOpen(true);
  }, []);

  const handleModalSubmit = useCallback(
    async (formData: CreateSlideFormData | UpdateSlideFormData) => {
      if (selectedSlide) {
        await updateMutation.mutateAsync({
          id: selectedSlide.id,
          data: formData as UpdateSlideFormData,
        });
      } else {
        await createMutation.mutateAsync(formData as CreateSlideFormData);
      }
      setIsModalOpen(false);
      setSelectedSlide(null);
    },
    [selectedSlide, createMutation, updateMutation],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (selectedSlide) {
      await deleteMutation.mutateAsync(selectedSlide.id);
      setIsDeleteModalOpen(false);
      setSelectedSlide(null);
    }
  }, [selectedSlide, deleteMutation]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Slide</h1>
          <p className="text-muted-foreground">
            Quản lý các slide hiển thị trên banner trang chủ
          </p>
        </div>
        <Button onClick={handleAdd} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Thêm slide
        </Button>
      </div>

      {/* Quick Statistics */}
      <SlideQuickStatistic
        totalSlides={data?.totalItems || 0}
        isLoading={isLoading}
      />

      {/* Filter */}
      <SlideFilter
        search={query.search || ""}
        sortBy={query.sortBy || SortSlideBy.CREATED_AT}
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
      <SlideListItem
        slides={data?.items}
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
      <SlideModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        slide={selectedSlide}
        onSubmit={handleModalSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        itemName={selectedSlide?.title}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default SlideIndex;
