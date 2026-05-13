import { MoreHorizontal, Edit, Trash2, Store, Mail, Phone } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { GetStaffItem } from "~/services/user/staff/dto/get-staff/get-staff.response";
import { cn } from "~/lib/utils";

interface StaffCardMobileProps {
  staff: GetStaffItem;
  onEdit: (staff: GetStaffItem) => void;
  onDelete: (staff: GetStaffItem) => void;
}

export const StaffCardMobile = ({
  staff,
  onEdit,
  onDelete,
}: StaffCardMobileProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{staff.fullName}</h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
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
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4 shrink-0" />
          <span className="truncate">{staff.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{staff.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Store className="h-4 w-4" />
          <span>
            {staff.storeName}{" "}
            <span className="font-mono text-xs">({staff.storeCode})</span>
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
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
        <span className="text-xs text-muted-foreground">
          {new Date(staff.createdAt).toLocaleDateString("vi-VN")}
        </span>
      </CardFooter>
    </Card>
  );
};

export default StaffCardMobile;
