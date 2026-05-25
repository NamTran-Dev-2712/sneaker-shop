import type { Route } from "./+types/register";
import RegisterForm from "~/components/feature/auth/register/register.form";

export function meta({}: Route.MetaArgs) {
  const title = "Đăng ký - Sneaker Shop";
  const description =
    "Tạo tài khoản mới tại Sneaker Shop để trải nghiệm mua sắm giày sneaker chính hãng. Đăng ký nhanh chóng, dễ dàng và hoàn toàn miễn phí.";
  const url = "https://sneakershop.vn/register";

  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "noindex, nofollow" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { tagName: "link", rel: "canonical", href: url },
  ];
}

export default function Register() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/5 via-background to-primary/10">
        <div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md rounded-2xl border bg-white/80 backdrop-blur-sm p-8 shadow-xl">
        <RegisterForm />
      </div>
    </div>
  );
}
