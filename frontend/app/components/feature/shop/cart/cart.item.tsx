import { useState } from "react";
import { Link } from "react-router";
import { Minus, Plus, Trash2, AlertCircle, Store } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { formatCurrency } from "~/common/helpers/format-currency.helper";
import type { CartItemDto } from "~/services/shop/cart/dto/get-cart/get-cart.response";
import {
  useUpdateCartItem,
  useRemoveCartItem,
} from "~/hooks/react-query/use-cart.query";

interface CartItemProps {
  item: CartItemDto;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
}

const CartItem = ({ item, isSelected, onSelect }: CartItemProps) => {
  const [selectedInventoryId, setSelectedInventoryId] = useState(
    item.inventoryId,
  );
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.totalAvailableAcrossStores)
      return;

    updateMutation.mutate({
      cartItemId: item.cartItemId,
      request: {
        cartItemId: item.cartItemId,
        quantity: newQuantity,
        inventoryId: selectedInventoryId,
      },
    });
  };

  const handleInventoryChange = (inventoryId: string) => {
    const newInventoryId = parseInt(inventoryId);
    setSelectedInventoryId(newInventoryId);

    updateMutation.mutate({
      cartItemId: item.cartItemId,
      request: {
        cartItemId: item.cartItemId,
        quantity: item.quantity,
        inventoryId: newInventoryId,
      },
    });
  };

  const handleRemove = () => {
    removeMutation.mutate(item.cartItemId);
  };

  const productUrl =
    item.productType === "SNEAKER_VARIANT"
      ? `/sneakers/${item.productSlug}`
      : `/accessories/${item.productSlug}`;

  const isUpdating = updateMutation.isPending;
  const isRemoving = removeMutation.isPending;

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        !item.isAvailable && "opacity-75 border-destructive/50",
        isSelected && "ring-2 ring-primary/50",
      )}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Checkbox */}
          <div className="flex items-start pt-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelect}
              disabled={!item.isAvailable}
              className="mt-1"
            />
          </div>

          {/* Product Image */}
          <Link
            to={productUrl}
            className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-muted"
          >
            <img
              src={item.mainImage || "/placeholder-product.png"}
              alt={item.productName}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </Link>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="space-y-1">
                {/* Product Name */}
                <Link
                  to={productUrl}
                  className="font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-2"
                >
                  {item.productName}
                </Link>

                {/* Variant Info */}
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  {item.brandName && (
                    <Badge variant="outline" className="text-xs">
                      {item.brandName}
                    </Badge>
                  )}
                  {item.colorName && (
                    <div className="flex items-center gap-1">
                      {item.colorHex && (
                        <span
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: item.colorHex }}
                        />
                      )}
                      <span>{item.colorName}</span>
                    </div>
                  )}
                  {item.sizeName && <span>Size: {item.sizeName}</span>}
                </div>

                {/* SKU */}
                <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>

                {/* Unavailable Warning */}
                {!item.isAvailable && item.unavailableReason && (
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    <span>{item.unavailableReason}</span>
                  </div>
                )}
              </div>

              {/* Price - Desktop */}
              <div className="hidden sm:block text-right">
                <p className="font-bold text-primary">
                  {formatCurrency(item.lineTotal)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(item.unitPrice)} x {item.quantity}
                </p>
              </div>
            </div>

            {/* Store Selection */}
            {item.availableInventories.length > 1 && (
              <div className="mt-3">
                <Select
                  value={selectedInventoryId.toString()}
                  onValueChange={handleInventoryChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-full sm:w-[200px] h-8 text-xs">
                    <Store className="h-3 w-3 mr-1" />
                    <SelectValue placeholder="Chọn cửa hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {item.availableInventories.map((inv) => (
                      <SelectItem
                        key={inv.inventoryId}
                        value={inv.inventoryId.toString()}
                      >
                        <span className="flex items-center justify-between w-full">
                          <span>{inv.storeName}</span>
                          <span className="text-muted-foreground ml-2">
                            (Còn {inv.available})
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Số lượng:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-r-none"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={item.quantity <= 1 || isUpdating}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-10 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-l-none"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={
                      item.quantity >= item.totalAvailableAcrossStores ||
                      isUpdating
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-muted-foreground">
                        (Còn {item.totalAvailableAcrossStores})
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Số lượng tồn kho tổng các cửa hàng</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Price - Mobile */}
              <div className="sm:hidden">
                <p className="font-bold text-primary">
                  {formatCurrency(item.lineTotal)}
                </p>
              </div>

              {/* Remove Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 w-fit"
                    disabled={isRemoving}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span className="text-xs">Xóa</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xóa sản phẩm?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa "{item.productName}" khỏi giỏ
                      hàng?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRemove}
                      className="bg-destructive text-white"
                    >
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
