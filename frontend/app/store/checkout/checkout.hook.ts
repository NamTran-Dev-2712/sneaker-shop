import { useAppSelector } from "~/hooks/redux";

const useCheckout = () => {
  const checkout = useAppSelector((state) => state.checkout);
  return checkout;
};

export default useCheckout;
