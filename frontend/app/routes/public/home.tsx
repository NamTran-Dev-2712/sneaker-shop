import type { Route } from "./+types/home";
import HomeIndex from "~/components/feature/public/home/home.index";

export function meta({}: Route.MetaArgs) {
  const title =
    "Sneaker Shop - Giày Sneaker Chính Hãng | Nike, Adidas, Vans, Converse";
  const description =
    "Chuyên cung cấp giày sneaker chính hãng từ các thương hiệu nổi tiếng: Nike, Adidas, Vans, Converse, New Balance. Giá tốt nhất thị trường, giao hàng nhanh, bảo hành uy tín. Mua giày sneaker online an toàn tại Sneaker Shop.";
  const keywords =
    "giày sneaker, giày thể thao, Nike, Adidas, Vans, Converse, New Balance, giày chính hãng, mua giày online, sneaker Vietnam";
  const url = "https://sneakershop.vn";
  const image = `${url}/logo_website.png`;

  return [
    // Basic Meta Tags
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "author", content: "Sneaker Shop" },
    { name: "robots", content: "index, follow" },
    { name: "language", content: "vi" },
    { name: "revisit-after", content: "7 days" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "utf-8" },

    // Open Graph Meta Tags (Facebook, LinkedIn)
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "Sneaker Shop Logo" },
    { property: "og:site_name", content: "Sneaker Shop" },
    { property: "og:locale", content: "vi_VN" },

    // Twitter Card Meta Tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:url", content: url },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: "Sneaker Shop Logo" },

    // Additional SEO Tags
    { name: "theme-color", content: "#000000" },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    { name: "apple-mobile-web-app-title", content: "Sneaker Shop" },

    // Canonical URL
    { tagName: "link", rel: "canonical", href: url },

    // Alternate Languages (if needed in future)
    { tagName: "link", rel: "alternate", hrefLang: "vi", href: url },

    // Preconnect for performance
    {
      tagName: "link",
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      tagName: "link",
      rel: "dns-prefetch",
      href: "https://fonts.googleapis.com",
    },
  ];
}

export default function Home() {
  return <HomeIndex />;
}
