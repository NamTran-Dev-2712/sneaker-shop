import { Outlet } from "react-router";
import { useEffect } from "react";
import AdminHeader from "./admin.header";
import AdminSidebar from "./admin.sidebar";
import useAdminLayout from "~/store/admin/layout/layout.hook";
import { cn } from "~/lib/utils";

const AdminLayout = () => {
  const { sidebarCollapsed, darkMode } = useAdminLayout();

  // Apply dark mode on mount and when it changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AdminHeader />

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main
        className={cn(
          "pt-16 transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64",
        )}
      >
        <div className="container mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
