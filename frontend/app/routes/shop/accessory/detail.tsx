import type { Route } from "./+types/detail";
import { accessoryServerService } from "~/services/shop/accessory/accessory.server";
import AccessoryDetailIndex from "~/components/feature/shop/accessory/accessory-detail/accessory-detail.index";

export async function loader({ params, request }: Route.LoaderArgs) {
  const { slug } = params;

  if (!slug) {
    return { accessory: null };
  }

  const cookie = request.headers.get("Cookie") || undefined;
  const response = await accessoryServerService.getAccessoryBySlug(
    slug,
    cookie,
  );

  return {
    accessory: response.data,
    slug,
  };
}

export function meta({ data }: Route.MetaArgs) {
  const accessory = data?.accessory;

  if (!accessory) {
    return [
      { title: "Không tìm thấy sản phẩm | Sneaker Shop" },
      {
        name: "description",
        content: "Sản phẩm này không tồn tại hoặc đã bị xóa.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ];
  }

  const title = `${accessory.name} - ${accessory.category.name} | Sneaker Shop`;
  const description = accessory.description
    ? accessory.description.replace(/<[^>]*>/g, "").substring(0, 160)
    : `Mua ${accessory.name} chính hãng ${accessory.brand.name} tại Sneaker Shop. Phụ kiện chăm sóc giày chất lượng cao.`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:type", content: "product" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: accessory.mainImage },
    { property: "og:image:alt", content: accessory.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: accessory.mainImage },
    { name: "robots", content: "index, follow" },
    {
      name: "keywords",
      content: `${accessory.name}, ${accessory.brand.name}, ${accessory.category.name}, phụ kiện giày`,
    },
  ];
}

export default function AccessoryDetailPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <AccessoryDetailIndex
      initialData={loaderData?.accessory}
      slug={loaderData?.slug}
    />
  );
}
