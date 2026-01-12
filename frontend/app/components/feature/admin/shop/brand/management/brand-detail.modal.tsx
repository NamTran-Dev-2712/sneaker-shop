import { useState } from "react";
import {
  Eye,
  Calendar,
  Package,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ModalLayout } from "~/components/common/modal/modal.layout";
import { DeleteModal } from "~/components/common/modal/modal.delete";
import type {
  GetBrandResponseDetail,
  GetBrandSeries,
} from "~/services/shop/brand/dto/get-brand/get-brand.response";
import { formatDate } from "~/common/helpers/format-date.helper";

interface BrandDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: GetBrandResponseDetail | null;
  onAddSeries: () => void;
  onEditSeries: (series: GetBrandSeries) => void;
  onDeleteSeries: (seriesId: number) => void;
  isDeleting?: boolean;
}

export const BrandDetailModal = ({
  open,
  onOpenChange,
  brand,
  onAddSeries,
  onEditSeries,
  onDeleteSeries,
  isDeleting = false,
}: BrandDetailModalProps) => {
  const [deleteSeriesId, setDeleteSeriesId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!brand) return null;

  const handleDeleteSeries = (seriesId: number) => {
    setDeleteSeriesId(seriesId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSeries = () => {
    if (deleteSeriesId) {
      onDeleteSeries(deleteSeriesId);
      setIsDeleteModalOpen(false);
      setDeleteSeriesId(null);
    }
  };

  const selectedSeries = brand.series.find((s) => s.id === deleteSeriesId);

  return (
    <>
      <ModalLayout
        open={open}
        onOpenChange={onOpenChange}
        title="Chi tiết hãng"
        description="Xem thông tin chi tiết và quản lý các dòng sản phẩm"
        className="max-w-3xl"
      >
        <div className="space-y-6">
          {/* Brand Info */}
          <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <img
              src={brand.logoUrl}
              alt={brand.name}
              className="w-24 h-24 object-contain rounded-lg bg-white p-2 shadow-sm"
            />
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  {brand.name}
                </h3>
                <Badge
                  variant={brand.isActive ? "default" : "secondary"}
                  className="text-sm"
                >
                  {brand.isActive ? (
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                  )}
                  {brand.isActive ? "Hoạt động" : "Tạm ẩn"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Tạo lúc: {formatDate(brand.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Cập nhật: {formatDate(brand.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Series Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-600" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Dòng sản phẩm
                </h4>
                <Badge variant="secondary" className="ml-2">
                  {brand.series.length}
                </Badge>
              </div>
              <Button size="sm" onClick={onAddSeries}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm dòng mới
              </Button>
            </div>

            {brand.series.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">Chưa có dòng sản phẩm nào</p>
                <Button size="sm" variant="outline" onClick={onAddSeries}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm dòng đầu tiên
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
                {brand.series.map((series) => (
                  <div
                    key={series.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-gray-900">
                            {series.name}
                          </h5>
                          <Badge
                            variant={series.isActive ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {series.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Slug: {series.slug}</span>
                          <span>•</span>
                          <span>{series.sneakerCount} sản phẩm</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEditSeries(series)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteSeries(series.id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </div>
        </div>
      </ModalLayout>

      <DeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Xác nhận xóa dòng sản phẩm"
        description={
          selectedSeries
            ? `Bạn có chắc chắn muốn xóa dòng sản phẩm "${selectedSeries.name}"? Hành động này không thể hoàn tác.`
            : ""
        }
        onConfirm={confirmDeleteSeries}
        isLoading={isDeleting}
      />
    </>
  );
};
