import { Link } from "react-router";
import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";
import { useAllBrands } from "~/hooks/react-query/use-brand.query";

// Features data
const features = [
  {
    icon: Truck,
    title: "Giao Hàng Nhanh",
    description: "Giao hàng trong 2-3 ngày toàn quốc",
  },
  {
    icon: Shield,
    title: "100% Chính Hãng",
    description: "Cam kết sản phẩm chính hãng",
  },
  {
    icon: RotateCcw,
    title: "Đổi Trả Dễ Dàng",
    description: "Đổi trả trong vòng 30 ngày",
  },
  {
    icon: Headphones,
    title: "Hỗ Trợ 24/7",
    description: "Tư vấn nhiệt tình mọi lúc",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-12 border-b">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const BrandsSection = () => {
  const { data: brands } = useAllBrands();

  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-xl font-semibold text-muted-foreground mb-8">
          Thương Hiệu Nổi Tiếng
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {brands.slice(0, 6).map((brand) => (
            <Link
              key={brand.id}
              to={`/sneakers?brandId=${brand.id}`}
              className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              {brand.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="h-12 md:h-16 w-auto object-contain"
                />
              ) : (
                <span className="text-2xl font-bold text-gray-400 hover:text-primary">
                  {brand.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
