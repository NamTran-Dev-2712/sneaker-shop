import {
  Edit,
  MoreHorizontal,
  Trash2,
  Store,
  Mail,
  Phone,
  UserCog,
} from "lucide-react";
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
import { StaffCardMobile } from "~/components/common/card/admin/staff.card-mobile";
import { EmptyList } from "~/components/common/shared/empty-list";
import type { GetStaffItem } from "~/services/user/staff/dto/get-staff/get-staff.response";
import { cn } from "~/lib/utils";

interface StaffListItemProps {
  staffs: GetStaffItem[] | undefined;
  isLoading: boolean;
  onEdit: (staff: GetStaffItem) => void;
  onDelete: (staff: GetStaffItem) => void;
  onAdd: () => void;
}

export const StaffListItem = ({
  staffs,
  isLoading,
  onEdit,
  onDelete,
  onAdd,
}: StaffListItemProps) => {
  if (isLoading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden md:block rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead>Cửa hàng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[80px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <div className="flex justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (!staffs || staffs.length === 0) {
    return (
      <EmptyList
        icon={UserCog}
        title="Chưa có nhân viên nào"
        description="Bạn chưa tạo nhân viên nào hoặc không tìm thấy kết quả phù hợp với bộ lọc."
        actionLabel="Thêm nhân viên mới"
        onAction={onAdd}
      />
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Họ và tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[130px]">SĐT</TableHead>
              <TableHead>Cửa hàng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[80px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffs.map((staff) => (
              <TableRow key={staff.id} className="group">
                <TableCell className="font-medium">{staff.fullName}</TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{staff.email}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    <span>{staff.phone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm">{staff.storeName}</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {staff.storeCode}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={staff.isActive ? "default" : "secondary"}
                    className={cn(
                      staff.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400",
                    )}
                  >
                    {staff.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(staff)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(staff)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Vô hiệu hóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {staffs.map((staff) => (
          <StaffCardMobile
            key={staff.id}
            staff={staff}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
};

export default StaffListItem;
