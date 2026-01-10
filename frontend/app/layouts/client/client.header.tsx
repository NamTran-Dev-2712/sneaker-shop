import { Link } from "react-router";
import { Menu } from "lucide-react";
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

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLogin } = useAuth();

  // Dữ liệu menu giày
  const shoeBrands = [
    {
      name: "Nike",
      series: ["Air Max", "Air Jordan", "Air Force 1", "Dunk", "Blazer"],
    },
    {
      name: "Adidas",
      series: ["Ultraboost", "NMD", "Yeezy", "Stan Smith", "Superstar"],
    },
    {
      name: "Converse",
      series: ["Chuck Taylor", "One Star", "Jack Purcell", "Pro Leather"],
    },
    {
      name: "Vans",
      series: ["Old Skool", "Authentic", "Sk8-Hi", "Era", "Slip-On"],
    },
    {
      name: "New Balance",
      series: ["550", "574", "990", "327", "2002R"],
    },
  ];

  // Dữ liệu menu phụ kiện
  const accessories = [
    {
      category: "Dây giày",
      brands: ["Nike", "Adidas", "Generic"],
    },
    {
      category: "Vớ/Tất",
      brands: ["Nike", "Adidas", "Puma", "Uniqlo"],
    },
    {
      category: "Vệ sinh giày",
      brands: ["Crep Protect", "Jason Markk", "Reshoevn8r"],
    },
    {
      category: "Phụ kiện bảo quản",
      brands: ["Sneaker Shield", "Force Fields", "Shoe Trees"],
    },
  ];

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
                    <div className="grid w-200 gap-3 p-6 md:grid-cols-5">
                      {shoeBrands.map((brand) => (
                        <div key={brand.name} className="space-y-2">
                          <h4 className="font-semibold text-primary">
                            {brand.name}
                          </h4>
                          <ul className="space-y-1">
                            {brand.series.map((series) => (
                              <li key={series}>
                                <Link
                                  to={`/shoes/${brand.name.toLowerCase()}/${series.toLowerCase().replace(/\s+/g, "-")}`}
                                  className="block select-none rounded-md p-2 text-sm leading-none text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                >
                                  {series}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Phụ kiện */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Phụ kiện</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-150 gap-3 p-6 md:grid-cols-4">
                      {accessories.map((accessory) => (
                        <div key={accessory.category} className="space-y-2">
                          <h4 className="font-semibold text-primary">
                            {accessory.category}
                          </h4>
                          <ul className="space-y-1">
                            {accessory.brands.map((brand) => (
                              <li key={brand}>
                                <Link
                                  to={`/accessories/${accessory.category.toLowerCase().replace(/\s+/g, "-")}/${brand.toLowerCase()}`}
                                  className="block select-none rounded-md p-2 text-sm leading-none text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                >
                                  {brand}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
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
                <CartButton itemCount={0} />
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
                    <h3 className="mb-2 text-lg font-semibold">Giày</h3>
                    {shoeBrands.map((brand) => (
                      <details key={brand.name} className="mb-2">
                        <summary className="cursor-pointer font-medium text-primary">
                          {brand.name}
                        </summary>
                        <ul className="ml-4 mt-2 space-y-1">
                          {brand.series.map((series) => (
                            <li key={series}>
                              <Link
                                to={`/shoes/${brand.name.toLowerCase()}/${series.toLowerCase().replace(/\s+/g, "-")}`}
                                className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {series}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ))}
                  </div>
                  <Separator />

                  {/* Phụ kiện Mobile */}
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Phụ kiện</h3>
                    {accessories.map((accessory) => (
                      <details key={accessory.category} className="mb-2">
                        <summary className="cursor-pointer font-medium text-primary">
                          {accessory.category}
                        </summary>
                        <ul className="ml-4 mt-2 space-y-1">
                          {accessory.brands.map((brand) => (
                            <li key={brand}>
                              <Link
                                to={`/accessories/${accessory.category.toLowerCase().replace(/\s+/g, "-")}/${brand.toLowerCase()}`}
                                className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {brand}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ))}
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
