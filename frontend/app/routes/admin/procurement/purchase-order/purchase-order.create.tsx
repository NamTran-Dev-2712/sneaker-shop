import { PurchaseOrderCreateForm } from "~/components/feature/admin/procurement/purchase-order/create/purchase-order.create-form";
import type { Route } from "./+types/purchase-order.create";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tạo đơn nhập hàng - Admin Panel" },
    {
      name: "description",
      content: "Tạo đơn nhập hàng mới từ nhà cung cấp",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function PurchaseOrderCreateRoute() {
  return <PurchaseOrderCreateForm />;
}
