import { Navigate, Outlet } from "react-router";
import { useAppDispatch } from "~/hooks/redux";
import useAuth from "~/store/auth/auth.hook";
import { logout } from "~/store/auth/auth.slice";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const dispatch = useAppDispatch();

  if (!auth.isLogin) {
    dispatch(logout());
    return <Navigate to="/login" />;
  }

  return <>{children ? children : <Outlet />}</>;
};

export default AuthProvider;
