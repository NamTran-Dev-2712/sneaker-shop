import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  FolderOpen,
  Tag,
  Calendar,
  Clock,
  Image,
  CheckCircle,
  XCircle,
  DollarSign,
  Warehouse,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import type { GetAccessoryDetailResponse } from "~/services/shop/accessory/dto/get-accessory/get-accessory.response";

interface AccessoryViewDetailProps {
  accessory: GetAccessoryDetailResponse | undefined;
  isLoading: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const AccessoryViewDetail = ({
  accessory,
  isLoading,
  onEdit,
  onDelete,
}: AccessoryViewDetailProps) => {
  const navigate = useNavigate();

  // Format price
  const formatPrice = (price?: number) => {
    if (!price) return "—";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Image Skeleton */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="aspect-square w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>

          {/* Info Skeleton */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!accessory) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Không tìm thấy phụ kiện</h2>
        <p className="text-muted-foreground mb-4">
          Phụ kiện này có thể đã bị xóa hoặc không tồn tại
        </p>
        <Button onClick={() => navigate("/admin/accessories")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/accessories")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {accessory.name}
            </h1>
            <Badge variant="outline" className="font-mono text-xs mt-1">
              {accessory.slug}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Image & Gallery */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Hình ảnh chính
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                <img
                  src={accessory.mainImage}
                  alt={accessory.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-product.png";
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Gallery */}
          {accessory.images && accessory.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Bộ sưu tập ({accessory.images.length} ảnh)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {accessory.images.map((image) => (
                    <div
                      key={image.id}
                      className="aspect-square overflow-hidden rounded-lg border bg-muted"
                    >
                      <img
                        src={image.imageUrl}
                        alt={`${accessory.name} - ${image.id}`}
                        className="h-full w-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-product.png";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {accessory.description && (
            <Card>
              <CardHeader>
                <CardTitle>Mô tả</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {accessory.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-4">
          {/* Category & Brand */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin phân loại</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FolderOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Danh mục</p>
                  <p className="font-medium">{accessory.category.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hãng</p>
                  <p className="font-medium">{accessory.brand.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Thông tin giá
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Giá cơ bản</span>
                  <span className="font-semibold text-lg">
                    {formatPrice(accessory.basePrice)}
                  </span>
                </div>
              </div>

              {accessory.sellableItem && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">SKU</span>
                      <Badge variant="outline" className="font-mono">
                        {accessory.sellableItem.sku}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Giá bán lẻ</span>
                      <span className="font-medium">
                        {formatPrice(accessory.sellableItem.retailPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Giá online</span>
                      <span className="font-medium text-primary">
                        {formatPrice(accessory.sellableItem.onlinePrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Trạng thái</span>
                      <Badge
                        variant={
                          accessory.sellableItem.isActive
                            ? "success"
                            : "secondary"
                        }
                      >
                        {accessory.sellableItem.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Hoạt động
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Tạm ngưng
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5" />
                Thông tin tồn kho
              </CardTitle>
            </CardHeader>
            <CardContent>
              {accessory.sellableItem?.inventories &&
              accessory.sellableItem.inventories.length > 0 ? (
                <div className="space-y-3">
                  {accessory.sellableItem.inventories.map((inv) => (
                    <div
                      key={inv.storeId}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{inv.storeName}</span>
                        <Badge
                          variant={
                            inv.available > 0 ? "success" : "destructive"
                          }
                        >
                          {inv.available}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {inv.storeAddress}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Tồn kho: {inv.onHand}</span>
                        <span className="text-orange-500">
                          Đã đặt: {inv.reserved}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Chưa có thông tin tồn kho
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sản phẩm chưa được nhập kho
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin thời gian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Ngày tạo:</span>
                <span className="font-medium">
                  {formatDate(accessory.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Cập nhật:</span>
                <span className="font-medium">
                  {formatDate(accessory.updatedAt)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccessoryViewDetail;
