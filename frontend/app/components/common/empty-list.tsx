import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Empty } from "~/components/ui/empty"; // Assuming this exists based on list_dir
import { ShoppingBag } from "lucide-react";

interface EmptyListProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionLink?: string;
}

export function EmptyList({
  title = "Danh sách trống",
  description = "Chưa có dữ liệu nào để hiển thị",
  icon = <ShoppingBag className="w-12 h-12 text-muted-foreground" />,
  actionLabel = "Tiếp tục mua sắm",
  actionLink = "/",
}: EmptyListProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted/30 p-6">{icon}</div>
      <h3 className="mb-2 text-2xl font-bold tracking-tight">{title}</h3>
      <p className="mb-8 text-muted-foreground max-w-[400px]">{description}</p>
      {actionLink && (
        <Button asChild size="lg">
          <Link to={actionLink}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
