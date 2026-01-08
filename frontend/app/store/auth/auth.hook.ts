import { useAppSelector } from "~/hooks/redux";

const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);
  return auth;
};

export default useAuth;
