import { Outlet } from "react-router";
import { useAppDispatch } from "~/hooks/redux";
import { useEffect } from "react";
import { login, logout } from "~/store/auth/auth.slice";
import type { LoginResponse } from "~/services/auth/dto/login/login.response";

interface UserProviderProps {
  user: LoginResponse | null;
  children: React.ReactNode;
}

const UserProvider = ({ user, children }: UserProviderProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(login(user));
    } else {
      dispatch(logout());
    }
  }, [user, dispatch]);

  return <>{children ? children : <Outlet />}</>;
};

export default UserProvider;
