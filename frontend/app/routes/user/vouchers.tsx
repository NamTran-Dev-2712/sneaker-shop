import type { Route } from "./+types/vouchers";
import VoucherPage from "~/components/feature/user/voucher/voucher.page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Voucher của tôi | Sneaker Shop" },
    {
      name: "description",
      content: "Xem danh sách voucher có thể sử dụng và lịch sử đổi voucher",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function VouchersRoute() {
  return <VoucherPage />;
}
