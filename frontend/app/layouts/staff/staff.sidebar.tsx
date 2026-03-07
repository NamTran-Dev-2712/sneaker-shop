import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import { LayoutDashboard, User } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Tổng quan",
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: "/staff",
  },
  {
    id: "profile",
    label: "Hồ sơ cá nhân",
    icon: <User className="h-5 w-5" />,
    path: "/staff/profile",
  },
];

interface StaffSidebarProps {
  collapsed: boolean;
}

const StaffSidebar = ({ collapsed }: StaffSidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="space-y-2 p-3">
          {collapsed && (
            <>
              <div className="flex justify-center py-2">
                <img
                  src="/logo_website.png"
                  alt="Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <Separator />
            </>
          )}

          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Button
                key={item.id}
                variant={active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  collapsed ? "px-2" : "px-3",
                  active && "bg-primary/10 text-primary hover:bg-primary/20",
                )}
                asChild
              >
                <Link to={item.path}>
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default StaffSidebar;
