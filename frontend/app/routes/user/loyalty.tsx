import type { Route } from "./+types/loyalty";
import LoyaltyPage from "~/components/feature/user/loyalty/loyalty.page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Điểm thưởng | Sneaker Shop" },
    {
      name: "description",
      content: "Xem số điểm thưởng và lịch sử tích điểm của bạn",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function LoyaltyRoute() {
  return <LoyaltyPage />;
}
