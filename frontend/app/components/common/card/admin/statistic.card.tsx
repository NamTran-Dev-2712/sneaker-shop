import type { LucideIcon } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

interface StatisticCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  iconColor?: string;
  iconBgColor?: string;
  isLoading?: boolean;
  className?: string;
}

export const StatisticCard = ({
  icon: Icon,
  label,
  value,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  isLoading = false,
  className,
}: StatisticCardProps) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm",
          className,
        )}
      >
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
            iconBgColor,
          )}
        >
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">
            {label}
          </p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatisticCard;
