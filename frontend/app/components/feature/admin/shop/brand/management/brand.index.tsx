import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DeleteModal } from "~/components/common/modal/modal.delete";
import { Pagination } from "~/components/common/shared/pagination";
import { BrandFilter } from "./brand.filter";
import { BrandListItem } from "./brand.list-item";
import { BrandModal } from "./brand.modal";
import { BrandQuickStatistic } from "./brand.quick-statistic";
import { BrandDetailModal } from "./brand-detail.modal";
import { BrandSeriesModal } from "./brand-series.modal";
import { BrandSeriesEditModal } from "./brand-series-edit.modal";
import {
  useBrandList,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
  useBrandDetail,
  useCreateBrandSeries,
  useUpdateBrandSeries,
  useDeleteBrandSeries,
  useBrandStatistics,
} from "~/hooks/react-query/use-brand.query";
import type { GetBrandItem } from "~/services/shop/brand/dto/get-brand/get-brand.response";
import type { GetBrandSeries } from "~/services/shop/brand/dto/get-brand/get-brand.response";
import type { GetBrandRequest } from "~/services/shop/brand/dto/get-brand/get-brand.request";
import { SortBy } from "~/types/global/filter/sort-by.filter";
import { SortOrder } from "~/types/global/filter/sort-order.filter";

export const BrandIndex = () => {
  // Filter state
  const [query, setQuery] = useState<GetBrandRequest>({
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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSeriesModalOpen, setIsSeriesModalOpen] = useState(false);
  const [isSeriesEditModalOpen, setIsSeriesEditModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<GetBrandItem | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<GetBrandSeries | null>(
    null,
  );
  const [detailBrandId, setDetailBrandId] = useState<number | null>(null);

  // React Query hooks
  const { data, isLoading, error } = useBrandList(query);
  const { data: brandDetail } = useBrandDetail(detailBrandId);
  const { data: statisticsData, isLoading: statisticsLoading } =
    useBrandStatistics();
  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();
  const deleteMutation = useDeleteBrand();
  const createSeriesMutation = useCreateBrandSeries();
  const updateSeriesMutation = useUpdateBrandSeries();
  const deleteSeriesMutation = useDeleteBrandSeries();

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
    setSelectedBrand(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((brand: GetBrandItem) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((brand: GetBrandItem) => {
    setSelectedBrand(brand);
    setIsDeleteModalOpen(true);
  }, []);

  const handleViewDetail = useCallback((brand: GetBrandItem) => {
    setDetailBrandId(brand.id);
    setIsDetailModalOpen(true);
  }, []);

  const handleAddSeries = useCallback(() => {
    setIsDetailModalOpen(false);
    setIsSeriesModalOpen(true);
  }, []);

  const handleEditSeries = useCallback((series: GetBrandSeries) => {
    setSelectedSeries(series);
    setIsDetailModalOpen(false);
    setIsSeriesEditModalOpen(true);
  }, []);

  const handleSeriesSubmit = useCallback(
    async (seriesData: Array<{ name: string }>) => {
      if (detailBrandId) {
        await createSeriesMutation.mutateAsync({
          brandId: detailBrandId,
          data: seriesData,
        });
        setIsSeriesModalOpen(false);
        setIsDetailModalOpen(true);
      }
    },
    [detailBrandId, createSeriesMutation],
  );

  const handleSeriesEditSubmit = useCallback(
    async (seriesData: {
      id: number;
      brandId: number;
      name: string;
      isActive: boolean;
    }) => {
      if (detailBrandId) {
        await updateSeriesMutation.mutateAsync({
          brandId: detailBrandId,
          data: seriesData,
        });
        setIsSeriesEditModalOpen(false);
        setIsDetailModalOpen(true);
        setSelectedSeries(null);
      }
    },
    [detailBrandId, updateSeriesMutation],
  );

  const handleDeleteSeries = useCallback(
    async (seriesId: number) => {
      if (detailBrandId) {
        await deleteSeriesMutation.mutateAsync({
          brandId: detailBrandId,
          seriesId,
        });
      }
    },
    [detailBrandId, deleteSeriesMutation],
  );

  const handleDetailModalClose = useCallback((open: boolean) => {
    setIsDetailModalOpen(open);
    if (!open) {
      setDetailBrandId(null);
    }
  }, []);

  const handleSeriesModalClose = useCallback((open: boolean) => {
    setIsSeriesModalOpen(open);
    if (!open) {
      setIsDetailModalOpen(true);
    }
  }, []);

  const handleSeriesEditModalClose = useCallback((open: boolean) => {
    setIsSeriesEditModalOpen(open);
    if (!open) {
      setSelectedSeries(null);
      setIsDetailModalOpen(true);
    }
  }, []);

  const handleModalSubmit = useCallback(
    async (formData: FormData) => {
      if (selectedBrand) {
        await updateMutation.mutateAsync({
          id: selectedBrand.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setIsModalOpen(false);
      setSelectedBrand(null);
    },
    [selectedBrand, createMutation, updateMutation],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (selectedBrand) {
      await deleteMutation.mutateAsync(selectedBrand.id);
      setIsDeleteModalOpen(false);
      setSelectedBrand(null);
    }
  }, [selectedBrand, deleteMutation]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý hãng</h1>
          <p className="text-muted-foreground">
            Quản lý các hãng sản phẩm trong hệ thống
          </p>
        </div>
        <Button onClick={handleAdd} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Thêm hãng
        </Button>
      </div>

      {/* Quick Statistics */}
      <BrandQuickStatistic
        data={statisticsData}
        isLoading={statisticsLoading}
      />

      {/* Filter */}
      <BrandFilter
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
      <BrandListItem
        brands={data?.items}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetail={handleViewDetail}
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
      <BrandModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        brand={selectedBrand}
        onSubmit={handleModalSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Brand Detail Modal */}
      <BrandDetailModal
        open={isDetailModalOpen}
        onOpenChange={handleDetailModalClose}
        brand={brandDetail || null}
        onAddSeries={handleAddSeries}
        onEditSeries={handleEditSeries}
        onDeleteSeries={handleDeleteSeries}
        isDeleting={deleteSeriesMutation.isPending}
      />

      {/* Brand Series Create Modal */}
      <BrandSeriesModal
        open={isSeriesModalOpen}
        onOpenChange={handleSeriesModalClose}
        brandName={brandDetail?.name || ""}
        onSubmit={handleSeriesSubmit}
        isLoading={createSeriesMutation.isPending}
      />

      {/* Brand Series Edit Modal */}
      <BrandSeriesEditModal
        open={isSeriesEditModalOpen}
        onOpenChange={handleSeriesEditModalClose}
        brandId={detailBrandId || 0}
        brandName={brandDetail?.name || ""}
        series={selectedSeries}
        onSubmit={handleSeriesEditSubmit}
        isLoading={updateSeriesMutation.isPending}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        itemName={selectedBrand?.name}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default BrandIndex;
