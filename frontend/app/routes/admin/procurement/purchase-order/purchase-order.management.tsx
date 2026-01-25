import PurchaseOrderManagementIndex from "~/components/feature/admin/procurement/purchase-order/management/purchase-order.index";
import type { Route } from "./+types/purchase-order.management";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quản lý đơn đặt hàng - Admin Panel" },
    {
      name: "description",
      content: "Quản lý đơn đặt hàng từ nhà cung cấp",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function PurchaseOrderManagementRoute() {
  return <PurchaseOrderManagementIndex />;
}
