import { Link, useLocation } from "react-router";
import { useState } from "react";
import { cn } from "~/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserCog,
  ShoppingBag,
  Package,
  Settings,
  ChevronDown,
  ChevronRight,
  Store,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import useAdminLayout from "~/store/admin/layout/layout.hook";
import BrandIcon from "~/components/common/icons/brand.icon";
import SneakerIcon from "~/components/common/icons/sneaker.icon";
import SneakerListIcon from "~/components/common/icons/sneaker-list.icon";
import SneakerAddIcon from "~/components/common/icons/sneaker-add.icon";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: "/admin",
  },
  {
    id: "stores",
    label: "Quản lý Cửa hàng",
    icon: <Store className="h-5 w-5" />,
    path: "/admin/stores",
  },
  {
    id: "brands",
    label: "Quản lý Hãng",
    icon: <BrandIcon className="h-5 w-5" />,
    path: "/admin/brands",
  },
  {
    id: "colors-sizes",
    label: "Quản lý Màu & Size",
    icon: <UserCog className="h-5 w-5" />,
    children: [
      {
        id: "colors-list",
        label: "Danh sách Màu",
        icon: <Users className="h-4 w-4" />,
        path: "/admin/attributes/colors",
      },
      {
        id: "sizes-list",
        label: "Danh sách Size",
        icon: <Users className="h-4 w-4" />,
        path: "/admin/attributes/sizes",
      },
    ],
  },
  {
    id: "employees",
    label: "Quản lý Nhân viên",
    icon: <UserCog className="h-5 w-5" />,
    children: [
      {
        id: "employees-list",
        label: "Danh sách",
        icon: <Users className="h-4 w-4" />,
        path: "/admin/employees",
      },
      {
        id: "employees-create",
        label: "Tạo mới",
        icon: <Users className="h-4 w-4" />,
        path: "/admin/employees/create",
      },
    ],
  },
  {
    id: "customers",
    label: "Quản lý Khách hàng",
    icon: <Users className="h-5 w-5" />,
    children: [
      {
        id: "customers-list",
        label: "Danh sách",
        icon: <Users className="h-4 w-4" />,
        path: "/admin/customers",
      },
      {
        id: "customers-create",
        label: "Tạo mới",
        icon: <Users className="h-4 w-4" />,
        path: "/admin/customers/create",
      },
    ],
  },
  {
    id: "products",
    label: "Quản lý Giày",
    icon: <SneakerIcon className="h-5 w-5" />,
    children: [
      {
        id: "products-list",
        label: "Danh sách",
        icon: <SneakerListIcon className="h-4 w-4" />,
        path: "/admin/sneakers",
      },
      {
        id: "products-create",
        label: "Tạo mới",
        icon: <SneakerAddIcon className="h-4 w-4" />,
        path: "/admin/sneakers/create",
      },
    ],
  },
  {
    id: "settings",
    label: "Cài đặt",
    icon: <Settings className="h-5 w-5" />,
    path: "/admin/settings",
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { sidebarCollapsed } = useAdminLayout();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([
    "employees",
    "customers",
    "products",
  ]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId],
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const active = isActive(item.path);

    if (hasChildren) {
      return (
        <div key={item.id} className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3",
              sidebarCollapsed ? "px-2" : "px-3",
              level > 0 && "ml-6",
            )}
            onClick={() => toggleMenu(item.id)}
          >
            {item.icon}
            {!sidebarCollapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </>
            )}
          </Button>

          {isExpanded && !sidebarCollapsed && (
            <div className="ml-4 space-y-1 border-l pl-2">
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Button
        key={item.id}
        variant={active ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-3",
          sidebarCollapsed ? "px-2" : "px-3",
          level > 0 && "ml-6",
          active && "bg-primary/10 text-primary hover:bg-primary/20",
        )}
        asChild
      >
        <Link to={item.path || "#"}>
          {item.icon}
          {!sidebarCollapsed && <span>{item.label}</span>}
        </Link>
      </Button>
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Scrollable Menu Container - Hidden scrollbar */}
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="space-y-2 p-3">
          {/* Logo/Brand when collapsed */}
          {sidebarCollapsed && (
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

          {/* Menu Items */}
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
