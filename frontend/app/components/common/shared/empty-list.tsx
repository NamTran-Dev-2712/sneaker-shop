import { PackageOpen, type LucideIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface EmptyListProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyList = ({
  icon: Icon = PackageOpen,
  title = "Không có dữ liệu",
  description = "Chưa có mục nào được tạo hoặc không tìm thấy kết quả phù hợp với bộ lọc.",
  actionLabel,
  onAction,
  className,
}: EmptyListProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className,
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6 animate-in fade-in-0 zoom-in-95 duration-300">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-100">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-150">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-200"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyList;
