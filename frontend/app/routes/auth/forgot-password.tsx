import type { Route } from "./+types/forgot-password";
import ForgotPasswordForm from "~/components/feature/auth/forgot-password/forgot-password.form";

export function meta({}: Route.MetaArgs) {
  const title = "Quên mật khẩu - Sneaker Shop";
  const description =
    "Khôi phục mật khẩu bằng mã OTP được gửi qua email để tiếp tục mua sắm tại Sneaker Shop.";
  const url = "https://sneakershop.vn/forgot-password";

  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "noindex, nofollow" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { tagName: "link", rel: "canonical", href: url },
  ];
}

export default function ForgotPasswordRoute() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/5 via-background to-primary/10">
        <div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
      </div>

      <div className="w-full max-w-md rounded-2xl border bg-white/80 backdrop-blur-sm p-8 shadow-xl">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
