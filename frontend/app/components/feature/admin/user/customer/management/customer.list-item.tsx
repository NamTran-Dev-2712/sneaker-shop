import { Link } from "react-router";
import { MoreHorizontal, Mail, Phone, UserCheck, UserX } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { EmptyList } from "~/components/common/shared/empty-list";
import type { CustomerItem } from "~/services/user/customer/dto/get-customers/get-customers.response";
import { formatDate } from "~/common/helpers/format-date.helper";

interface CustomerListItemProps {
  customers: CustomerItem[] | undefined;
  isLoading: boolean;
  onToggleActive: (customer: CustomerItem) => void;
}

export const CustomerListItem = ({
  customers,
  isLoading,
  onToggleActive,
}: CustomerListItemProps) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên khách hàng</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead>Tài khoản</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-20">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
                {Array.from({ length: 6 }).map((__, i) => (
                  <TableCell key={i}>
                    <Skeleton className="h-4 w-full max-w-30" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!customers || customers.length === 0) {
    return <EmptyList title="Chưa có khách hàng nào." />;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên khách hàng</TableHead>
            <TableHead>Liên hệ</TableHead>
            <TableHead>Tài khoản</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="w-20">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <Link
                  to={`/admin/customers/${customer.id}`}
                  className="font-medium hover:underline"
                >
                  {customer.fullName}
                </Link>
              </TableCell>
              <TableCell>
                <div className="space-y-0.5">
                  {customer.phone && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {customer.phone}
                    </div>
                  )}
                  {customer.email && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {customer.email}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {customer.hasAccount ? (
                  <Badge variant="secondary">Có tài khoản</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Vãng lai
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {customer.hasAccount ? (
                  customer.isActive ? (
                    <Badge
                      variant="outline"
                      className="border-green-500 text-green-700 bg-green-50"
                    >
                      Hoạt động
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-red-400 text-red-600 bg-red-50"
                    >
                      Đã khoá
                    </Badge>
                  )
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(customer.createdAt, {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/customers/${customer.id}`}>
                        Xem chi tiết
                      </Link>
                    </DropdownMenuItem>
                    {customer.hasAccount && (
                      <DropdownMenuItem
                        onClick={() => onToggleActive(customer)}
                        className={
                          customer.isActive
                            ? "text-red-600 focus:text-red-600"
                            : "text-green-700 focus:text-green-700"
                        }
                      >
                        {customer.isActive ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Khoá tài khoản
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Kích hoạt tài khoản
                          </>
                        )}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
