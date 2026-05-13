import { Navigate, Outlet } from "react-router";
import useCheckout from "~/store/checkout/checkout.hook";

/**
 * Guard that prevents accessing checkout pages without selected items.
 * Redirects to /cart if checkout state is empty.
 */
const CheckoutProvider = ({ children }: { children?: React.ReactNode }) => {
  const checkout = useCheckout();

  if (!checkout.items || checkout.items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return <>{children ? children : <Outlet />}</>;
};

export default CheckoutProvider;
