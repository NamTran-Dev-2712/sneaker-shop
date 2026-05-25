import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useAllSlides } from "~/hooks/react-query/use-slide.query";

// Default fallback banner when no slides exist
const DEFAULT_BANNER = {
  id: 0,
  title: "Chào mừng đến với Sneaker Shop",
  subtitle: "Bộ sưu tập giày sneaker chính hãng",
  description:
    "Khám phá hàng ngàn đôi giày sneaker chính hãng từ các thương hiệu hàng đầu thế giới với giá tốt nhất",
  imageUrl:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&q=80",
  buttonText: "Khám phá ngay",
  buttonUrl: "/sneakers",
};

export const HeroBannerSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch slides from API
  const { data: slides, isLoading } = useAllSlides();

  // Use slides or fallback to default
  const bannerData = slides && slides.length > 0 ? slides : [DEFAULT_BANNER];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % bannerData.length);
  }, [bannerData.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + bannerData.length) % bannerData.length,
    );
  }, [bannerData.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, []);

  // Reset index when slides change
  useEffect(() => {
    setCurrentIndex(0);
  }, [slides]);

  useEffect(() => {
    if (!isAutoPlaying || bannerData.length <= 1) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, bannerData.length]);

  const currentBanner = bannerData[currentIndex];

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
        <div className="relative h-full container mx-auto px-4 flex items-center">
          <div className="max-w-2xl space-y-4">
            <div className="h-4 w-32 bg-gray-400/50 rounded" />
            <div className="h-12 w-80 bg-gray-400/50 rounded" />
            <div className="h-6 w-96 bg-gray-400/50 rounded" />
            <div className="h-12 w-40 bg-gray-400/50 rounded" />
          </div>
        </div>
      </section>
    );
  }

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
            src={banner.imageUrl}
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
            <a href={currentBanner.buttonUrl}>{currentBanner.buttonText}</a>
          </Button>
        </div>
      </div>

      {/* Navigation Arrows - only show if multiple slides */}
      {bannerData.length > 1 && (
        <>
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
        </>
      )}

      {/* Dots Indicator - only show if multiple slides */}
      {bannerData.length > 1 && (
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
      )}
    </section>
  );
};

export default HeroBannerSection;
