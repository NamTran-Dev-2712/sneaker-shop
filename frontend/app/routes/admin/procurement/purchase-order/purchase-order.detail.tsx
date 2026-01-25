import { PurchaseOrderViewDetail } from "~/components/feature/admin/procurement/purchase-order/detail/purchase-order.view-detail";
import type { Route } from "./+types/purchase-order.detail";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chi tiết đơn nhập hàng - Admin Panel" },
    {
      name: "description",
      content: "Xem chi tiết đơn nhập hàng và danh sách sản phẩm",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function PurchaseOrderDetailRoute() {
  return <PurchaseOrderViewDetail />;
}
