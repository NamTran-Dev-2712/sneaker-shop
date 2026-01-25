import { useState, useCallback } from "react";
import { Package } from "lucide-react";
import { Pagination } from "~/components/common/shared/pagination";
import { InventoryFilter } from "./inventory.filter";
import { InventoryListItem } from "./inventory.list-item";
import { InventoryQuickStatistic } from "./inventory.quick-statistic";
import { InventoryDetailModal } from "./inventory.detail-modal";
import {
  useInventoryList,
  useInventoryDetail,
  useInventoryStatistics,
} from "~/hooks/react-query/use-inventory.query";
import type { GetInventoryItem } from "~/services/inventory/dto/get-inventory/get-inventory.response";
import type { GetInventoryRequest } from "~/services/inventory/dto/get-inventory/get-inventory.request";

export const InventoryIndex = () => {
  // Filter state
  const [query, setQuery] = useState<GetInventoryRequest>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    storeId: undefined,
    sellableType: undefined,
    lowStock: undefined,
    lowStockThreshold: 5,
  });

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState<number | null>(
    null,
  );

  // React Query hooks
  const { data, isLoading, error } = useInventoryList(query);
  const { data: inventoryDetail, isLoading: detailLoading } =
    useInventoryDetail(isDetailModalOpen ? selectedInventoryId : null);
  const { data: statisticsData, isLoading: statisticsLoading } =
    useInventoryStatistics();

  // Handlers
  const handleSearchChange = useCallback((search: string) => {
    setQuery((prev) => ({ ...prev, search, pageNumber: 1 }));
  }, []);

  const handleStoreIdChange = useCallback((storeId: number | undefined) => {
    setQuery((prev) => ({ ...prev, storeId, pageNumber: 1 }));
  }, []);

  const handleSellableTypeChange = useCallback(
    (sellableType: string | undefined) => {
      setQuery((prev) => ({ ...prev, sellableType, pageNumber: 1 }));
    },
    [],
  );

  const handleLowStockChange = useCallback((lowStock: boolean | undefined) => {
    setQuery((prev) => ({ ...prev, lowStock, pageNumber: 1 }));
  }, []);

  const handleResetFilter = useCallback(() => {
    setQuery({
      pageNumber: 1,
      pageSize: 10,
      search: "",
      storeId: undefined,
      sellableType: undefined,
      lowStock: undefined,
      lowStockThreshold: 5,
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, pageNumber: page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize, pageNumber: 1 }));
  }, []);

  const handleViewDetail = useCallback((item: GetInventoryItem) => {
    setSelectedInventoryId(item.id);
    setIsDetailModalOpen(true);
  }, []);

  const handleDetailModalClose = useCallback((open: boolean) => {
    setIsDetailModalOpen(open);
    if (!open) {
      setSelectedInventoryId(null);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý tồn kho</h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý số lượng sản phẩm trong kho
          </p>
        </div>
      </div>

      {/* Quick Statistics */}
      <InventoryQuickStatistic
        data={statisticsData}
        isLoading={statisticsLoading}
      />

      {/* Filter */}
      <InventoryFilter
        search={query.search || ""}
        storeId={query.storeId}
        sellableType={query.sellableType}
        lowStock={query.lowStock}
        onSearchChange={handleSearchChange}
        onStoreIdChange={handleStoreIdChange}
        onSellableTypeChange={handleSellableTypeChange}
        onLowStockChange={handleLowStockChange}
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
      <InventoryListItem
        items={data?.items}
        isLoading={isLoading}
        onViewDetail={handleViewDetail}
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

      {/* Detail Modal */}
      <InventoryDetailModal
        open={isDetailModalOpen}
        onOpenChange={handleDetailModalClose}
        data={inventoryDetail}
        isLoading={detailLoading}
      />
    </div>
  );
};

export default InventoryIndex;
