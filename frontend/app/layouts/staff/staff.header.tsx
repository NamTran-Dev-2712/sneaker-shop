import { Link } from "react-router";
import { Menu, Moon, Sun, LogOut, User } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { logout } from "~/store/auth/auth.slice";
import { authSerivce } from "~/services/auth/auth.service";
import { useAppDispatch } from "~/hooks/redux";
import useAuth from "~/store/auth/auth.hook";

interface StaffHeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const StaffHeader = ({
  onToggleSidebar,
  darkMode,
  onToggleDarkMode,
}: StaffHeaderProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const handleLogout = async () => {
    dispatch(logout());
    await authSerivce.logout();
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "ST";

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link to="/staff" className="flex items-center gap-2">
            <img
              src="/logo_website.png"
              alt="Logo"
              className="h-8 w-8 object-contain"
            />
            <div className="hidden md:block">
              <h1 className="text-lg font-bold">Sneaker Shop</h1>
              <p className="text-xs text-muted-foreground">Staff Portal</p>
            </div>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            className="hover:bg-accent"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.fullName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.fullName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/staff/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Hồ sơ
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default StaffHeader;
