import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { AccessoryCard } from "~/components/common/card/client/accessory.card";
import { ProductSkeletonGrid } from "~/components/common/loading/product-skeleton";
import { useFeaturedAccessories } from "~/hooks/react-query/use-accessory.query";

export const FeaturedAccessoriesSection = () => {
  const {
    data: accessories,
    isLoading,
    error,
  } = useFeaturedAccessories("BestSelling", 4);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Phụ Kiện Được Yêu Thích
            </h2>
            <p className="text-muted-foreground">
              Bảo vệ và làm đẹp cho đôi giày của bạn
            </p>
          </div>
          <Button variant="ghost" className="mt-4 md:mt-0 group" asChild>
            <Link to="/accessories">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <ProductSkeletonGrid count={4} className="lg:grid-cols-4" />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Không thể tải sản phẩm. Vui lòng thử lại sau.
            </p>
          </div>
        ) : accessories && accessories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {accessories.map((accessory) => (
              <AccessoryCard
                key={accessory.id}
                id={accessory.id}
                name={accessory.name}
                slug={accessory.slug}
                mainImage={accessory.mainImage}
                basePrice={accessory.basePrice}
                categoryName={accessory.category.name}
                brandName={accessory.brand.name}
                averageRating={accessory.averageRating}
                ratingCount={accessory.ratingCount}
                viewCount={accessory.viewCount}
                selled={accessory.selled}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chưa có phụ kiện nào.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedAccessoriesSection;
