import { useParams } from "react-router";
import type { Route } from "./+types/customer.detail";
import CustomerDetail from "~/components/feature/admin/user/customer/detail/customer.detail";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Chi tiết Khách hàng | Admin" }];
};

export default function CustomerDetailRoute() {
  const { id } = useParams();
  const customerId = Number(id);

  return <CustomerDetail id={customerId} />;
}
