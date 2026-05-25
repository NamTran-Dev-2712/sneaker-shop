import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

interface ProductSkeletonProps {
  className?: string;
}

export const ProductSkeleton = ({ className }: ProductSkeletonProps) => {
  return (
    <Card className={cn("overflow-hidden border-0 shadow-sm", className)}>
      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full" />

      {/* Content skeleton */}
      <CardContent className="p-4">
        {/* Brand */}
        <Skeleton className="h-3 w-20 mb-2" />

        {/* Name */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-3" />

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>

        {/* Price */}
        <Skeleton className="h-6 w-28 mt-3" />
      </CardContent>
    </Card>
  );
};

interface ProductSkeletonGridProps {
  count?: number;
  className?: string;
}

export const ProductSkeletonGrid = ({
  count = 8,
  className,
}: ProductSkeletonGridProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductSkeleton;
