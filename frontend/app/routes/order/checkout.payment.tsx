import type { Route } from "./+types/checkout.payment";
import CheckoutPayment from "~/components/feature/shop/checkout/checkout.payment";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Phương thức thanh toán | Sneaker Shop" },
    {
      name: "description",
      content: "Chọn phương thức thanh toán cho đơn hàng của bạn",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function CheckoutPaymentRoute() {
  return <CheckoutPayment />;
}
