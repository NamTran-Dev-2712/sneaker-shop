import SlideIndex from "~/components/feature/admin/attribute/slide/slide.index";
import type { Route } from "./+types/slide";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Slide Management - Admin Panel" },
    {
      name: "description",
      content: "Manage hero banner slides within the admin panel",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function SlideManagementRoute() {
  return <SlideIndex />;
}
