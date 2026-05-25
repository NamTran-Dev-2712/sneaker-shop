import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useAccessoryList } from "~/hooks/react-query/use-accessory.query";
import { useCategoryAll } from "~/hooks/react-query/use-category.query";
import { useAllBrands } from "~/hooks/react-query/use-brand.query";
import { AccessoryListFilter } from "./accessory-list.filter";
import { AccessoryListToolbar } from "./accessory-list.toolbar";
import { AccessoryListGrid } from "./accessory-list.grid";
import type { GetAccessoryRequest } from "~/services/shop/accessory/dto/get-accessory/get-accessory.request";

interface ExpandedFilters {
  category: boolean;
  brand: boolean;
  price: boolean;
}

export const AccessoryListIndex = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State for expanded filters only - search is managed in URL
  const [expandedFilters, setExpandedFilters] = useState<ExpandedFilters>({
    category: true,
    brand: true,
    price: true,
  });

  // Parse query params
  const pageNumber = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "12");
  const searchFromUrl = searchParams.get("search") || "";

  // Build query object
  const query: GetAccessoryRequest = useMemo(
    () => ({
      pageNumber,
      pageSize,
      search: searchFromUrl || undefined,
      categoryId: searchParams.get("categoryId")
        ? parseInt(searchParams.get("categoryId")!)
        : undefined,
      brandId: searchParams.get("brandId")
        ? parseInt(searchParams.get("brandId")!)
        : undefined,
      minPrice: searchParams.get("minPrice")
        ? parseInt(searchParams.get("minPrice")!)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? parseInt(searchParams.get("maxPrice")!)
        : undefined,
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
      isActive: true,
    }),
    [pageNumber, pageSize, searchFromUrl, searchParams],
  );

  // Queries
  const { data: accessoriesData, isLoading, error } = useAccessoryList(query);
  const { data: categories } = useCategoryAll();
  const { data: brands } = useAllBrands();

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

  const handleCategoryChange = useCallback(
    (categoryId: number | undefined) => {
      updateParams({ categoryId: categoryId?.toString() });
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
        query.categoryId ||
        query.brandId ||
        query.minPrice ||
        query.maxPrice ||
        query.search,
      ),
    [
      query.categoryId,
      query.brandId,
      query.minPrice,
      query.maxPrice,
      query.search,
    ],
  );

  const filterState = useMemo(
    () => ({
      categoryId: query.categoryId,
      brandId: query.brandId,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
    }),
    [query.categoryId, query.brandId, query.minPrice, query.maxPrice],
  );

  const totalPages = accessoriesData?.totalPages || 0;
  const totalItems = accessoriesData?.totalItems || 0;
  const hasPreviousPage = pageNumber > 1;
  const hasNextPage = pageNumber < totalPages;

  // Filter content component for toolbar sheet
  const FilterContentComponent = useCallback(
    () => (
      <AccessoryListFilter
        filterState={filterState}
        expandedFilters={expandedFilters}
        hasActiveFilters={hasActiveFilters}
        categories={categories ?? undefined}
        brands={brands ?? undefined}
        onCategoryChange={handleCategoryChange}
        onBrandChange={handleBrandChange}
        onPriceRangeChange={handlePriceRangeChange}
        onExpandedFilterChange={handleExpandedFilterChange}
        onClearFilters={clearFilters}
      />
    ),
    [
      filterState,
      expandedFilters,
      hasActiveFilters,
      categories,
      brands,
      handleCategoryChange,
      handleBrandChange,
      handlePriceRangeChange,
      handleExpandedFilterChange,
      clearFilters,
    ],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Phụ Kiện</h1>
          <p className="text-muted-foreground">
            Phụ kiện chăm sóc và bảo vệ giày sneaker của bạn
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-lg p-4 shadow-sm sticky top-4">
              <h2 className="font-semibold mb-4">Bộ lọc</h2>
              <AccessoryListFilter
                filterState={filterState}
                expandedFilters={expandedFilters}
                hasActiveFilters={hasActiveFilters}
                categories={categories ?? undefined}
                brands={brands ?? undefined}
                onCategoryChange={handleCategoryChange}
                onBrandChange={handleBrandChange}
                onPriceRangeChange={handlePriceRangeChange}
                onExpandedFilterChange={handleExpandedFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <AccessoryListToolbar
              search={searchFromUrl}
              sortBy={query.sortBy || "createdAt"}
              sortOrder={query.sortOrder || "desc"}
              hasActiveFilters={hasActiveFilters}
              totalItems={totalItems}
              displayedItems={accessoriesData?.items?.length}
              onSearchChange={handleSearchChange}
              onSortChange={handleSortChange}
              FilterContent={FilterContentComponent}
            />

            {/* Products Grid */}
            <AccessoryListGrid
              accessories={accessoriesData?.items}
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

export default AccessoryListIndex;
