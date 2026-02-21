import type { Route } from "./+types/order-detail";
import OrderDetailPage from "~/components/feature/user/orders/order-detail.index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chi tiết đơn hàng | Sneaker Shop" },
    {
      name: "description",
      content: "Xem chi tiết đơn hàng",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function OrderDetailRoute() {
  return <OrderDetailPage />;
}
