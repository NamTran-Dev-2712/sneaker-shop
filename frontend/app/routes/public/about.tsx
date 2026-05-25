import type { Route } from "./+types/about";
import AboutIndex from "~/components/feature/public/about/about.index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Về Chúng Tôi | Sneaker Shop - Giày Sneaker Chính Hãng" },
    {
      name: "description",
      content:
        "Tìm hiểu về Sneaker Shop - Hệ thống bán lẻ giày sneaker chính hãng hàng đầu Việt Nam. Câu chuyện, giá trị cốt lõi và đội ngũ của chúng tôi.",
    },
    {
      name: "keywords",
      content:
        "sneaker shop, về chúng tôi, giày sneaker chính hãng, cửa hàng giày, uy tín",
    },
    { property: "og:title", content: "Về Chúng Tôi | Sneaker Shop" },
    {
      property: "og:description",
      content:
        "Tìm hiểu về Sneaker Shop - Hệ thống bán lẻ giày sneaker chính hãng hàng đầu Việt Nam.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://sneakershop.vn/about" },
    { name: "robots", content: "index, follow" },
  ];
}

export default function AboutPage() {
  return <AboutIndex />;
}
