import useAuth from "~/store/auth/auth.hook";
import { Navigate, Outlet } from "react-router";
import { Role } from "~/types/entities/user.type";

const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  if (auth.user?.role === Role.CUSTOMER) {
    return <Navigate to="/" />;
  }
  if (!auth.isLogin) {
    return <Navigate to="/login" />;
  }

  return <>{children ? children : <Outlet />}</>;
};

export default RoleProvider;
