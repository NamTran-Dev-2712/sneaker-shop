import HeroBannerSection from "./sections/hero-banner.section";
import FeaturedSneakersSection from "./sections/featured-sneakers.section";
import FeaturedAccessoriesSection from "./sections/featured-accessories.section";
import ReviewsSection from "./sections/reviews.section";
import FeaturesSection, { BrandsSection } from "./sections/features.section";

const HomeIndex = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Banner Carousel */}
      <HeroBannerSection />

      {/* Features Strip */}
      <FeaturesSection />

      {/* Featured Sneakers */}
      <FeaturedSneakersSection />

      {/* Featured Accessories */}
      <FeaturedAccessoriesSection />

      {/* Customer Reviews */}
      <ReviewsSection />

      {/* Brands */}
      <BrandsSection />
    </div>
  );
};

export default HomeIndex;
