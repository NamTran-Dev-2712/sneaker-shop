import { useAppSelector } from "~/hooks/redux";

const useAdminLayout = () => {
  const layout = useAppSelector((state) => state.adminLayout);
  return layout;
};

export default useAdminLayout;
