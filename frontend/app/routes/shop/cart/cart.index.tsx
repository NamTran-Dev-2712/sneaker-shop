import type { Route } from "./+types/cart.index";
import CartIndex from "~/components/feature/shop/cart/cart.index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Giỏ hàng | Sneaker Shop" },
    { name: "description", content: "Xem và quản lý giỏ hàng của bạn" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function CartPage() {
  return <CartIndex />;
}
