import { Skeleton } from "~/components/ui/skeleton";

const OrderListSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, idx) => (
        <Skeleton key={idx} className="h-14 w-full" />
      ))}
    </div>
  );
};

export default OrderListSkeleton;
