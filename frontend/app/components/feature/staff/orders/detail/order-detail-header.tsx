import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import type { GetStaffOrderDetailResponse } from "~/services/order/dto/get-staff-order-detail/get-staff-order-detail.response";
import { formatDate } from "~/common/helpers/format-date.helper";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { STATUS_CLASS } from "./constants";

type OrderDetailHeaderProps = {
  order: GetStaffOrderDetailResponse;
};

const OrderDetailHeader = ({ order }: OrderDetailHeaderProps) => {
  return (
    <>
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/staff/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách đơn
        </Link>
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {order.orderCode}
          </h1>
          <p className="text-sm text-muted-foreground">
            Tạo lúc: {order.placedAt ? formatDate(order.placedAt) : "-"}
          </p>
        </div>
        <Badge variant="outline" className={STATUS_CLASS[order.status] || ""}>
          {order.status}
        </Badge>
      </div>
    </>
  );
};

export default OrderDetailHeader;
