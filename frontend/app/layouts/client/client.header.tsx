import { Link } from "react-router";
import { Menu, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Separator } from "~/components/ui/separator";
import useAuth from "~/store/auth/auth.hook";
import UserMenu from "~/components/common/layout/user-menu";
import CartButton from "~/components/common/layout/cart-button";
import SearchButton from "~/components/common/layout/search-button";
import { useAllBrands } from "~/hooks/react-query/use-brand.query";
import { useCategoryAll } from "~/hooks/react-query/use-category.query";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLogin, user } = useAuth();

  // Fetch brands and categories from API
  const { data: brands } = useAllBrands();
  const { data: categories } = useCategoryAll();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo_website.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold text-primary">Sneaker Shop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Trang chủ */}
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Trang chủ
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {/* Giày */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Giày</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4">
                      <div className="mb-4">
                        <Link
                          to="/sneakers"
                          className="flex items-center justify-between p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                        >
                          <div>
                            <span className="font-semibold text-primary">
                              Xem tất cả giày
                            </span>
                            <p className="text-sm text-muted-foreground">
                              Khám phá bộ sưu tập sneaker
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-primary" />
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {brands?.slice(0, 8).map((brand) => (
                          <Link
                            key={brand.id}
                            to={`/sneakers?brandId=${brand.id}`}
                            className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            {brand.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Phụ kiện */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Phụ kiện</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4">
                      <div className="mb-4">
                        <Link
                          to="/accessories"
                          className="flex items-center justify-between p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                        >
                          <div>
                            <span className="font-semibold text-primary">
                              Xem tất cả phụ kiện
                            </span>
                            <p className="text-sm text-muted-foreground">
                              Phụ kiện chăm sóc giày
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-primary" />
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {categories?.slice(0, 8).map((category) => (
                          <Link
                            key={category.id}
                            to={`/accessories?categoryId=${category.id}`}
                            className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* About */}
                <NavigationMenuItem>
                  <Link to="/about">
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Về chúng tôi
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {/* Liên hệ */}
                <NavigationMenuItem>
                  <Link to="/contact">
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Liên hệ
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <SearchButton />

            {!isLogin ? (
              // Chưa đăng nhập - hiển thị nút Đăng nhập và Đăng ký
              <>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="hidden md:inline-flex"
                >
                  <Link to="/login">Đăng nhập</Link>
                </Button>
                <Button size="sm" asChild className="hidden md:inline-flex">
                  <Link to="/register">Đăng ký</Link>
                </Button>
                {/* Mobile - chỉ hiển thị 1 nút cho gọn */}
                <Button size="sm" asChild className="md:hidden">
                  <Link to="/login">Đăng nhập</Link>
                </Button>
              </>
            ) : (
              // Đã đăng nhập - hiển thị Cart và User Menu
              <>
                <CartButton itemCount={user?.cartItemCount ?? 0} />
                <div className="hidden md:block">
                  <UserMenu />
                </div>
              </>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-75 sm:w-100 overflow-y-auto"
              >
                <nav className="flex flex-col gap-4 pb-8">
                  {/* User Info Section for Mobile */}
                  {isLogin && (
                    <>
                      <div className="md:hidden">
                        <UserMenu />
                      </div>
                      <Separator />
                    </>
                  )}

                  <Link
                    to="/"
                    className="text-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Trang chủ
                  </Link>
                  <Separator />

                  {/* Nút đăng nhập/đăng ký cho mobile nếu chưa login */}
                  {!isLogin && (
                    <>
                      <div className="flex flex-col gap-2">
                        <Button asChild>
                          <Link
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Đăng nhập
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link
                            to="/register"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Đăng ký
                          </Link>
                        </Button>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Giày Mobile */}
                  <div>
                    <Link
                      to="/sneakers"
                      className="flex items-center justify-between mb-2 text-lg font-semibold"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Giày
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                    <div className="ml-2 space-y-1">
                      {brands?.slice(0, 6).map((brand) => (
                        <Link
                          key={brand.id}
                          to={`/sneakers?brandId=${brand.id}`}
                          className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {brand.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Separator />

                  {/* Phụ kiện Mobile */}
                  <div>
                    <Link
                      to="/accessories"
                      className="flex items-center justify-between mb-2 text-lg font-semibold"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Phụ kiện
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                    <div className="ml-2 space-y-1">
                      {categories?.slice(0, 6).map((category) => (
                        <Link
                          key={category.id}
                          to={`/accessories?categoryId=${category.id}`}
                          className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Separator />

                  <Link
                    to="/about"
                    className="text-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Về chúng tôi
                  </Link>
                  <Separator />
                  <Link
                    to="/contact"
                    className="text-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Liên hệ
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
