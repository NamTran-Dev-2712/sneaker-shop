import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/main.layout.tsx", [
    // client routes
    layout("./components/provider/client.provider.tsx", [
      layout("./layouts/client/client.layout.tsx", [
        // public routes
        index("./routes/public/home.tsx"),

        // auth routes
        layout("./components/provider/guest-only.provider.tsx", [
          route("login", "./routes/auth/login.tsx"),
          route("register", "./routes/auth/register.tsx"),
        ]),
        route(
          "verify-email/success",
          "./routes/auth/verify-email/verify-success.tsx",
        ),
        route(
          "verify-email/fail",
          "./routes/auth/verify-email/verify-fail.tsx",
        ),

        // protected routes (authenticated)
        // layout("./components/provider/auth.provider.tsx", []),
      ]),
    ]),

    // admin routes
    ...prefix("admin", [
      layout("./components/provider/role.provider.tsx", [
        layout("./layouts/admin/admin.layout.tsx", [
          index("./routes/admin/dashboard.tsx"),
          // shop management routes
          route("brands", "./routes/admin/shop/brand.tsx"),
          route("stores", "./routes/admin/shop/store.tsx"),
        ]),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
