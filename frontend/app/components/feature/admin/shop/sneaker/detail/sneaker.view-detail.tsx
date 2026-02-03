import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Edit,
  Package,
  Palette,
  Layers,
  CheckCircle,
  XCircle,
  Images,
  ChevronLeft,
  ChevronRight,
  Warehouse,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Separator } from "~/components/ui/separator";
import { useSneakerDetail } from "~/hooks/react-query/use-sneaker.query";
import { useState } from "react";

export const SneakerViewDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const sneakerId = parseInt(params.id || "0");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: sneaker, isLoading, error } = useSneakerDetail(sneakerId);

  const formatPrice = (price?: number) => {
    if (!price) return "—";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleBack = () => {
    navigate("/admin/sneakers");
  };

  const handleEdit = () => {
    navigate(`/admin/sneakers/${sneakerId}/edit`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !sneaker) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Không tìm thấy sản phẩm hoặc có lỗi xảy ra
        </p>
        <Button variant="outline" className="mt-4" onClick={handleBack}>
          Quay lại
        </Button>
      </div>
    );
  }

  // Combine main image and sub-images for gallery
  const allImages = [
    { id: 0, imageUrl: sneaker.mainImage, isMain: true },
    ...(sneaker.subImages?.map((img) => ({ ...img, isMain: false })) || []),
  ];

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {sneaker.name}
            </h1>
            <p className="text-muted-foreground">{sneaker.slug}</p>
          </div>
        </div>
        <Button onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image gallery and basic info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image Gallery */}
                <div className="w-full md:w-80 space-y-3">
                  {/* Main selected image */}
                  <div className="relative aspect-square rounded-lg border overflow-hidden bg-muted">
                    <img
                      src={allImages[selectedImageIndex]?.imageUrl}
                      alt={sneaker.name}
                      className="w-full h-full object-cover"
                    />
                    {allImages[selectedImageIndex]?.isMain && (
                      <Badge
                        className="absolute top-2 left-2"
                        variant="secondary"
                      >
                        Ảnh chính
                      </Badge>
                    )}

                    {/* Navigation arrows */}
                    {allImages.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-70 hover:opacity-100"
                          onClick={handlePrevImage}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-70 hover:opacity-100"
                          onClick={handleNextImage}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail strip */}
                  {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {allImages.map((img, index) => (
                        <button
                          key={img.id}
                          type="button"
                          className={`shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                            selectedImageIndex === index
                              ? "border-primary ring-2 ring-primary/30"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <img
                            src={img.imageUrl}
                            alt={`Thumb ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Gallery count badge */}
                  {sneaker.subImages && sneaker.subImages.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Images className="h-4 w-4" />
                      <span>{sneaker.subImages.length + 1} ảnh</span>
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Hãng</p>
                    <p className="font-medium text-lg">{sneaker.brand.name}</p>
                    {sneaker.brandSeries && (
                      <p className="text-muted-foreground">
                        {sneaker.brandSeries.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Trạng thái</p>
                    <Badge
                      variant={sneaker.isActive ? "success" : "secondary"}
                      className="gap-1 mt-1"
                    >
                      {sneaker.isActive ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Đang bán
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          Tạm ẩn
                        </>
                      )}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Giá cơ bản</p>
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(sneaker.basePrice)}
                    </p>
                  </div>

                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>
                      Ngày tạo:{" "}
                      {new Date(sneaker.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                    <span>
                      Cập nhật:{" "}
                      {new Date(sneaker.updatedAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>

              {sneaker.description && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Mô tả</p>
                  <p className="whitespace-pre-wrap">{sneaker.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Colorways */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Phối màu ({sneaker.colorways?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sneaker.colorways?.map((colorway) => (
                <div key={colorway.id} className="rounded-lg border p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={colorway.coverImage}
                      alt={colorway.color.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-5 w-5 rounded-full border"
                          style={{ backgroundColor: colorway.color.hex }}
                        />
                        <span className="font-medium">
                          {colorway.color.name}
                        </span>
                        <span className="text-sm text-muted-foreground font-mono">
                          {colorway.color.hex}
                        </span>
                      </div>
                      <Badge
                        variant={colorway.isActive ? "outline" : "secondary"}
                        className="mt-1"
                      >
                        {colorway.isActive ? "Hiển thị" : "Ẩn"}
                      </Badge>
                    </div>
                  </div>

                  {/* Variants table */}
                  <div className="rounded-lg border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3">Size</th>
                          <th className="text-left p-3">SKU</th>
                          <th className="text-right p-3">Giá bán lẻ</th>
                          <th className="text-right p-3">Giá online</th>
                          <th className="text-center p-3">Tồn kho</th>
                          <th className="text-center p-3">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {colorway.variants?.map((variant) => (
                          <tr key={variant.id} className="border-t">
                            <td className="p-3">
                              <Badge variant="secondary">
                                {variant.size.system} {variant.size.value}
                              </Badge>
                            </td>
                            <td className="p-3 font-mono text-xs">
                              {variant.sku}
                            </td>
                            <td className="p-3 text-right">
                              {formatPrice(variant.retailPrice)}
                            </td>
                            <td className="p-3 text-right">
                              {formatPrice(variant.onlinePrice)}
                            </td>
                            <td className="p-3 text-center">
                              {variant.inventories &&
                              variant.inventories.length > 0 ? (
                                <div className="flex flex-col items-center gap-1">
                                  {variant.inventories.map((inv) => (
                                    <div
                                      key={inv.storeId}
                                      className="flex items-center gap-1"
                                    >
                                      <Badge
                                        variant={
                                          inv.available > 0
                                            ? "success"
                                            : "destructive"
                                        }
                                      >
                                        {inv.available}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {inv.storeName}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              {variant.isActive ? (
                                <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                              ) : (
                                <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thống kê nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Images className="h-4 w-4" />
                  <span>Ảnh gallery</span>
                </div>
                <span className="font-medium">
                  {(sneaker.subImages?.length || 0) + 1}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Palette className="h-4 w-4" />
                  <span>Phối màu</span>
                </div>
                <span className="font-medium">
                  {sneaker.colorways?.length || 0}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Layers className="h-4 w-4" />
                  <span>Biến thể</span>
                </div>
                <span className="font-medium">
                  {sneaker.colorways?.reduce(
                    (sum, cw) => sum + (cw.variants?.length || 0),
                    0,
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>Size có sẵn</span>
                </div>
                <span className="font-medium">
                  {
                    new Set(
                      sneaker.colorways?.flatMap(
                        (cw) => cw.variants?.map((v) => v.size.id) || [],
                      ),
                    ).size
                  }
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Warehouse className="h-4 w-4" />
                  <span>Tổng tồn kho</span>
                </div>
                <Badge
                  variant={
                    sneaker.colorways?.reduce(
                      (sum, cw) =>
                        sum +
                        (cw.variants?.reduce(
                          (vSum, v) =>
                            vSum +
                            (v.inventories?.reduce(
                              (invSum, inv) => invSum + inv.available,
                              0,
                            ) || 0),
                          0,
                        ) || 0),
                      0,
                    ) || 0 > 0
                      ? "success"
                      : "secondary"
                  }
                >
                  {sneaker.colorways?.reduce(
                    (sum, cw) =>
                      sum +
                      (cw.variants?.reduce(
                        (vSum, v) =>
                          vSum +
                          (v.inventories?.reduce(
                            (invSum, inv) => invSum + inv.available,
                            0,
                          ) || 0),
                        0,
                      ) || 0),
                    0,
                  ) || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Brand info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin hãng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {sneaker.brand.logoUrl && (
                  <img
                    src={sneaker.brand.logoUrl}
                    alt={sneaker.brand.name}
                    className="h-12 w-12 object-contain rounded-lg border p-1"
                  />
                )}
                <div>
                  <p className="font-medium">{sneaker.brand.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {sneaker.brand.slug}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SneakerViewDetail;
