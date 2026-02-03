import { useEffect, useState, useMemo } from "react";
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
  Package,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import {
  useAccessoryDetailBySlug,
  useIncrementAccessoryViewCount,
  useFeaturedAccessories,
} from "~/hooks/react-query/use-accessory.query";
import { useAddToCart } from "~/hooks/react-query/use-cart.query";
import useAuth from "~/store/auth/auth.hook";
import { AccessoryCard } from "~/components/common/card/client/accessory.card";
import { AccessoryImageGallery } from "./accessory-image-gallery";
import {
  ProductDescriptionSection,
  ProductReviewSection,
} from "~/components/feature/shop/common/product-sections";
import { RelatedProducts } from "~/components/feature/shop/common/related-products";
import type { GetAccessoryDetailResponse } from "~/services/shop/accessory/dto/get-accessory/get-accessory.response";

interface AccessoryDetailIndexProps {
  initialData?: GetAccessoryDetailResponse | null;
  slug?: string;
}

export const AccessoryDetailIndex = ({
  initialData,
  slug: propSlug,
}: AccessoryDetailIndexProps) => {
  const { slug: paramSlug } = useParams();
  const navigate = useNavigate();
  const slug = propSlug || paramSlug || "";
  const [quantity, setQuantity] = useState(1);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  // Auth state
  const { isLogin } = useAuth();

  // Use slug-based query, pass initialData to prevent unnecessary API call
  const {
    data: accessory,
    isLoading,
    error,
  } = useAccessoryDetailBySlug(slug, initialData);

  const { data: relatedProducts } = useFeaturedAccessories("BestSelling", 4);
  const incrementViewCount = useIncrementAccessoryViewCount();
  const addToCartMutation = useAddToCart();

  // Increment view count on mount
  useEffect(() => {
    if (accessory?.id && accessory.id > 0) {
      incrementViewCount.mutate(accessory.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessory?.id]);

  // Build images array
  const images = useMemo(() => {
    if (!accessory) return [];
    const imageList: string[] = [];
    if (accessory.mainImage) {
      imageList.push(accessory.mainImage);
    }
    if (accessory.images) {
      accessory.images.forEach((img) => {
        if (!imageList.includes(img.imageUrl)) {
          imageList.push(img.imageUrl);
        }
      });
    }
    return imageList;
  }, [accessory]);

  // Get all available stores from inventories
  const availableStores = useMemo(() => {
    if (!accessory?.sellableItem?.inventories) return [];
    return accessory.sellableItem.inventories.map((inv) => ({
      id: inv.storeId,
      name: inv.storeName,
      address: inv.storeAddress,
    }));
  }, [accessory]);

  // Get stock quantity for selected store
  const stockQuantity = useMemo(() => {
    if (!selectedStoreId || !accessory?.sellableItem?.inventories) return 0;
    const inventory = accessory.sellableItem.inventories.find(
      (inv) => inv.storeId === selectedStoreId,
    );
    return inventory?.available ?? 0;
  }, [accessory, selectedStoreId]);

  const isInStock = stockQuantity > 0;

  // Calculate price
  const displayPrice = useMemo(() => {
    if (accessory?.sellableItem?.retailPrice) {
      return accessory.sellableItem.retailPrice;
    }
    if (accessory?.sellableItem?.onlinePrice) {
      return accessory.sellableItem.onlinePrice;
    }
    if (accessory?.basePrice) {
      return accessory.basePrice;
    }
    return null;
  }, [accessory]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleQuantityChange = (delta: number) => {
    const maxQuantity = stockQuantity || 1;
    setQuantity((prev) => Math.max(1, Math.min(maxQuantity, prev + delta)));
  };

  // Handle add to cart
  const handleAddToCart = () => {
    // Check if user is logged in
    if (!isLogin) {
      navigate("/login");
      return;
    }

    // Validate selection
    if (!selectedStoreId || !accessory?.sellableItem?.id) return;

    // Find selected inventory
    const selectedInventory = accessory.sellableItem.inventories?.find(
      (inv) => inv.storeId === selectedStoreId,
    );

    if (!selectedInventory) return;

    addToCartMutation.mutate({
      sellableItemId: accessory.sellableItem.id,
      inventoryId: selectedInventory.id,
      quantity: quantity,
    });
  };

  // Loading state
  if (isLoading && !initialData) {
    return <AccessoryDetailSkeleton />;
  }

  // Error state
  if (error || !accessory) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <Package className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
          <p className="text-muted-foreground mb-8">
            Sản phẩm này có thể đã bị xóa hoặc không tồn tại.
          </p>
          <Button asChild>
            <Link to="/accessories">Quay lại danh sách</Link>
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
              to="/accessories"
              className="hover:text-primary transition-colors"
            >
              Phụ kiện
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {accessory.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <AccessoryImageGallery images={images} productName={accessory.name} />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Brand */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-primary border-primary">
                {accessory.category?.name}
              </Badge>
              <Badge variant="secondary">{accessory.brand?.name}</Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {accessory.name}
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
                <span>Đã bán: {accessory.selled}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{accessory.viewCount} lượt xem</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-primary">
                {displayPrice ? formatPrice(displayPrice) : "Liên hệ"}
              </div>
              {accessory.sellableItem?.sku && (
                <p className="text-sm text-muted-foreground mt-1">
                  SKU: {accessory.sellableItem.sku}
                </p>
              )}
            </div>

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
                      Sản phẩm này hiện chưa được nhập hàng tại bất kỳ chi nhánh
                      nào. Vui lòng liên hệ cửa hàng để được hỗ trợ.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stock Status */}
            {selectedStoreId && (
              <div className="flex items-center gap-2">
                {isInStock ? (
                  <>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200 bg-green-50"
                    >
                      Còn hàng
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({stockQuantity} sản phẩm có sẵn tại chi nhánh này)
                    </span>
                  </>
                ) : (
                  <Badge variant="destructive">
                    Hết hàng tại chi nhánh này
                  </Badge>
                )}
              </div>
            )}

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
                    disabled={quantity >= stockQuantity}
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
                  !selectedStoreId || !isInStock || addToCartMutation.isPending
                }
                onClick={handleAddToCart}
              >
                {addToCartMutation.isPending ? (
                  <>
                    <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Đang thêm...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Thêm vào giỏ
                  </>
                )}
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
          <ProductDescriptionSection description={accessory.description} />
        </div>

        {/* Review Section */}
        <div className="mt-8">
          <ProductReviewSection reviewCount={0} averageRating={0} />
        </div>

        {/* Related Products */}
        <RelatedProducts
          products={relatedProducts}
          currentProductId={accessory.id}
          renderItem={(product) => (
            <AccessoryCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              mainImage={product.mainImage}
              basePrice={product.basePrice}
              categoryName={product.category.name}
              brandName={product.brand.name}
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
const AccessoryDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-xl" />
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

export default AccessoryDetailIndex;
