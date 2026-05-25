import type { Route } from "./+types/checkout.review";
import CheckoutReview from "~/components/feature/shop/checkout/checkout.review";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Xác nhận đơn hàng | Sneaker Shop" },
    {
      name: "description",
      content: "Kiểm tra và xác nhận thông tin đơn hàng trước khi đặt",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function CheckoutReviewRoute() {
  return <CheckoutReview />;
}
