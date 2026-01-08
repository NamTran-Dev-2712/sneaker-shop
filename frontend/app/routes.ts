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
    layout("./layouts/client/client.layout.tsx", [
      // public routes
      index("./routes/public/home.tsx"),

      // auth routes
      route("login", "./routes/auth/login.tsx"),
      route("register", "./routes/auth/register.tsx"),
    ]),

    // admin routes
    ...prefix("admin", [
      layout("./layouts/admin/admin.layout.tsx", [
        index("./routes/admin/dashboard.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
