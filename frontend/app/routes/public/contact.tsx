import type { Route } from "./+types/contact";
import ContactIndex from "~/components/feature/public/contact/contact.index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Liên Hệ | Sneaker Shop - Giày Sneaker Chính Hãng" },
    {
      name: "description",
      content:
        "Liên hệ với Sneaker Shop - Hotline: 1900 1234. Địa chỉ: 123 Nguyễn Huệ, Quận 1, TP.HCM. Hỗ trợ 24/7.",
    },
    {
      name: "keywords",
      content:
        "sneaker shop, liên hệ, hotline, địa chỉ, cửa hàng giày, hỗ trợ khách hàng",
    },
    { property: "og:title", content: "Liên Hệ | Sneaker Shop" },
    {
      property: "og:description",
      content: "Liên hệ với Sneaker Shop - Hotline: 1900 1234. Hỗ trợ 24/7.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://sneakershop.vn/contact" },
    { name: "robots", content: "index, follow" },
  ];
}

export default function ContactPage() {
  return <ContactIndex />;
}
