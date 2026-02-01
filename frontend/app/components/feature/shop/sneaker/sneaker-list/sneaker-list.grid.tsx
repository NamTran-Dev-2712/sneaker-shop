import { memo } from "react";
import { SneakerCard } from "~/components/common/card/client/sneaker.card";
import { ProductSkeletonGrid } from "~/components/common/loading/product-skeleton";
import { EmptyList } from "~/components/common/shared/empty-list";
import { Pagination } from "~/components/common/shared/pagination";
import type { GetSneakerItem } from "~/services/shop/sneaker/dto/get-sneaker/get-sneaker.response";

interface SneakerListGridProps {
  sneakers?: GetSneakerItem[];
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

// Memoized sneaker card wrapper to prevent unnecessary re-renders
const MemoizedSneakerCard = memo(function MemoizedSneakerCard({
  sneaker,
}: {
  sneaker: GetSneakerItem;
}) {
  return (
    <SneakerCard
      id={sneaker.id}
      name={sneaker.name}
      slug={sneaker.slug}
      mainImage={sneaker.mainImage}
      basePrice={sneaker.basePrice}
      brandName={sneaker.brand.name}
      brandSeriesName={sneaker.brandSeries?.name}
    />
  );
});

export const SneakerListGrid = memo(function SneakerListGrid({
  sneakers,
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
}: SneakerListGridProps) {
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

  if (!sneakers || sneakers.length === 0) {
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
        {sneakers.map((sneaker) => (
          <MemoizedSneakerCard key={sneaker.id} sneaker={sneaker} />
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

export default SneakerListGrid;
