import { Skeleton } from "~/components/ui/skeleton";

const OrderDetailSkeleton = () => {
  return (
    <div className="space-y-4 p-4 md:p-6">
      <Skeleton className="h-8 w-52" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
};

export default OrderDetailSkeleton;
