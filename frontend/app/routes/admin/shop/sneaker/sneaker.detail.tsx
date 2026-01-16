import SneakerViewDetail from "~/components/feature/admin/shop/sneaker/detail/sneaker.view-detail";
import type { Route } from "./+types/sneaker.detail";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sneaker Detail - Admin Panel" },
    {
      name: "description",
      content:
        "View detailed information about a sneaker within the admin panel",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function SneakerDetailRoute() {
  return <SneakerViewDetail />;
}
