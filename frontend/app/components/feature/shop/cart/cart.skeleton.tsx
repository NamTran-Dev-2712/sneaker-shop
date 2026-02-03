import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

const CartItemSkeleton = () => (
  <Card>
    <CardContent className="p-4">
      <div className="flex gap-4">
        {/* Checkbox */}
        <Skeleton className="h-4 w-4 mt-1" />

        {/* Image */}
        <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg shrink-0" />

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="flex justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="hidden sm:block space-y-1 text-right">
              <Skeleton className="h-6 w-24 ml-auto" />
              <Skeleton className="h-4 w-20 ml-auto" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const CartSummarySkeleton = () => (
  <div className="space-y-4">
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-px w-full" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-7 w-32" />
        </div>
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const CartSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          {/* Select All Skeleton */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Cart Item Skeletons */}
          {[...Array(3)].map((_, i) => (
            <CartItemSkeleton key={i} />
          ))}
        </div>

        {/* Summary Skeleton */}
        <div className="lg:col-span-1">
          <CartSummarySkeleton />
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
