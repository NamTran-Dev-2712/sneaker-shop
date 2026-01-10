import VerifySuccess from "~/components/feature/auth/verify-email/success/verify-success";
import type { Route } from "./+types/verify-success";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Xác thực thành công - Sneaker Shop" },
    {
      name: "description",
      content: "Email của bạn đã được xác thực thành công",
    },
  ];
}

export default function VerifySuccessPage() {
  return <VerifySuccess />;
}
