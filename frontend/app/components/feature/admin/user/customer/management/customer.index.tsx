import { useState, useCallback } from "react";
import { Pagination } from "~/components/common/shared/pagination";
import { CustomerFilter } from "./customer.filter";
import { CustomerListItem } from "./customer.list-item";
import {
  useAdminCustomerList,
  useToggleCustomerActive,
} from "~/hooks/react-query/use-admin-customer.query";
import type { CustomerItem } from "~/services/user/customer/dto/get-customers/get-customers.response";
import type { GetCustomersRequest } from "~/services/user/customer/dto/get-customers/get-customers.request";
import { SortOrder } from "~/types/global/filter/sort-order.filter";

export const CustomerIndex = () => {
  const [query, setQuery] = useState<GetCustomersRequest>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    isActive: undefined,
    hasAccount: undefined,
    sortBy: "createdAt",
    sortOrder: SortOrder.DESC,
  });

  const { data, isLoading } = useAdminCustomerList(query);
  const toggleActiveMutation = useToggleCustomerActive();

  const handleSearchChange = useCallback((search: string) => {
    setQuery((prev) => ({ ...prev, search, pageNumber: 1 }));
  }, []);

  const handleIsActiveChange = useCallback((isActive: boolean | undefined) => {
    setQuery((prev) => ({ ...prev, isActive, pageNumber: 1 }));
  }, []);

  const handleHasAccountChange = useCallback(
    (hasAccount: boolean | undefined) => {
      setQuery((prev) => ({ ...prev, hasAccount, pageNumber: 1 }));
    },
    [],
  );

  const handleSortByChange = useCallback(
    (sortBy: GetCustomersRequest["sortBy"]) => {
      setQuery((prev) => ({ ...prev, sortBy }));
    },
    [],
  );

  const handleSortOrderChange = useCallback((sortOrder: SortOrder) => {
    setQuery((prev) => ({ ...prev, sortOrder }));
  }, []);

  const handleResetFilter = useCallback(() => {
    setQuery({
      pageNumber: 1,
      pageSize: 10,
      search: "",
      isActive: undefined,
      hasAccount: undefined,
      sortBy: "createdAt",
      sortOrder: SortOrder.DESC,
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, pageNumber: page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize, pageNumber: 1 }));
  }, []);

  const handleToggleActive = useCallback(
    (customer: CustomerItem) => {
      toggleActiveMutation.mutate(customer.id);
    },
    [toggleActiveMutation],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
          {data && (
            <p className="text-sm text-muted-foreground mt-1">
              {data.totalItems} khách hàng
            </p>
          )}
        </div>
      </div>

      <CustomerFilter
        search={query.search ?? ""}
        isActive={query.isActive}
        hasAccount={query.hasAccount}
        sortBy={query.sortBy ?? "createdAt"}
        sortOrder={query.sortOrder ?? SortOrder.DESC}
        onSearchChange={handleSearchChange}
        onIsActiveChange={handleIsActiveChange}
        onHasAccountChange={handleHasAccountChange}
        onSortByChange={handleSortByChange}
        onSortOrderChange={handleSortOrderChange}
        onReset={handleResetFilter}
      />

      <CustomerListItem
        customers={data?.items}
        isLoading={isLoading}
        onToggleActive={handleToggleActive}
      />

      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={query.pageNumber ?? 1}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
          pageSize={query.pageSize ?? 10}
          hasPreviousPage={data.hasPreviousPage}
          hasNextPage={data.hasNextPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};
