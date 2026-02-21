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
        route("about", "./routes/public/about.tsx"),
        route("contact", "./routes/public/contact.tsx"),

        // shop routes - sneakers
        route("sneakers", "./routes/shop/sneaker/list.tsx"),
        route("sneakers/:slug", "./routes/shop/sneaker/detail.tsx"),

        // shop routes - accessories
        route("accessories", "./routes/shop/accessory/list.tsx"),
        route("accessories/:slug", "./routes/shop/accessory/detail.tsx"),

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
        layout("./components/provider/auth.provider.tsx", [
          route("cart", "./routes/shop/cart/cart.index.tsx"),

          // user profile & orders routes
          route("profile", "./routes/user/profile.tsx"),
          route("orders", "./routes/user/orders.tsx"),
          route("orders/:id", "./routes/user/order-detail.tsx"),

          // checkout routes — guarded by checkout provider (redirects to cart if no items)
          layout("./components/provider/checkout.provider.tsx", [
            route("checkout/shipping", "./routes/order/checkout.shipping.tsx"),
            route("checkout/payment", "./routes/order/checkout.payment.tsx"),
            route("checkout/review", "./routes/order/checkout.review.tsx"),
          ]),

          // checkout success — outside checkout guard (checkout state is cleared after order)
          route("checkout/success", "./routes/order/checkout.success.tsx"),
        ]),
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

          // attribute management routes
          route("attributes/colors", "./routes/admin/attribute/color.tsx"),
          route("attributes/sizes", "./routes/admin/attribute/size.tsx"),
          route("attributes/slides", "./routes/admin/attribute/slide.tsx"),

          // sneaker management routes
          route(
            "sneakers",
            "./routes/admin/shop/sneaker/sneaker.management.tsx",
          ),
          route(
            "sneakers/create",
            "./routes/admin/shop/sneaker/sneaker.create.tsx",
          ),
          route(
            "sneakers/:id",
            "./routes/admin/shop/sneaker/sneaker.detail.tsx",
          ),
          route(
            "sneakers/:id/edit",
            "./routes/admin/shop/sneaker/sneaker.update.tsx",
          ),

          // category accessory management routes
          route(
            "categories",
            "./routes/admin/shop/category/category.management.tsx",
          ),
          route(
            "categories/create",
            "./routes/admin/shop/category/category.create.tsx",
          ),
          route(
            "categories/:id/edit",
            "./routes/admin/shop/category/category.update.tsx",
          ),

          // accessory management routes
          route(
            "accessories",
            "./routes/admin/shop/accessory/accessory.management.tsx",
          ),
          route(
            "accessories/create",
            "./routes/admin/shop/accessory/accessory.create.tsx",
          ),
          route(
            "accessories/:id",
            "./routes/admin/shop/accessory/accessory.detail.tsx",
          ),
          route(
            "accessories/:id/edit",
            "./routes/admin/shop/accessory/accessory.update.tsx",
          ),

          // inventory management routes
          route("inventory", "./routes/admin/inventory.tsx"),

          // procurement management routes - vendors
          route(
            "vendors",
            "./routes/admin/procurement/vendor/vendor.management.tsx",
          ),
          route(
            "vendors/:id",
            "./routes/admin/procurement/vendor/vendor.detail.tsx",
          ),

          // procurement management routes - purchase orders
          route(
            "purchase-orders",
            "./routes/admin/procurement/purchase-order/purchase-order.management.tsx",
          ),
          route(
            "purchase-orders/create",
            "./routes/admin/procurement/purchase-order/purchase-order.create.tsx",
          ),
          route(
            "purchase-orders/:id",
            "./routes/admin/procurement/purchase-order/purchase-order.detail.tsx",
          ),
        ]),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
