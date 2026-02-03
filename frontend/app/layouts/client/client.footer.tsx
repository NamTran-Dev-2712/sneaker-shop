import { Link } from "react-router";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Store,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { useAllBrands } from "~/hooks/react-query/use-brand.query";
import { useAllStores } from "~/hooks/react-query/use-store.query";
import { useCategoryAll } from "~/hooks/react-query/use-category.query";

const Footer = () => {
  const { data: brands } = useAllBrands();
  const { data: stores } = useAllStores();
  const { data: categories } = useCategoryAll();

  return (
    <footer className="border-t bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Về Chúng Tôi */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/logo_website.png"
                alt="Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold text-primary">
                Sneaker Shop
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Chuyên cung cấp giày sneaker chính hãng từ các thương hiệu nổi
              tiếng trên thế giới. Uy tín - Chất lượng - Giá tốt.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all hover:bg-primary hover:text-white hover:scale-110 hover:shadow-lg"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all hover:bg-primary hover:text-white hover:scale-110 hover:shadow-lg"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all hover:bg-primary hover:text-white hover:scale-110 hover:shadow-lg"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all hover:bg-primary hover:text-white hover:scale-110 hover:shadow-lg"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Thương Hiệu */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b-2 border-primary/20 pb-2">
              Thương Hiệu
            </h3>
            {brands && brands.length > 0 ? (
              <ul className="space-y-2.5 text-sm">
                {brands.slice(0, 6).map((brand) => (
                  <li key={brand.id}>
                    <Link
                      to={`/sneakers?brandId=${brand.id}`}
                      className="text-muted-foreground hover:text-primary transition-all inline-flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mr-2 group-hover:bg-primary group-hover:scale-125 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform">
                        {brand.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-2.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Danh Mục */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b-2 border-primary/20 pb-2">
              Danh Mục
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/sneakers"
                  className="text-muted-foreground hover:text-primary transition-all inline-flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mr-2 group-hover:bg-primary group-hover:scale-125 transition-all" />
                  <span className="group-hover:translate-x-1 transition-transform">
                    Giày Sneaker
                  </span>
                </Link>
              </li>
              {categories && categories.length > 0 ? (
                categories.slice(0, 5).map((category) => (
                  <li key={category.id}>
                    <Link
                      to={`/accessories?categoryId=${category.id}`}
                      className="text-muted-foreground hover:text-primary transition-all inline-flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mr-2 group-hover:bg-primary group-hover:scale-125 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform">
                        {category.name}
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  {[...Array(3)].map((_, i) => (
                    <li key={i}>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>

          {/* Cửa Hàng */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 border-b-2 border-primary/20 pb-2">
              <Store className="h-5 w-5 text-primary" />
              Hệ Thống Cửa Hàng
            </h3>
            {stores && stores.items && stores.items.length > 0 ? (
              <ul className="space-y-4 text-sm">
                {stores.items.slice(0, 3).map((store) => (
                  <li
                    key={store.id}
                    className="space-y-1.5 p-3 rounded-lg bg-white border border-gray-100 hover:border-primary/30 transition-all hover:shadow-sm"
                  >
                    <p className="font-semibold text-foreground">
                      {store.name}
                    </p>
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="text-muted-foreground text-xs leading-relaxed">
                        {store.address}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="space-y-2 p-3 rounded-lg bg-white border border-gray-100"
                  >
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            )}
            <div className="pt-3 space-y-2.5 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href="tel:+84123456789"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  (+84) 123 456 789
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href="mailto:contact@sneakershop.vn"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  contact@sneakershop.vn
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sneaker Shop. Bảo lưu mọi quyền.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/about"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Về chúng tôi
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              to="/privacy"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              to="/terms"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Điều khoản
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              to="/contact"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
