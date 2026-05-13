import type { Route } from "./+types/checkout.success";
import CheckoutSuccess from "~/components/feature/shop/checkout/checkout.success";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Đặt hàng thành công | Sneaker Shop" },
    {
      name: "description",
      content: "Đơn hàng của bạn đã được đặt thành công",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function CheckoutSuccessRoute() {
  return <CheckoutSuccess />;
}
