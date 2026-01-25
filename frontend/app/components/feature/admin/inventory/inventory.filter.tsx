import { Search, X, Filter, RotateCcw } from "lucide-react";
import { useState, useCallback, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { useAllStores } from "~/hooks/react-query/use-store.query";
import { SellableType } from "~/types/entities/sellable.type";

interface InventoryFilterProps {
  search: string;
  storeId: number | undefined;
  sellableType: string | undefined;
  lowStock: boolean | undefined;
  onSearchChange: (search: string) => void;
  onStoreIdChange: (storeId: number | undefined) => void;
  onSellableTypeChange: (sellableType: string | undefined) => void;
  onLowStockChange: (lowStock: boolean | undefined) => void;
  onReset: () => void;
  className?: string;
}

export const InventoryFilter = ({
  search,
  storeId,
  sellableType,
  lowStock,
  onSearchChange,
  onStoreIdChange,
  onSellableTypeChange,
  onLowStockChange,
  onReset,
  className,
}: InventoryFilterProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch stores for filter dropdown
  const { data: storesData } = useAllStores();

  // Debounce search with lodash
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        onSearchChange(value);
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
      setLocalSearch(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  // Sync local search with props
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleReset = useCallback(() => {
    setLocalSearch("");
    onReset();
  }, [onReset]);

  const hasActiveFilters =
    search ||
    storeId !== undefined ||
    sellableType !== undefined ||
    lowStock === true;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search bar và toggle button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên sản phẩm, SKU..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {localSearch && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          variant={isExpanded ? "secondary" : "outline"}
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0"
        >
          <Filter className="h-4 w-4" />
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="shrink-0"
            title="Đặt lại bộ lọc"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter options - expandable */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg border bg-muted/30 animate-in slide-in-from-top-2 duration-200">
          {/* Store filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cửa hàng</label>
            <Select
              value={storeId?.toString() || "all"}
              onValueChange={(value) => {
                onStoreIdChange(value === "all" ? undefined : Number(value));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn cửa hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả cửa hàng</SelectItem>
                {storesData?.items?.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sellable type filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Loại sản phẩm</label>
            <Select
              value={sellableType || "all"}
              onValueChange={(value) => {
                onSellableTypeChange(value === "all" ? undefined : value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value={SellableType.SNEAKER_VARIANT}>
                  Giày Sneaker
                </SelectItem>
                <SelectItem value={SellableType.ACCESSORY}>Phụ kiện</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Low stock filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Trạng thái tồn kho</label>
            <div className="flex items-center space-x-2 h-10">
              <Switch
                id="low-stock"
                checked={lowStock === true}
                onCheckedChange={(checked) => {
                  onLowStockChange(checked ? true : undefined);
                }}
              />
              <Label htmlFor="low-stock" className="text-sm cursor-pointer">
                Chỉ hiển thị sắp hết hàng
              </Label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryFilter;
