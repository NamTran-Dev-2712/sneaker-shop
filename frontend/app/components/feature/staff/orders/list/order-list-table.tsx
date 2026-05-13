import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { formatDate } from "~/common/helpers/format-date.helper";
import { formatCurrency } from "~/common/helpers/format-currency.helper";
import type { StoreOrderListItem } from "~/services/order/dto/get-store-orders/get-store-orders.response";
import { STATUS_CLASS } from "./constants";

interface OrderListTableProps {
  items: StoreOrderListItem[];
}

const OrderListTable = ({ items }: OrderListTableProps) => {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mã đơn</TableHead>
          <TableHead>Khách hàng</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Thanh toán</TableHead>
          <TableHead>Loại</TableHead>
          <TableHead className="text-right">Tổng tiền</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow
            key={item.orderId}
            className="cursor-pointer"
            onClick={() => navigate(`/staff/orders/${item.orderId}`)}
          >
            <TableCell className="font-medium">{item.orderCode}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span>{item.customerName || "Khách lẻ"}</span>
                <span className="text-xs text-muted-foreground">
                  {item.customerPhone || "-"}
                </span>
              </div>
            </TableCell>
            <TableCell>
              {item.placedAt ? formatDate(item.placedAt) : "-"}
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={STATUS_CLASS[item.status] || ""}
              >
                {item.status}
              </Badge>
            </TableCell>
            <TableCell>{item.paymentStatus}</TableCell>
            <TableCell>{item.fulfillmentType}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(item.total)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderListTable;
