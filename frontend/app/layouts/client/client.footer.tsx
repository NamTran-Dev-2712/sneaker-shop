import { Link } from "react-router";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";

const Footer = () => {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
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
            <p className="text-sm text-muted-foreground">
              Chuyên cung cấp giày sneaker chính hãng từ các thương hiệu nổi
              tiếng trên thế giới. Uy tín - Chất lượng - Giá tốt.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Sản Phẩm */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sản Phẩm</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/shoes"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Giày Nike
                </Link>
              </li>
              <li>
                <Link
                  to="/shoes"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Giày Adidas
                </Link>
              </li>
              <li>
                <Link
                  to="/shoes"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Giày Converse
                </Link>
              </li>
              <li>
                <Link
                  to="/shoes"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Giày Vans
                </Link>
              </li>
              <li>
                <Link
                  to="/accessories"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Phụ kiện
                </Link>
              </li>
            </ul>
          </div>

          {/* Hỗ Trợ Khách Hàng */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hỗ Trợ Khách Hàng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link
                  to="/return"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Liên Hệ */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên Hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">
                  123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href="tel:+84123456789"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  (+84) 123 456 789
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href="mailto:contact@sneakershop.vn"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  contact@sneakershop.vn
                </a>
              </li>
            </ul>
            <div className="pt-2">
              <p className="text-sm font-medium">Giờ làm việc:</p>
              <p className="text-sm text-muted-foreground">
                Thứ 2 - Chủ nhật: 8:00 - 22:00
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sneaker Shop. Bảo lưu mọi quyền.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
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
              to="/sitemap"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Sơ đồ trang
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
