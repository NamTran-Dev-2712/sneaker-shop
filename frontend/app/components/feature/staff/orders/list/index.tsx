import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { Card, CardContent } from "~/components/ui/card";
import { Pagination } from "~/components/common/shared/pagination";
import { useStoreOrders } from "~/hooks/react-query/use-staff-order.query";
import OrderListFilters from "./order-list-filters";
import OrderListMobileCards from "./order-list-mobile-cards";
import OrderListSkeleton from "./order-list-skeleton";
import OrderListTable from "./order-list-table";

const StaffOrdersListPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [paymentStatus, setPaymentStatus] = useState("ALL");
  const [fulfillmentType, setFulfillmentType] = useState("ALL");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setPageNumber(1);
      }, 500),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchInputChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      debouncedSearch(value.trim());
    },
    [debouncedSearch],
  );

  const params = useMemo(
    () => ({
      pageNumber,
      pageSize,
      search: search || undefined,
      status: status === "ALL" ? undefined : status,
      paymentStatus: paymentStatus === "ALL" ? undefined : paymentStatus,
      fulfillmentType: fulfillmentType === "ALL" ? undefined : fulfillmentType,
    }),
    [fulfillmentType, pageNumber, pageSize, paymentStatus, search, status],
  );

  const { data, isLoading, isError } = useStoreOrders(params);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý đơn hàng</h1>
        <p className="text-muted-foreground">
          Theo dõi và xử lý đơn theo chi nhánh đang làm việc.
        </p>
      </div>

      <Card>
        <OrderListFilters
          searchInput={searchInput}
          status={status}
          paymentStatus={paymentStatus}
          fulfillmentType={fulfillmentType}
          onSearchInputChange={handleSearchInputChange}
          onStatusChange={(value) => {
            setStatus(value);
            setPageNumber(1);
          }}
          onPaymentStatusChange={(value) => {
            setPaymentStatus(value);
            setPageNumber(1);
          }}
          onFulfillmentTypeChange={(value) => {
            setFulfillmentType(value);
            setPageNumber(1);
          }}
        />
      </Card>

      {isLoading ? (
        <OrderListSkeleton />
      ) : isError || !data ? (
        <Card>
          <CardContent className="p-10 text-center text-sm text-red-500">
            Không thể tải danh sách đơn hàng. Vui lòng thử lại.
          </CardContent>
        </Card>
      ) : data.items.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            Không có đơn hàng phù hợp với điều kiện lọc.
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="hidden md:block">
            <CardContent className="p-0">
              <OrderListTable items={data.items} />
            </CardContent>
          </Card>

          <OrderListMobileCards items={data.items} />

          <Pagination
            currentPage={pageNumber}
            totalPages={data.totalPages}
            totalItems={data.totalItems}
            pageSize={pageSize}
            hasPreviousPage={data.hasPreviousPage}
            hasNextPage={data.hasNextPage}
            onPageChange={setPageNumber}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPageNumber(1);
            }}
          />
        </>
      )}
    </div>
  );
};

export default StaffOrdersListPage;
