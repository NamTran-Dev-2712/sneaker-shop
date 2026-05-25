import VoucherIndex from "~/components/feature/admin/finance/voucher/management/voucher.index";
import type { Route } from "./+types/voucher.management";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quản lý Voucher - Admin Panel" },
    {
      name: "description",
      content: "Tạo và quản lý các mã giảm giá cho cửa hàng",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function VoucherManagementRoute() {
  return <VoucherIndex />;
}
