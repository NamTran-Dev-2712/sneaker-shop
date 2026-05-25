import type { Route } from "./+types/detail";
import { sneakerServerService } from "~/services/shop/sneaker/sneaker.server";
import SneakerDetailIndex from "~/components/feature/shop/sneaker/sneaker-detail/sneaker-detail.index";

export async function loader({ params, request }: Route.LoaderArgs) {
  const { slug } = params;

  if (!slug) {
    return { sneaker: null };
  }

  const cookie = request.headers.get("Cookie") || undefined;
  const response = await sneakerServerService.getSneakerBySlug(slug, cookie);

  return {
    sneaker: response.data,
    slug,
  };
}

export function meta({ data }: Route.MetaArgs) {
  const sneaker = data?.sneaker;

  if (!sneaker) {
    return [
      { title: "Không tìm thấy sản phẩm | Sneaker Shop" },
      {
        name: "description",
        content: "Sản phẩm này không tồn tại hoặc đã bị xóa.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ];
  }

  const title = `${sneaker.name} - ${sneaker.brand.name} | Sneaker Shop`;
  const description = sneaker.description
    ? sneaker.description.replace(/<[^>]*>/g, "").substring(0, 160)
    : `Mua giày ${sneaker.name} chính hãng ${sneaker.brand.name} tại Sneaker Shop. Cam kết 100% chính hãng.`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:type", content: "product" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: sneaker.mainImage },
    { property: "og:image:alt", content: sneaker.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: sneaker.mainImage },
    { name: "robots", content: "index, follow" },
    {
      name: "keywords",
      content: `${sneaker.name}, ${sneaker.brand.name}, sneaker, giày thể thao, chính hãng`,
    },
  ];
}

export default function SneakerDetailPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <SneakerDetailIndex
      initialData={loaderData?.sneaker}
      slug={loaderData?.slug}
    />
  );
}
