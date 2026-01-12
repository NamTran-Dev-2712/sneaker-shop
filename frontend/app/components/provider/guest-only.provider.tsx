import { Navigate, Outlet } from "react-router";
import useAuth from "~/store/auth/auth.hook";
import { Role } from "~/types/entities/user.type";

const GuestOnlyProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  if (auth.isLogin && auth.user?.role !== Role.ADMIN) {
    return <Navigate to={"/"} />;
  }
  if (auth.isLogin && auth.user?.role === Role.ADMIN) {
    return <Navigate to={"/admin"} />;
  } else if (auth.isLogin && auth.user?.role === Role.STAFF) {
    return <Navigate to="/staff/orders" />;
  }

  return <>{children ? children : <Outlet />}</>;
};

export default GuestOnlyProvider;
