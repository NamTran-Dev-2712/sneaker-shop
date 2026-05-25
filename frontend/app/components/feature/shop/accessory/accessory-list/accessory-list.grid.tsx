import { memo } from "react";
import { AccessoryCard } from "~/components/common/card/client/accessory.card";
import { ProductSkeletonGrid } from "~/components/common/loading/product-skeleton";
import { EmptyList } from "~/components/common/shared/empty-list";
import { Pagination } from "~/components/common/shared/pagination";
import type { GetAccessoryItemResponse } from "~/services/shop/accessory/dto/get-accessory/get-accessory.response";

interface AccessoryListGridProps {
  accessories?: GetAccessoryItemResponse[];
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onClearFilters: () => void;
}

// Memoized accessory card wrapper to prevent unnecessary re-renders
const MemoizedAccessoryCard = memo(function MemoizedAccessoryCard({
  accessory,
}: {
  accessory: GetAccessoryItemResponse;
}) {
  return (
    <AccessoryCard
      id={accessory.id}
      name={accessory.name}
      slug={accessory.slug}
      mainImage={accessory.mainImage}
      basePrice={accessory.basePrice}
      categoryName={accessory.category?.name || "Phụ kiện"}
      brandName={accessory.brand?.name || "No brand"}
    />
  );
});

export const AccessoryListGrid = memo(function AccessoryListGrid({
  accessories,
  isLoading,
  error,
  currentPage,
  pageSize,
  totalPages,
  totalItems,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
  onPageSizeChange,
  onClearFilters,
}: AccessoryListGridProps) {
  if (isLoading) {
    return <ProductSkeletonGrid count={12} />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Đã có lỗi xảy ra. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  if (!accessories || accessories.length === 0) {
    return (
      <EmptyList
        title="Không tìm thấy sản phẩm"
        description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
        actionLabel="Xóa bộ lọc"
        onAction={onClearFilters}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {accessories.map((accessory) => (
          <MemoizedAccessoryCard key={accessory.id} accessory={accessory} />
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          totalItems={totalItems}
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </>
  );
});

export default AccessoryListGrid;
