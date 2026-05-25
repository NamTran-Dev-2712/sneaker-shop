import type { Route } from "./+types/checkout.vnpay-return";
import CheckoutVnPayReturn from "~/components/feature/shop/checkout/checkout.vnpay-return";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kết quả thanh toán VNPay | Sneaker Shop" },
    {
      name: "description",
      content: "Xác nhận và hiển thị kết quả thanh toán VNPay",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function CheckoutVnPayReturnRoute() {
  return <CheckoutVnPayReturn />;
}
