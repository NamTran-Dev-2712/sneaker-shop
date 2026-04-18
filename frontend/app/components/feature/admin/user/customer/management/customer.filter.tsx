import { Search, RotateCcw, Filter } from "lucide-react";
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
import { SortOrder } from "~/types/global/filter/sort-order.filter";
import { cn } from "~/lib/utils";
import type { SortCustomerBy } from "~/services/user/customer/dto/get-customers/get-customers.request";

interface CustomerFilterProps {
  search: string;
  isActive: boolean | undefined;
  hasAccount: boolean | undefined;
  sortBy: SortCustomerBy;
  sortOrder: SortOrder;
  onSearchChange: (search: string) => void;
  onIsActiveChange: (isActive: boolean | undefined) => void;
  onHasAccountChange: (hasAccount: boolean | undefined) => void;
  onSortByChange: (sortBy: SortCustomerBy) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
  onReset: () => void;
  className?: string;
}

export const CustomerFilter = ({
  search,
  isActive,
  hasAccount,
  sortBy,
  sortOrder,
  onSearchChange,
  onIsActiveChange,
  onHasAccountChange,
  onSortByChange,
  onSortOrderChange,
  onReset,
  className,
}: CustomerFilterProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [isExpanded, setIsExpanded] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        onSearchChange(value);
      }, 500),
    [onSearchChange],
  );

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

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleReset = useCallback(() => {
    setLocalSearch("");
    onReset();
  }, [onReset]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, SĐT, email..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsExpanded((prev) => !prev)}
          title="Bộ lọc nâng cao"
        >
          <Filter className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          title="Đặt lại bộ lọc"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Select
            value={hasAccount === undefined ? "all" : hasAccount ? "yes" : "no"}
            onValueChange={(v) =>
              onHasAccountChange(
                v === "all" ? undefined : v === "yes" ? true : false,
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Loại khách" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="yes">Có tài khoản</SelectItem>
              <SelectItem value="no">Vãng lai</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={
              isActive === undefined ? "all" : isActive ? "active" : "inactive"
            }
            onValueChange={(v) =>
              onIsActiveChange(
                v === "all" ? undefined : v === "active" ? true : false,
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Đã khoá</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(v) => onSortByChange(v as SortCustomerBy)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Tên</SelectItem>
              <SelectItem value="createdAt">Ngày tạo</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(v) => onSortOrderChange(v as SortOrder)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Thứ tự" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SortOrder.ASC}>Tăng dần</SelectItem>
              <SelectItem value={SortOrder.DESC}>Giảm dần</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
