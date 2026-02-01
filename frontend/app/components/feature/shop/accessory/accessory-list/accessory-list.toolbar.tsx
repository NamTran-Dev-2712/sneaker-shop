import { memo, useState, useCallback, useEffect, useMemo, useRef } from "react";
import debounce from "lodash/debounce";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

const sortOptions = [
  { value: "createdAt-desc", label: "Mới nhất" },
  { value: "createdAt-asc", label: "Cũ nhất" },
  { value: "price-asc", label: "Giá thấp đến cao" },
  { value: "price-desc", label: "Giá cao đến thấp" },
  { value: "name-asc", label: "Tên A-Z" },
  { value: "name-desc", label: "Tên Z-A" },
];

interface AccessoryListToolbarProps {
  search: string;
  sortBy: string;
  sortOrder: string;
  hasActiveFilters: boolean;
  totalItems?: number;
  displayedItems?: number;
  onSearchChange: (search: string) => void;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  FilterContent: React.ComponentType;
}

export const AccessoryListToolbar = memo(function AccessoryListToolbar({
  search,
  sortBy,
  sortOrder,
  hasActiveFilters,
  totalItems,
  displayedItems,
  onSearchChange,
  onSortChange,
  FilterContent,
}: AccessoryListToolbarProps) {
  // Use ref to track if user is actively typing to prevent sync conflicts
  const isTypingRef = useRef(false);
  const [localSearch, setLocalSearch] = useState(search);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Debounce search with lodash - also reset typing flag after debounce
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        onSearchChange(value);
        // Reset typing flag after debounce completes and URL is updated
        setTimeout(() => {
          isTypingRef.current = false;
        }, 50);
      }, 500),
    [onSearchChange],
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = useCallback(
    (value: string) => {
      isTypingRef.current = true;
      setLocalSearch(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  // Sync local search with props when it changes externally (e.g., clear filters, page load with URL params)
  // Only sync if user is NOT actively typing to prevent overwriting user input
  useEffect(() => {
    if (!isTypingRef.current && search !== localSearch) {
      setLocalSearch(search);
    }
  }, [search, localSearch]);

  const handleSortChange = useCallback(
    (value: string) => {
      const [newSortBy, newSortOrder] = value.split("-");
      onSortChange(newSortBy, newSortOrder);
    },
    [onSortChange],
  );

  const clearLocalSearch = useCallback(() => {
    setLocalSearch("");
    onSearchChange("");
  }, [onSearchChange]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm phụ kiện..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {localSearch && (
            <button
              onClick={clearLocalSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile Filter Button */}
        <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Bộ lọc
              {hasActiveFilters && (
                <span className="ml-2 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Bộ lọc</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>

        {/* Sort */}
        <Select
          value={`${sortBy}-${sortOrder}`}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      {totalItems !== undefined && (
        <p className="text-sm text-muted-foreground mt-4">
          Hiển thị {displayedItems || 0} / {totalItems} sản phẩm
        </p>
      )}
    </div>
  );
});

export default AccessoryListToolbar;
