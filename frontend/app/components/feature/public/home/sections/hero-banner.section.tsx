import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

// Mock banner data - will be replaced with API data later
const bannerData = [
  {
    id: 1,
    title: "Bộ Sưu Tập Mới",
    subtitle: "Nike Air Max 2024",
    description:
      "Khám phá phong cách mới với bộ sưu tập giày sneaker mới nhất từ Nike",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&q=80",
    buttonText: "Khám phá ngay",
    buttonLink: "/sneakers?brandId=1",
    gradient: "from-orange-600/90 to-red-600/90",
  },
  {
    id: 2,
    title: "Giảm Giá Đặc Biệt",
    subtitle: "Lên đến 50%",
    description: "Cơ hội sở hữu giày sneaker chính hãng với giá ưu đãi nhất",
    image:
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=1920&q=80",
    buttonText: "Mua ngay",
    buttonLink: "/sneakers",
    gradient: "from-purple-600/90 to-pink-600/90",
  },
  {
    id: 3,
    title: "Phụ Kiện Cao Cấp",
    subtitle: "Bảo vệ và làm đẹp giày của bạn",
    description: "Tất cả phụ kiện cần thiết cho giày sneaker của bạn",
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1920&q=80",
    buttonText: "Xem phụ kiện",
    buttonLink: "/accessories",
    gradient: "from-blue-600/90 to-cyan-600/90",
  },
];

export const HeroBannerSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % bannerData.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + bannerData.length) % bannerData.length,
    );
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const currentBanner = bannerData[currentIndex];

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Images */}
      {bannerData.map((banner, index) => (
        <div
          key={banner.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentIndex ? "opacity-100" : "opacity-0",
          )}
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl text-white">
          <p className="text-sm md:text-base uppercase tracking-widest mb-2 animate-in slide-in-from-left-4 duration-500">
            {currentBanner.subtitle}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-in slide-in-from-left-4 duration-500 delay-100">
            {currentBanner.title}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 animate-in slide-in-from-left-4 duration-500 delay-200">
            {currentBanner.description}
          </p>
          <Button
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 animate-in slide-in-from-left-4 duration-500 delay-300"
            asChild
          >
            <a href={currentBanner.buttonLink}>{currentBanner.buttonText}</a>
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerData.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/70",
            )}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBannerSection;
