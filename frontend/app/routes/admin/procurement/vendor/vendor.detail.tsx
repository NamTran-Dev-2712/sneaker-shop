import { VendorViewDetail } from "~/components/feature/admin/procurement/vendor/detail/vendor.view-detail";
import type { Route } from "./+types/vendor.detail";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chi tiết nhà cung cấp - Admin Panel" },
    {
      name: "description",
      content: "Xem chi tiết thông tin nhà cung cấp và danh sách giá sản phẩm",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function VendorDetailRoute() {
  return <VendorViewDetail />;
}
