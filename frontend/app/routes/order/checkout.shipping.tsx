import type { Route } from "./+types/checkout.shipping";
import CheckoutShipping from "~/components/feature/shop/checkout/checkout.shipping";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Thông tin giao hàng | Sneaker Shop" },
    {
      name: "description",
      content: "Nhập thông tin giao hàng để tiếp tục đặt hàng",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function CheckoutShippingRoute() {
  return <CheckoutShipping />;
}
