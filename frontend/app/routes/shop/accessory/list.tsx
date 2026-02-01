import type { Route } from "./+types/list";
import AccessoryListIndex from "~/components/feature/shop/accessory/accessory-list/accessory-list.index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Phụ Kiện | Sneaker Shop - Phụ Kiện Chăm Sóc Giày" },
    {
      name: "description",
      content:
        "Phụ kiện chăm sóc và bảo vệ giày sneaker. Dây giày, xi đánh giày, hộp đựng giày, bình xịt chống thấm và nhiều hơn nữa.",
    },
    {
      name: "keywords",
      content:
        "phụ kiện giày, dây giày, xi đánh giày, hộp đựng giày, bình xịt chống thấm, sneaker care",
    },
    { property: "og:title", content: "Phụ Kiện | Sneaker Shop" },
    {
      property: "og:description",
      content: "Phụ kiện chăm sóc và bảo vệ giày sneaker của bạn.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://sneakershop.vn/accessories" },
    { name: "robots", content: "index, follow" },
  ];
}

export default function AccessoryListPage() {
  return <AccessoryListIndex />;
}
