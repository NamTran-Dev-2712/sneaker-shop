import useAuth from "~/store/auth/auth.hook";
import { Navigate, Outlet } from "react-router";
import { Role } from "~/types/entities/user.type";

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  if (auth.user?.role === Role.ADMIN) {
    return <Navigate to="/admin/dashboard" />;
  } else if (auth.user?.role === Role.STAFF) {
    return <Navigate to="/staff/orders" />;
  }

  return <>{children ? children : <Outlet />}</>;
};

export default ClientProvider;
