import { Check } from "lucide-react";
import { cn } from "~/lib/utils";
import type { GetSneakerDetailColorwayDto } from "~/services/shop/sneaker/dto/get-sneaker/get-sneaker.response";

interface SneakerColorSelectorProps {
  colorways: GetSneakerDetailColorwayDto[];
  selectedColorwayId: number | null;
  onColorwayChange: (colorwayId: number) => void;
}

export const SneakerColorSelector = ({
  colorways,
  selectedColorwayId,
  onColorwayChange,
}: SneakerColorSelectorProps) => {
  const selectedColorway = colorways.find((c) => c.id === selectedColorwayId);

  if (!colorways || colorways.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="font-semibold">
        Màu sắc:{" "}
        <span className="font-normal text-muted-foreground">
          {selectedColorway?.color?.name || "Chọn màu"}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {colorways.map((colorway) => {
          const isSelected = selectedColorwayId === colorway.id;
          const hasStock = colorway.variants?.some((v) =>
            v.inventories?.some((inv) => inv.available > 0),
          );

          return (
            <button
              key={colorway.id}
              className={cn(
                "relative h-14 w-14 rounded-lg overflow-hidden border-2 transition-all duration-200",
                isSelected
                  ? "border-primary ring-2 ring-primary/30"
                  : hasStock
                    ? "border-gray-200 hover:border-gray-400"
                    : "border-gray-200 opacity-50 cursor-not-allowed",
              )}
              onClick={() => hasStock && onColorwayChange(colorway.id)}
              disabled={!hasStock}
              title={colorway.color?.name}
            >
              <img
                src={colorway.coverImage}
                alt={colorway.color?.name || "Color"}
                className="w-full h-full object-cover"
              />
              {isSelected && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
              )}
              {!hasStock && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <span className="text-xs text-gray-500">Hết</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SneakerColorSelector;
