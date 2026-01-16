import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { CreateSneakerFormData } from "~/lib/validation/admin/shop/sneaker.schema";
import { useAllSizes } from "~/hooks/react-query/use-size.query";
import { useCallback, useState, useEffect } from "react";

interface VariantItemProps {
  form: UseFormReturn<CreateSneakerFormData>;
  colorwayIndex: number;
  variantIndex: number;
  onRemove: () => void;
  canRemove: boolean;
}

/**
 * Format number as VND currency string (e.g., 1,500,000)
 */
const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return "";
  return new Intl.NumberFormat("vi-VN").format(value);
};

/**
 * Parse currency string to number (remove commas/dots)
 */
const parseCurrency = (value: string): number | undefined => {
  if (!value || value.trim() === "") return undefined;
  // Remove all non-digit characters except decimal point
  const cleanValue = value.replace(/[^\d]/g, "");
  const parsed = parseInt(cleanValue, 10);
  return isNaN(parsed) ? undefined : parsed;
};

export const VariantItem = ({
  form,
  colorwayIndex,
  variantIndex,
  onRemove,
  canRemove,
}: VariantItemProps) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  // Lấy danh sách sizes (không phân trang)
  const { data: sizesData } = useAllSizes();

  const variantErrors =
    errors.colorways?.[colorwayIndex]?.variants?.[variantIndex];
  const selectedSizeId = watch(
    `colorways.${colorwayIndex}.variants.${variantIndex}.sizeId`,
  );

  // Watch actual values from form
  const retailPriceValue = watch(
    `colorways.${colorwayIndex}.variants.${variantIndex}.retailPrice`,
  );
  const onlinePriceValue = watch(
    `colorways.${colorwayIndex}.variants.${variantIndex}.onlinePrice`,
  );

  // Local state for formatted display
  const [retailPriceDisplay, setRetailPriceDisplay] = useState("");
  const [onlinePriceDisplay, setOnlinePriceDisplay] = useState("");

  // Sync display with form values on mount/change
  useEffect(() => {
    setRetailPriceDisplay(formatCurrency(retailPriceValue));
  }, [retailPriceValue]);

  useEffect(() => {
    setOnlinePriceDisplay(formatCurrency(onlinePriceValue));
  }, [onlinePriceValue]);

  // Handle retail price change
  const handleRetailPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const numericValue = parseCurrency(inputValue);

      // Update form value
      setValue(
        `colorways.${colorwayIndex}.variants.${variantIndex}.retailPrice`,
        numericValue,
        { shouldValidate: true },
      );

      // Update display
      if (numericValue !== undefined) {
        setRetailPriceDisplay(formatCurrency(numericValue));
      } else {
        setRetailPriceDisplay("");
      }
    },
    [setValue, colorwayIndex, variantIndex],
  );

  // Handle online price change
  const handleOnlinePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const numericValue = parseCurrency(inputValue);

      // Update form value
      setValue(
        `colorways.${colorwayIndex}.variants.${variantIndex}.onlinePrice`,
        numericValue,
        { shouldValidate: true },
      );

      // Update display
      if (numericValue !== undefined) {
        setOnlinePriceDisplay(formatCurrency(numericValue));
      } else {
        setOnlinePriceDisplay("");
      }
    },
    [setValue, colorwayIndex, variantIndex],
  );

  // Group sizes by system
  const groupedSizes = sizesData?.reduce(
    (acc, size) => {
      if (!acc[size.system]) {
        acc[size.system] = [];
      }
      acc[size.system].push(size);
      return acc;
    },
    {} as Record<string, typeof sizesData>,
  );

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
      {/* Size select */}
      <div className="flex-1 space-y-1">
        <Select
          value={selectedSizeId?.toString() || ""}
          onValueChange={(value) => {
            setValue(
              `colorways.${colorwayIndex}.variants.${variantIndex}.sizeId`,
              parseInt(value),
              { shouldValidate: true },
            );
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn size" />
          </SelectTrigger>
          <SelectContent>
            {groupedSizes &&
              Object.entries(groupedSizes).map(([system, sizes]) => (
                <div key={system}>
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {system}
                  </div>
                  {sizes?.map((size) => (
                    <SelectItem key={size.id} value={size.id.toString()}>
                      {size.system} {size.value}
                    </SelectItem>
                  ))}
                </div>
              ))}
          </SelectContent>
        </Select>
        {variantErrors?.sizeId && (
          <p className="text-xs text-destructive">
            {variantErrors.sizeId.message}
          </p>
        )}
      </div>

      {/* Retail price */}
      <div className="w-36 space-y-1">
        <div className="relative">
          <Input
            type="text"
            inputMode="numeric"
            placeholder="Giá bán lẻ"
            value={retailPriceDisplay}
            onChange={handleRetailPriceChange}
            className="pr-8"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            đ
          </span>
        </div>
        {variantErrors?.retailPrice && (
          <p className="text-xs text-destructive">
            {variantErrors.retailPrice.message}
          </p>
        )}
      </div>

      {/* Online price */}
      <div className="w-36 space-y-1">
        <div className="relative">
          <Input
            type="text"
            inputMode="numeric"
            placeholder="Giá online"
            value={onlinePriceDisplay}
            onChange={handleOnlinePriceChange}
            className="pr-8"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            đ
          </span>
        </div>
        {variantErrors?.onlinePrice && (
          <p className="text-xs text-destructive">
            {variantErrors.onlinePrice.message}
          </p>
        )}
      </div>

      {/* Remove button */}
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-destructive hover:text-destructive shrink-0"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default VariantItem;
