import { useNavigate } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { formatCurrency } from "~/common/helpers/format-currency.helper";
import type { StoreOrderListItem } from "~/services/order/dto/get-store-orders/get-store-orders.response";
import { STATUS_CLASS } from "./constants";

interface OrderListMobileCardsProps {
  items: StoreOrderListItem[];
}

const OrderListMobileCards = ({ items }: OrderListMobileCardsProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3 md:hidden">
      {items.map((item) => (
        <Card
          key={item.orderId}
          className="cursor-pointer"
          onClick={() => navigate(`/staff/orders/${item.orderId}`)}
        >
          <CardContent className="space-y-2 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{item.orderCode}</p>
              <Badge
                variant="outline"
                className={STATUS_CLASS[item.status] || ""}
              >
                {item.status}
              </Badge>
            </div>
            <p className="text-sm">{item.customerName || "Khách lẻ"}</p>
            <p className="text-xs text-muted-foreground">
              {item.customerPhone || "-"}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span>{item.fulfillmentType}</span>
              <span className="font-semibold">
                {formatCurrency(item.total)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderListMobileCards;
