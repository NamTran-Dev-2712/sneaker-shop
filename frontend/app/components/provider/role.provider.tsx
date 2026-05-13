import useAuth from "~/store/auth/auth.hook";
import { Navigate, Outlet } from "react-router";
import { Role } from "~/types/entities/user.type";

const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  if (!auth.isLogin) {
    return <Navigate to="/login" />;
  }
  if (auth.user?.role !== Role.ADMIN) {
    if (auth.user?.role === Role.STAFF) {
      return <Navigate to="/staff" />;
    }
    return <Navigate to="/" />;
  }

  return <>{children ? children : <Outlet />}</>;
};

export default RoleProvider;
