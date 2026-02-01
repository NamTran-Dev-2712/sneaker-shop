import type { Route } from "./+types/list";
import SneakerListIndex from "~/components/feature/shop/sneaker/sneaker-list/sneaker-list.index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Giày Sneaker | Sneaker Shop - Giày Sneaker Chính Hãng" },
    {
      name: "description",
      content:
        "Khám phá bộ sưu tập giày sneaker chính hãng từ Nike, Adidas, Converse, Vans, New Balance. Giá tốt nhất, giao hàng toàn quốc.",
    },
    {
      name: "keywords",
      content:
        "giày sneaker, sneaker chính hãng, nike, adidas, converse, vans, new balance, mua giày",
    },
    { property: "og:title", content: "Giày Sneaker | Sneaker Shop" },
    {
      property: "og:description",
      content:
        "Khám phá bộ sưu tập giày sneaker chính hãng từ các thương hiệu nổi tiếng.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://sneakershop.vn/sneakers" },
    { name: "robots", content: "index, follow" },
  ];
}

export default function SneakerListPage() {
  return <SneakerListIndex />;
}
