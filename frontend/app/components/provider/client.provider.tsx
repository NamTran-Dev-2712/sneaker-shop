import useAuth from "~/store/auth/auth.hook";
import { Navigate, Outlet } from "react-router";
import { Role } from "~/types/entities/user.type";

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  console.log(auth.user);

  if (auth.user?.role === Role.ADMIN) {
    return <Navigate to="/admin" />;
  } else if (auth.user?.role === Role.STAFF) {
    return <Navigate to="/staff/" />;
  }

  return <>{children ? children : <Outlet />}</>;
};

export default ClientProvider;
