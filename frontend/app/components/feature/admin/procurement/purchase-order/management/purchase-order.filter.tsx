import { Search, X, Filter, RotateCcw, Calendar } from "lucide-react";
import { useState, useCallback, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar as CalendarComponent } from "~/components/ui/calendar";
import { cn } from "~/lib/utils";
import { useAllVendors } from "~/hooks/react-query/use-vendor.query";
import { useAllStores } from "~/hooks/react-query/use-store.query";
import { PurchaseStatus } from "~/types/entities/purchase-order.type";
import { getPurchaseStatusOptions } from "./purchase-order.status-badge";

interface PurchaseOrderFilterProps {
  search: string;
  vendorId: number | undefined;
  storeId: number | undefined;
  status: PurchaseStatus | undefined;
  fromDate: string | undefined;
  toDate: string | undefined;
  onSearchChange: (search: string) => void;
  onVendorIdChange: (vendorId: number | undefined) => void;
  onStoreIdChange: (storeId: number | undefined) => void;
  onStatusChange: (status: PurchaseStatus | undefined) => void;
  onFromDateChange: (date: string | undefined) => void;
  onToDateChange: (date: string | undefined) => void;
  onReset: () => void;
  className?: string;
}

export const PurchaseOrderFilter = ({
  search,
  vendorId,
  storeId,
  status,
  fromDate,
  toDate,
  onSearchChange,
  onVendorIdChange,
  onStoreIdChange,
  onStatusChange,
  onFromDateChange,
  onToDateChange,
  onReset,
  className,
}: PurchaseOrderFilterProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch vendors and stores for filter dropdown
  const { data: vendorsData } = useAllVendors();
  const { data: storesData } = useAllStores();

  const statusOptions = getPurchaseStatusOptions();

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
    vendorId !== undefined ||
    storeId !== undefined ||
    status !== undefined ||
    fromDate !== undefined ||
    toDate !== undefined;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search bar và toggle button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã đơn..."
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4 rounded-lg border bg-muted/30 animate-in slide-in-from-top-2 duration-200">
          {/* Vendor filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nhà cung cấp</label>
            <Select
              value={vendorId?.toString() || "all"}
              onValueChange={(value) => {
                onVendorIdChange(value === "all" ? undefined : Number(value));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn nhà cung cấp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {vendorsData?.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id.toString()}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
                <SelectItem value="all">Tất cả</SelectItem>
                {storesData?.items?.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Trạng thái</label>
            <Select
              value={status ? String(status) : "all"}
              onValueChange={(value) => {
                onStatusChange(
                  value === "all"
                    ? undefined
                    : (value as unknown as PurchaseStatus),
                );
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {statusOptions.map((opt) => (
                  <SelectItem key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* From date filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Từ ngày</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fromDate && "text-muted-foreground",
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {fromDate
                    ? format(new Date(fromDate), "dd/MM/yyyy", { locale: vi })
                    : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={fromDate ? new Date(fromDate) : undefined}
                  onSelect={(date) => {
                    onFromDateChange(date ? date.toISOString() : undefined);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* To date filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Đến ngày</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !toDate && "text-muted-foreground",
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {toDate
                    ? format(new Date(toDate), "dd/MM/yyyy", { locale: vi })
                    : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={toDate ? new Date(toDate) : undefined}
                  onSelect={(date) => {
                    onToDateChange(date ? date.toISOString() : undefined);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderFilter;
