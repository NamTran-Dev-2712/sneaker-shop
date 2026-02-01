import { cn } from "~/lib/utils";
import type { GetSneakerDetailVariantDto } from "~/services/shop/sneaker/dto/get-sneaker/get-sneaker.response";
import { SneakerSizeGuide, SYSTEM_COLORS } from "./sneaker-size-guide";
import { Badge } from "~/components/ui/badge";

interface SneakerSizeSelectorProps {
  variants: GetSneakerDetailVariantDto[];
  selectedSizeId: number | null;
  onSizeChange: (sizeId: number) => void;
}

export const SneakerSizeSelector = ({
  variants,
  selectedSizeId,
  onSizeChange,
}: SneakerSizeSelectorProps) => {
  if (!variants || variants.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Kích cỡ</div>
          <SneakerSizeGuide />
        </div>
        <p className="text-sm text-muted-foreground">
          Vui lòng chọn màu sắc trước
        </p>
      </div>
    );
  }

  const selectedVariant = variants.find((v) => v.size.id === selectedSizeId);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">
          Kích cỡ:{" "}
          {selectedVariant && (
            <span className="font-normal text-muted-foreground">
              {selectedVariant.size.value} ({selectedVariant.size.system})
            </span>
          )}
        </div>
        <SneakerSizeGuide />
      </div>

      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = selectedSizeId === variant.size.id;
          const isAvailable =
            variant.inventory && variant.inventory.available > 0;
          const stockQuantity = variant.inventory?.available || 0;
          const systemColor =
            SYSTEM_COLORS[variant.size.system] ||
            "bg-gray-100 text-gray-800 border-gray-200";

          return (
            <button
              key={variant.id}
              className={cn(
                "relative flex flex-col items-center justify-center min-w-[70px] p-2 rounded-lg border transition-all duration-200 group",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : isAvailable
                    ? "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                    : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed",
              )}
              onClick={() => isAvailable && onSizeChange(variant.size.id)}
              disabled={!isAvailable}
            >
              <div className="flex items-center gap-1 mb-1">
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-[4px] font-semibold border",
                    isSelected
                      ? "bg-primary text-primary-foreground border-transparent"
                      : systemColor,
                  )}
                >
                  {variant.size.system}
                </span>
              </div>

              <span
                className={cn(
                  "font-bold text-lg leading-none",
                  isSelected ? "text-primary" : "text-gray-900",
                  !isAvailable && "text-gray-400",
                )}
              >
                {variant.size.value}
              </span>

              {/* Low stock indicator */}
              {isAvailable && stockQuantity <= 5 && stockQuantity > 0 && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-orange-500 rounded-full border-2 border-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Stock info for selected size */}
      {selectedVariant && selectedVariant.inventory && (
        <p
          className={cn(
            "text-sm",
            selectedVariant.inventory.available <= 5
              ? "text-orange-600 font-medium"
              : "text-muted-foreground",
          )}
        >
          {selectedVariant.inventory.available <= 5 ? (
            <>⚠️ Chỉ còn {selectedVariant.inventory.available} sản phẩm</>
          ) : (
            <>Còn {selectedVariant.inventory.available} sản phẩm</>
          )}
        </p>
      )}
    </div>
  );
};

export default SneakerSizeSelector;
