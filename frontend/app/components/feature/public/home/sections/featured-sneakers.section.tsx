import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Flame, Eye, Star } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { SneakerCard } from "~/components/common/card/client/sneaker.card";
import { ProductSkeletonGrid } from "~/components/common/loading/product-skeleton";
import { useFeaturedSneakers } from "~/hooks/react-query/use-sneaker.query";
import { cn } from "~/lib/utils";

type FeaturedType = "TopRated" | "MostViewed" | "BestSelling";

const tabConfig: {
  value: FeaturedType;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "BestSelling",
    label: "Bán chạy nhất",
    icon: <Flame className="h-4 w-4" />,
  },
  {
    value: "TopRated",
    label: "Đánh giá cao",
    icon: <Star className="h-4 w-4" />,
  },
  {
    value: "MostViewed",
    label: "Xem nhiều",
    icon: <Eye className="h-4 w-4" />,
  },
];

export const FeaturedSneakersSection = () => {
  const [activeTab, setActiveTab] = useState<FeaturedType>("BestSelling");
  const {
    data: sneakers,
    isLoading,
    error,
  } = useFeaturedSneakers(activeTab, 8);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Giày Sneaker Nổi Bật
            </h2>
            <p className="text-muted-foreground">
              Khám phá những đôi giày được yêu thích nhất tại Sneaker Shop
            </p>
          </div>
          <Button variant="ghost" className="mt-4 md:mt-0 group" asChild>
            <Link to="/sneakers">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as FeaturedType)}
        >
          <TabsList className="mb-8 bg-white shadow-sm">
            {tabConfig.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white",
                )}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabConfig.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              {isLoading ? (
                <ProductSkeletonGrid count={8} />
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Không thể tải sản phẩm. Vui lòng thử lại sau.
                  </p>
                </div>
              ) : sneakers && sneakers.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {sneakers.map((sneaker) => (
                    <SneakerCard
                      key={sneaker.id}
                      id={sneaker.id}
                      name={sneaker.name}
                      slug={sneaker.slug}
                      mainImage={sneaker.mainImage}
                      basePrice={sneaker.basePrice}
                      brandName={sneaker.brand.name}
                      brandSeriesName={sneaker.brandSeries?.name}
                      averageRating={sneaker.averageRating}
                      ratingCount={sneaker.ratingCount}
                      viewCount={sneaker.viewCount}
                      selled={sneaker.selled}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Chưa có sản phẩm nào trong danh mục này.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturedSneakersSection;
