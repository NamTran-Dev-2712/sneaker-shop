import { memo } from "react";
import { X, ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { cn } from "~/lib/utils";
import type { GetCategoryAccessoryItem } from "~/services/shop/category/dto/get-category-accessory/get-category-accessory.response";
import type { GetBrandItem } from "~/services/shop/brand/dto/get-brand/get-brand.response";

const priceRanges = [
  { label: "Tất cả", min: undefined, max: undefined },
  { label: "Dưới 200K", min: undefined, max: 200000 },
  { label: "200K - 500K", min: 200000, max: 500000 },
  { label: "500K - 1 triệu", min: 500000, max: 1000000 },
  { label: "Trên 1 triệu", min: 1000000, max: undefined },
];

interface AccessoryFilterState {
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
}

interface ExpandedFilters {
  category: boolean;
  brand: boolean;
  price: boolean;
}

interface AccessoryListFilterProps {
  filterState: AccessoryFilterState;
  expandedFilters: ExpandedFilters;
  hasActiveFilters: boolean;
  categories?: GetCategoryAccessoryItem[];
  brands?: GetBrandItem[];
  onCategoryChange: (categoryId: number | undefined) => void;
  onBrandChange: (brandId: number | undefined) => void;
  onPriceRangeChange: (min?: number, max?: number) => void;
  onExpandedFilterChange: (key: keyof ExpandedFilters, open: boolean) => void;
  onClearFilters: () => void;
}

export const AccessoryListFilter = memo(function AccessoryListFilter({
  filterState,
  expandedFilters,
  hasActiveFilters,
  categories,
  brands,
  onCategoryChange,
  onBrandChange,
  onPriceRangeChange,
  onExpandedFilterChange,
  onClearFilters,
}: AccessoryListFilterProps) {
  return (
    <div className="space-y-6">
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onClearFilters}
        >
          <X className="h-4 w-4 mr-2" />
          Xóa bộ lọc
        </Button>
      )}

      {/* Category Filter */}
      <Collapsible
        open={expandedFilters.category}
        onOpenChange={(open) => onExpandedFilterChange("category", open)}
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-semibold">
          Danh mục
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expandedFilters.category && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          <div
            className={cn(
              "cursor-pointer px-2 py-1 rounded text-sm",
              !filterState.categoryId
                ? "bg-primary text-white"
                : "hover:bg-gray-100",
            )}
            onClick={() => onCategoryChange(undefined)}
          >
            Tất cả
          </div>
          {categories?.map((category) => (
            <div
              key={category.id}
              className={cn(
                "cursor-pointer px-2 py-1 rounded text-sm",
                filterState.categoryId === category.id
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100",
              )}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Brand Filter */}
      <Collapsible
        open={expandedFilters.brand}
        onOpenChange={(open) => onExpandedFilterChange("brand", open)}
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-semibold">
          Thương hiệu
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expandedFilters.brand && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          <div
            className={cn(
              "cursor-pointer px-2 py-1 rounded text-sm",
              !filterState.brandId
                ? "bg-primary text-white"
                : "hover:bg-gray-100",
            )}
            onClick={() => onBrandChange(undefined)}
          >
            Tất cả
          </div>
          {brands?.map((brand) => (
            <div
              key={brand.id}
              className={cn(
                "cursor-pointer px-2 py-1 rounded text-sm",
                filterState.brandId === brand.id
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100",
              )}
              onClick={() => onBrandChange(brand.id)}
            >
              {brand.name}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Filter */}
      <Collapsible
        open={expandedFilters.price}
        onOpenChange={(open) => onExpandedFilterChange("price", open)}
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-semibold">
          Khoảng giá
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expandedFilters.price && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          {priceRanges.map((range) => (
            <div
              key={range.label}
              className={cn(
                "cursor-pointer px-2 py-1 rounded text-sm",
                filterState.minPrice === range.min &&
                  filterState.maxPrice === range.max
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100",
              )}
              onClick={() => onPriceRangeChange(range.min, range.max)}
            >
              {range.label}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
});

export default AccessoryListFilter;
