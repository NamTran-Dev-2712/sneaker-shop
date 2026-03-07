import useAuth from "~/store/auth/auth.hook";
import { Navigate, Outlet } from "react-router";
import { Role } from "~/types/entities/user.type";

const StaffProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  if (!auth.isLogin) {
    return <Navigate to="/login" />;
  }
  if (auth.user?.role !== Role.STAFF) {
    if (auth.user?.role === Role.ADMIN) {
      return <Navigate to="/admin" />;
    }
    return <Navigate to="/" />;
  }

  return <>{children ? children : <Outlet />}</>;
};

export default StaffProvider;
