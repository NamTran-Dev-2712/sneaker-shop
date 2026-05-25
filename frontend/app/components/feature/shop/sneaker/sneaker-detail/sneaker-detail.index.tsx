import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  Heart,
  Share2,
  ShoppingCart,
  Star,
  Eye,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import {
  useSneakerDetailBySlug,
  useIncrementSneakerViewCount,
  useFeaturedSneakers,
} from "~/hooks/react-query/use-sneaker.query";
import { useAddToCart } from "~/hooks/react-query/use-cart.query";
import useAuth from "~/store/auth/auth.hook";
import { SneakerCard } from "~/components/common/card/client/sneaker.card";
import { SneakerImageGallery } from "./sneaker-image-gallery";
import { SneakerColorSelector } from "./sneaker-color-selector";
import { SneakerSizeSelector } from "./sneaker-size-selector";
import {
  ProductDescriptionSection,
  ProductReviewSection,
} from "~/components/feature/shop/common/product-sections";
import { RelatedProducts } from "~/components/feature/shop/common/related-products";
import type { GetSneakerDetailResponse } from "~/services/shop/sneaker/dto/get-sneaker/get-sneaker.response";

interface SneakerDetailIndexProps {
  initialData?: GetSneakerDetailResponse | null;
  slug?: string;
}

export const SneakerDetailIndex = ({
  initialData,
  slug: propSlug,
}: SneakerDetailIndexProps) => {
  const { slug: paramSlug } = useParams();
  const navigate = useNavigate();
  const slug = propSlug || paramSlug || "";

  // Auth state
  const { isLogin } = useAuth();

  // State
  const [selectedColorwayId, setSelectedColorwayId] = useState<number | null>(
    null,
  );
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Queries - pass initialData to prevent unnecessary API call
  const {
    data: sneaker,
    isLoading,
    error,
  } = useSneakerDetailBySlug(slug, initialData);

  const { data: relatedProducts } = useFeaturedSneakers("BestSelling", 4);
  const incrementViewCount = useIncrementSneakerViewCount();
  const addToCartMutation = useAddToCart();

  // Set default colorway when sneaker loads
  useEffect(() => {
    if (
      sneaker?.colorways &&
      sneaker.colorways.length > 0 &&
      !selectedColorwayId
    ) {
      // Select the first colorway that has stock
      const firstWithStock = sneaker.colorways.find((c) =>
        c.variants?.some((v) =>
          v.inventories?.some((inv) => inv.available > 0),
        ),
      );
      setSelectedColorwayId(firstWithStock?.id || sneaker.colorways[0].id);
    }
  }, [sneaker, selectedColorwayId]);

  // Increment view count on mount
  useEffect(() => {
    if (sneaker?.id && sneaker.id > 0) {
      incrementViewCount.mutate(sneaker.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sneaker?.id]);

  // Reset size when colorway changes
  const handleColorwayChange = useCallback((colorwayId: number) => {
    setSelectedColorwayId(colorwayId);
    setSelectedSizeId(null);
  }, []);

  // Get current colorway
  const currentColorway = useMemo(() => {
    return sneaker?.colorways?.find((c) => c.id === selectedColorwayId);
  }, [sneaker?.colorways, selectedColorwayId]);

  // Get all unique stores from current colorway's variants
  const availableStores = useMemo(() => {
    if (!currentColorway?.variants) return [];
    const storeMap = new Map<
      number,
      { id: number; name: string; address: string }
    >();
    currentColorway.variants.forEach((variant) => {
      variant.inventories?.forEach((inv) => {
        if (!storeMap.has(inv.storeId)) {
          storeMap.set(inv.storeId, {
            id: inv.storeId,
            name: inv.storeName,
            address: inv.storeAddress,
          });
        }
      });
    });
    return Array.from(storeMap.values());
  }, [currentColorway]);

  // Get available stock for a variant at selected store
  const getVariantStock = useCallback(
    (variantId: number) => {
      if (!selectedStoreId || !currentColorway?.variants) return 0;
      const variant = currentColorway.variants.find((v) => v.id === variantId);
      const inventory = variant?.inventories?.find(
        (inv) => inv.storeId === selectedStoreId,
      );
      return inventory?.available ?? 0;
    },
    [currentColorway, selectedStoreId],
  );

  // Get variants for current colorway (with stock at selected store)
  const availableVariants = useMemo(() => {
    if (!selectedStoreId) return [];
    return (
      currentColorway?.variants?.filter(
        (v) =>
          v.isActive &&
          v.inventories?.some(
            (inv) => inv.storeId === selectedStoreId && inv.available > 0,
          ),
      ) || []
    );
  }, [currentColorway, selectedStoreId]);

  // Get selected variant
  const selectedVariant = useMemo(() => {
    return currentColorway?.variants?.find((v) => v.size.id === selectedSizeId);
  }, [currentColorway, selectedSizeId]);

  // Build images array - prioritize colorway cover image
  const images = useMemo(() => {
    if (!sneaker) return [];

    const imageList: string[] = [];

    // If colorway is selected, use its cover image first
    if (currentColorway?.coverImage) {
      imageList.push(currentColorway.coverImage);
    }

    // Add main image if different from colorway cover
    if (
      sneaker.mainImage &&
      sneaker.mainImage !== currentColorway?.coverImage
    ) {
      imageList.push(sneaker.mainImage);
    }

    // Add sub images
    if (sneaker.subImages) {
      sneaker.subImages.forEach((img) => {
        if (!imageList.includes(img.imageUrl)) {
          imageList.push(img.imageUrl);
        }
      });
    }

    return imageList;
  }, [sneaker, currentColorway]);

  // Calculate price
  const displayPrice = useMemo(() => {
    if (selectedVariant?.retailPrice) {
      return selectedVariant.retailPrice;
    }
    if (selectedVariant?.onlinePrice) {
      return selectedVariant.onlinePrice;
    }
    if (sneaker?.basePrice) {
      return sneaker.basePrice;
    }
    return null;
  }, [selectedVariant, sneaker?.basePrice]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleQuantityChange = (delta: number) => {
    const maxQuantity = selectedVariant
      ? getVariantStock(selectedVariant.id)
      : 1;
    setQuantity((prev) => Math.max(1, Math.min(maxQuantity, prev + delta)));
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!isLogin) {
      navigate("/login");
      return;
    }

    if (!selectedVariant || !selectedStoreId) return;

    // Find the inventory for selected store
    const inventory = selectedVariant.inventories?.find(
      (inv) => inv.storeId === selectedStoreId,
    );

    if (!inventory || !selectedVariant.sellableItemId) return;

    addToCartMutation.mutate({
      sellableItemId: selectedVariant.sellableItemId,
      inventoryId: inventory.id,
      quantity,
    });
  };

  // Loading state
  if (isLoading && !initialData) {
    return <SneakerDetailSkeleton />;
  }

  // Error state
  if (error || !sneaker) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
          <p className="text-muted-foreground mb-8">
            Sản phẩm này có thể đã bị xóa hoặc không tồn tại.
          </p>
          <Button asChild>
            <Link to="/sneakers">Quay lại danh sách</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link
              to="/sneakers"
              className="hover:text-primary transition-colors"
            >
              Sneakers
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {sneaker.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <SneakerImageGallery images={images} productName={sneaker.name} />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-primary border-primary">
                {sneaker.brand?.name}
              </Badge>
              {sneaker.brandSeries && (
                <Badge variant="secondary">{sneaker.brandSeries.name}</Badge>
              )}
              {!sneaker.isActive && (
                <Badge variant="destructive">Ngừng kinh doanh</Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {sneaker.name}
            </h1>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">0</span>
                <span className="text-muted-foreground">(0 đánh giá)</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <ShoppingBag className="h-4 w-4" />
                <span>Đã bán: {sneaker.selled}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{sneaker.viewCount} lượt xem</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-primary">
                {displayPrice ? formatPrice(displayPrice) : "Liên hệ"}
              </div>
              {selectedVariant?.sku && (
                <p className="text-sm text-muted-foreground mt-1">
                  SKU: {selectedVariant.sku}
                </p>
              )}
            </div>

            {/* Colorway Selection */}
            {sneaker.colorways && sneaker.colorways.length > 0 && (
              <SneakerColorSelector
                colorways={sneaker.colorways}
                selectedColorwayId={selectedColorwayId}
                onColorwayChange={handleColorwayChange}
              />
            )}

            {/* Store Selection */}
            {availableStores.length > 0 ? (
              <div className="space-y-3">
                <div className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Chọn chi nhánh
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableStores.map((store) => (
                    <button
                      key={store.id}
                      type="button"
                      onClick={() => {
                        setSelectedStoreId(store.id);
                        setSelectedSizeId(null);
                        setQuantity(1);
                      }}
                      className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                        selectedStoreId === store.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-medium">{store.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {store.address}
                      </div>
                    </button>
                  ))}
                </div>
                {!selectedStoreId && (
                  <p className="text-sm text-amber-600">
                    Vui lòng chọn chi nhánh để xem số lượng tồn kho
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-amber-800">
                      Sản phẩm chưa có tồn kho
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      Màu sắc này hiện chưa được nhập hàng tại bất kỳ chi nhánh
                      nào. Vui lòng chọn màu khác hoặc liên hệ cửa hàng để được
                      hỗ trợ.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Size Selection */}
            <SneakerSizeSelector
              variants={currentColorway?.variants || []}
              selectedSizeId={selectedSizeId}
              onSizeChange={setSelectedSizeId}
              selectedStoreId={selectedStoreId}
              getVariantStock={getVariantStock}
            />

            {/* Quantity */}
            <div className="space-y-3">
              <div className="font-semibold">Số lượng</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-r-none"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-l-none"
                    onClick={() => handleQuantityChange(1)}
                    disabled={
                      !selectedVariant ||
                      quantity >=
                        (selectedVariant
                          ? getVariantStock(selectedVariant.id)
                          : 0)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                size="lg"
                className="flex-1"
                disabled={
                  !selectedStoreId ||
                  !selectedSizeId ||
                  !selectedVariant ||
                  addToCartMutation.isPending
                }
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {addToCartMutation.isPending ? "Đang thêm..." : "Thêm vào giỏ"}
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Giao hàng nhanh
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Chính hãng 100%
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <RotateCcw className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Đổi trả 30 ngày
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-12">
          <ProductDescriptionSection description={sneaker.description} />
        </div>

        {/* Review Section */}
        <div className="mt-8">
          <ProductReviewSection reviewCount={0} averageRating={0} />
        </div>

        {/* Related Products */}
        <RelatedProducts
          products={relatedProducts}
          currentProductId={sneaker.id}
          renderItem={(product) => (
            <SneakerCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              mainImage={product.mainImage}
              basePrice={product.basePrice}
              brandName={product.brand.name}
              brandSeriesName={product.brandSeries?.name}
              averageRating={product.averageRating}
              ratingCount={product.ratingCount}
              viewCount={product.viewCount}
              selled={product.selled}
            />
          )}
        />
      </div>
    </div>
  );
};

// Skeleton loading component
const SneakerDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-20 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  </div>
);

export default SneakerDetailIndex;
