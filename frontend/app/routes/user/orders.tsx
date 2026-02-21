import type { Route } from "./+types/orders";
import OrderListPage from "~/components/feature/user/orders/order-list.index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Đơn hàng của tôi | Sneaker Shop" },
    {
      name: "description",
      content: "Xem và quản lý đơn hàng của bạn",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function OrdersRoute() {
  return <OrderListPage />;
}
