import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useSneakerList } from "~/hooks/react-query/use-sneaker.query";
import { useAllBrands } from "~/hooks/react-query/use-brand.query";
import { useAllColors } from "~/hooks/react-query/use-color.query";
import { useAllSizes } from "~/hooks/react-query/use-size.query";
import { SneakerListFilter } from "./sneaker-list.filter";
import { SneakerListToolbar } from "./sneaker-list.toolbar";
import { SneakerListGrid } from "./sneaker-list.grid";
import { SortBy } from "~/types/global/filter/sort-by.filter";
import { SortOrder } from "~/types/global/filter/sort-order.filter";
import type { GetSneakerRequest } from "~/services/shop/sneaker/dto/get-sneaker/get-sneaker.request";

interface ExpandedFilters {
  brand: boolean;
  price: boolean;
  color: boolean;
  size: boolean;
}

export const SneakerListIndex = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State for expanded filters only - search is managed in URL
  const [expandedFilters, setExpandedFilters] = useState<ExpandedFilters>({
    brand: true,
    price: true,
    color: false,
    size: false,
  });

  // Parse query params
  const pageNumber = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "12");
  const searchFromUrl = searchParams.get("search") || "";

  // Build query object
  const query: GetSneakerRequest = useMemo(
    () => ({
      pageNumber,
      pageSize,
      search: searchFromUrl || undefined,
      brandId: searchParams.get("brandId")
        ? parseInt(searchParams.get("brandId")!)
        : undefined,
      brandSeriesId: searchParams.get("seriesId")
        ? parseInt(searchParams.get("seriesId")!)
        : undefined,
      minPrice: searchParams.get("minPrice")
        ? parseInt(searchParams.get("minPrice")!)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? parseInt(searchParams.get("maxPrice")!)
        : undefined,
      colorIds: searchParams.get("colors")
        ? searchParams.get("colors")!.split(",").map(Number)
        : undefined,
      sizeIds: searchParams.get("sizes")
        ? searchParams.get("sizes")!.split(",").map(Number)
        : undefined,
      sortBy: (searchParams.get("sortBy") as SortBy) || SortBy.CREATED_AT,
      sortOrder: (searchParams.get("sortOrder") as SortOrder) || SortOrder.DESC,
      isActive: true,
    }),
    [pageNumber, pageSize, searchFromUrl, searchParams],
  );

  // Queries
  const { data: sneakersData, isLoading, error } = useSneakerList(query);
  const { data: brands } = useAllBrands();
  const { data: colors } = useAllColors();
  const { data: sizes } = useAllSizes();

  // Update URL params
  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });
      // Reset to page 1 when filters change
      if (!("page" in updates)) {
        newParams.set("page", "1");
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  // Handler functions - memoized to prevent unnecessary re-renders
  const handleSearchChange = useCallback(
    (value: string) => {
      updateParams({ search: value || undefined });
    },
    [updateParams],
  );

  const handleSortChange = useCallback(
    (sortBy: string, sortOrder: string) => {
      updateParams({ sortBy, sortOrder });
    },
    [updateParams],
  );

  const handleBrandChange = useCallback(
    (brandId: number | undefined) => {
      updateParams({ brandId: brandId?.toString() });
    },
    [updateParams],
  );

  const handlePriceRangeChange = useCallback(
    (min?: number, max?: number) => {
      updateParams({
        minPrice: min?.toString(),
        maxPrice: max?.toString(),
      });
    },
    [updateParams],
  );

  const handleColorToggle = useCallback(
    (colorId: number) => {
      const currentColors = query.colorIds || [];
      const newColors = currentColors.includes(colorId)
        ? currentColors.filter((id) => id !== colorId)
        : [...currentColors, colorId];
      updateParams({
        colors: newColors.length > 0 ? newColors.join(",") : undefined,
      });
    },
    [query.colorIds, updateParams],
  );

  const handleSizeToggle = useCallback(
    (sizeId: number) => {
      const currentSizes = query.sizeIds || [];
      const newSizes = currentSizes.includes(sizeId)
        ? currentSizes.filter((id) => id !== sizeId)
        : [...currentSizes, sizeId];
      updateParams({
        sizes: newSizes.length > 0 ? newSizes.join(",") : undefined,
      });
    },
    [query.sizeIds, updateParams],
  );

  const handleExpandedFilterChange = useCallback(
    (key: keyof ExpandedFilters, open: boolean) => {
      setExpandedFilters((prev) => ({ ...prev, [key]: open }));
    },
    [],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateParams({ page: page.toString() });
    },
    [updateParams],
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      updateParams({ pageSize: size.toString(), page: "1" });
    },
    [updateParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  // Computed values
  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        query.brandId ||
        query.minPrice ||
        query.maxPrice ||
        (query.colorIds && query.colorIds.length > 0) ||
        (query.sizeIds && query.sizeIds.length > 0) ||
        query.search,
      ),
    [
      query.brandId,
      query.minPrice,
      query.maxPrice,
      query.colorIds,
      query.sizeIds,
      query.search,
    ],
  );

  const filterState = useMemo(
    () => ({
      brandId: query.brandId,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      colorIds: query.colorIds,
      sizeIds: query.sizeIds,
    }),
    [
      query.brandId,
      query.minPrice,
      query.maxPrice,
      query.colorIds,
      query.sizeIds,
    ],
  );

  const totalPages = sneakersData?.totalPages || 0;
  const totalItems = sneakersData?.totalItems || 0;
  const hasPreviousPage = pageNumber > 1;
  const hasNextPage = pageNumber < totalPages;

  // Filter content component for toolbar sheet
  const FilterContentComponent = useCallback(
    () => (
      <SneakerListFilter
        filterState={filterState}
        expandedFilters={expandedFilters}
        hasActiveFilters={hasActiveFilters}
        brands={brands ?? undefined}
        colors={colors ?? undefined}
        sizes={sizes ?? undefined}
        onBrandChange={handleBrandChange}
        onPriceRangeChange={handlePriceRangeChange}
        onColorToggle={handleColorToggle}
        onSizeToggle={handleSizeToggle}
        onExpandedFilterChange={handleExpandedFilterChange}
        onClearFilters={clearFilters}
      />
    ),
    [
      filterState,
      expandedFilters,
      hasActiveFilters,
      brands,
      colors,
      sizes,
      handleBrandChange,
      handlePriceRangeChange,
      handleColorToggle,
      handleSizeToggle,
      handleExpandedFilterChange,
      clearFilters,
    ],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Giày Sneaker</h1>
          <p className="text-muted-foreground">
            Khám phá bộ sưu tập giày sneaker chính hãng từ các thương hiệu nổi
            tiếng
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-lg p-4 shadow-sm sticky top-4">
              <h2 className="font-semibold mb-4">Bộ lọc</h2>
              <SneakerListFilter
                filterState={filterState}
                expandedFilters={expandedFilters}
                hasActiveFilters={hasActiveFilters}
                brands={brands ?? undefined}
                colors={colors ?? undefined}
                sizes={sizes ?? undefined}
                onBrandChange={handleBrandChange}
                onPriceRangeChange={handlePriceRangeChange}
                onColorToggle={handleColorToggle}
                onSizeToggle={handleSizeToggle}
                onExpandedFilterChange={handleExpandedFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <SneakerListToolbar
              search={searchFromUrl}
              sortBy={query.sortBy || "createdAt"}
              sortOrder={query.sortOrder || "desc"}
              hasActiveFilters={hasActiveFilters}
              totalItems={totalItems}
              displayedItems={sneakersData?.items?.length}
              onSearchChange={handleSearchChange}
              onSortChange={handleSortChange}
              FilterContent={FilterContentComponent}
            />

            {/* Products Grid */}
            <SneakerListGrid
              sneakers={sneakersData?.items}
              isLoading={isLoading}
              error={error}
              currentPage={pageNumber}
              pageSize={pageSize}
              totalPages={totalPages}
              totalItems={totalItems}
              hasPreviousPage={hasPreviousPage}
              hasNextPage={hasNextPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onClearFilters={clearFilters}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SneakerListIndex;
