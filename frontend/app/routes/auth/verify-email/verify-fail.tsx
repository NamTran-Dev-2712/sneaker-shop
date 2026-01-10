import VerifyFail from "~/components/feature/auth/verify-email/fail/verify-fail";
import type { Route } from "./+types/verify-fail";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Xác thực thất bại - Sneaker Shop" },
    {
      name: "description",
      content: "Không thể xác thực email của bạn",
    },
  ];
}

export default function VerifyFailPage() {
  return <VerifyFail />;
}
