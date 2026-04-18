import type { Route } from "./+types/customer.management";
import { CustomerIndex } from "~/components/feature/admin/user/customer/management/customer.index";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Quản lý Khách hàng | Admin" }];
};

export default function CustomerManagementRoute() {
  return <CustomerIndex />;
}
