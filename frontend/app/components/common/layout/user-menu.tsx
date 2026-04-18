import { Link } from "react-router";
import {
  LogOut,
  Settings,
  ShoppingBag,
  User,
  Heart,
  Bell,
  CreditCard,
  Star,
  Ticket,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import useAuth from "~/store/auth/auth.hook";
import { useAppDispatch } from "~/hooks/redux";
import { logout } from "~/store/auth/auth.slice";
import { authSerivce } from "~/services/auth/auth.service";

const UserMenu = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    dispatch(logout());
    await authSerivce.logout();
  };

  // Lấy initials từ tên người dùng
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar} alt={user?.fullName} />
            <AvatarFallback className="bg-linear-to-br from-primary to-primary/70 text-white font-semibold">
              {user?.fullName ? getInitials(user.fullName) : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end" forceMount>
        {/* User Info */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.avatar} alt={user?.fullName} />
              <AvatarFallback className="bg-linear-to-br from-primary to-primary/70 text-white font-semibold text-lg">
                {user?.fullName ? getInitials(user.fullName) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 flex-1 min-w-0">
              <p className="text-sm font-semibold leading-none truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
              {user?.isEmailVerified ? (
                <Badge
                  variant="outline"
                  className="w-fit text-xs border-green-500 text-green-700 bg-green-50"
                >
                  Đã xác thực
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="w-fit text-xs border-yellow-500 text-yellow-700 bg-yellow-50"
                >
                  Chưa xác thực
                </Badge>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              to="/profile"
              className="flex items-center cursor-pointer py-2.5"
            >
              <User className="mr-3 h-4 w-4" />
              <span>Tài khoản của tôi</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/orders"
              className="flex items-center cursor-pointer py-2.5"
            >
              <ShoppingBag className="mr-3 h-4 w-4" />
              <span>Đơn hàng</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/loyalty"
              className="flex items-center cursor-pointer py-2.5"
            >
              <Star className="mr-3 h-4 w-4" />
              <span>Điểm thưởng</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/vouchers"
              className="flex items-center cursor-pointer py-2.5"
            >
              <Ticket className="mr-3 h-4 w-4" />
              <span>Voucher của tôi</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/wishlist"
              className="flex items-center cursor-pointer py-2.5"
            >
              <Heart className="mr-3 h-4 w-4" />
              <span>Yêu thích</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/notifications"
              className="flex items-center cursor-pointer py-2.5"
            >
              <Bell className="mr-3 h-4 w-4" />
              <span>Thông báo</span>
              <Badge className="ml-auto" variant="secondary">
                3
              </Badge>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              to="/payment-methods"
              className="flex items-center cursor-pointer py-2.5"
            >
              <CreditCard className="mr-3 h-4 w-4" />
              <span>Phương thức thanh toán</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/settings"
              className="flex items-center cursor-pointer py-2.5"
            >
              <Settings className="mr-3 h-4 w-4" />
              <span>Cài đặt</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer py-2.5"
          onSelect={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
