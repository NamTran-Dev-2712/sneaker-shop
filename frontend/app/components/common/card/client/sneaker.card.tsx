import { Link } from "react-router";
import { Star, Eye, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

interface SneakerCardProps {
  id: number;
  name: string;
  slug: string;
  mainImage: string;
  basePrice?: number;
  brandName: string;
  brandSeriesName?: string;
  averageRating?: number;
  ratingCount?: number;
  viewCount?: number;
  selled?: number;
  className?: string;
}

export const SneakerCard = ({
  id,
  name,
  slug,
  mainImage,
  basePrice,
  brandName,
  brandSeriesName,
  averageRating = 0,
  ratingCount = 0,
  viewCount = 0,
  selled = 0,
  className,
}: SneakerCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <Link to={`/sneakers/${slug}`} className={cn("group block", className)}>
      <Card className="overflow-hidden border-0 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={mainImage || "/placeholder-sneaker.jpg"}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {selled > 50 && (
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-md">
                🔥 Bán chạy
              </Badge>
            )}
            {averageRating >= 4.5 && ratingCount > 10 && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 shadow-md">
                ⭐ Đánh giá cao
              </Badge>
            )}
          </div>

          {/* Quick stats overlay - appears on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex gap-4 text-white">
              <div className="flex items-center gap-1 text-sm">
                <Eye className="h-4 w-4" />
                <span>{formatNumber(viewCount)}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <ShoppingBag className="h-4 w-4" />
                <span>{formatNumber(selled)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          {/* Brand */}
          <div className="mb-1">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              {brandName}
              {brandSeriesName && ` • ${brandSeriesName}`}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem] text-sm md:text-base group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-3 w-3",
                    star <= Math.round(averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300",
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({ratingCount} đánh giá)
            </span>
          </div>

          {/* Price */}
          <div className="mt-3">
            {basePrice ? (
              <span className="text-lg font-bold text-primary">
                {formatPrice(basePrice)}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                Liên hệ để biết giá
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SneakerCard;
