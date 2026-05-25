import { memo } from "react";
import { X, ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { cn } from "~/lib/utils";
import type { GetBrandItem } from "~/services/shop/brand/dto/get-brand/get-brand.response";
import type { GetColorItem } from "~/services/attribute/color/dto/get-color/get-color.response";
import type { GetSizeItem } from "~/services/attribute/size/dto/get-size/get-size.response";

const priceRanges = [
  { label: "Tất cả", min: undefined, max: undefined },
  { label: "Dưới 2 triệu", min: undefined, max: 2000000 },
  { label: "2 - 5 triệu", min: 2000000, max: 5000000 },
  { label: "5 - 10 triệu", min: 5000000, max: 10000000 },
  { label: "Trên 10 triệu", min: 10000000, max: undefined },
];

interface SneakerFilterState {
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  colorIds?: number[];
  sizeIds?: number[];
}

interface ExpandedFilters {
  brand: boolean;
  price: boolean;
  color: boolean;
  size: boolean;
}

interface SneakerListFilterProps {
  filterState: SneakerFilterState;
  expandedFilters: ExpandedFilters;
  hasActiveFilters: boolean;
  brands?: GetBrandItem[];
  colors?: GetColorItem[];
  sizes?: GetSizeItem[];
  onBrandChange: (brandId: number | undefined) => void;
  onPriceRangeChange: (min?: number, max?: number) => void;
  onColorToggle: (colorId: number) => void;
  onSizeToggle: (sizeId: number) => void;
  onExpandedFilterChange: (key: keyof ExpandedFilters, open: boolean) => void;
  onClearFilters: () => void;
}

export const SneakerListFilter = memo(function SneakerListFilter({
  filterState,
  expandedFilters,
  hasActiveFilters,
  brands,
  colors,
  sizes,
  onBrandChange,
  onPriceRangeChange,
  onColorToggle,
  onSizeToggle,
  onExpandedFilterChange,
  onClearFilters,
}: SneakerListFilterProps) {
  return (
    <div className="space-y-6">
      {/* Clear Filters */}
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

      {/* Color Filter */}
      <Collapsible
        open={expandedFilters.color}
        onOpenChange={(open) => onExpandedFilterChange("color", open)}
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-semibold">
          Màu sắc
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expandedFilters.color && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="flex flex-wrap gap-2">
            {colors?.map((color) => (
              <div
                key={color.id}
                className={cn(
                  "h-8 w-8 rounded-full cursor-pointer border-2 transition-all",
                  filterState.colorIds?.includes(color.id)
                    ? "ring-2 ring-primary ring-offset-2"
                    : "border-gray-200 hover:border-gray-400",
                )}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                onClick={() => onColorToggle(color.id)}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Size Filter */}
      <Collapsible
        open={expandedFilters.size}
        onOpenChange={(open) => onExpandedFilterChange("size", open)}
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-semibold">
          Kích cỡ
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expandedFilters.size && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="flex flex-wrap gap-2">
            {sizes?.map((size) => (
              <div
                key={size.id}
                className={cn(
                  "px-3 py-1 rounded border text-sm cursor-pointer transition-colors",
                  filterState.sizeIds?.includes(size.id)
                    ? "bg-primary text-white border-primary"
                    : "border-gray-200 hover:border-gray-400",
                )}
                onClick={() => onSizeToggle(size.id)}
                title={`${size.system} ${size.value}`}
              >
                <span className="font-medium">{size.system}</span>{" "}
                <span>{size.value}</span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
});

export default SneakerListFilter;
