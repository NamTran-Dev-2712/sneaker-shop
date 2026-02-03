import { Link } from "react-router";
import { ShoppingBag, CreditCard, Truck, Shield, Tag } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import { formatCurrency } from "~/common/helpers/format-currency.helper";
import type { CartItemDto } from "~/services/shop/cart/dto/get-cart/get-cart.response";

interface CartSummaryProps {
  subTotal: number;
  totalQuantity: number;
  selectedCount: number;
  selectedTotal: number;
  selectedItems: number[];
  cartItems: CartItemDto[];
}

const CartSummary = ({
  subTotal,
  totalQuantity,
  selectedCount,
  selectedTotal,
  selectedItems,
  cartItems,
}: CartSummaryProps) => {
  const hasSelectedItems = selectedItems.length > 0;
  const displayTotal = hasSelectedItems ? selectedTotal : subTotal;
  const displayCount = hasSelectedItems ? selectedCount : totalQuantity;

  // Giả định phí ship miễn phí trên 500k
  const shippingFee = displayTotal >= 500000 ? 0 : 30000;
  const freeShippingThreshold = 500000;
  const remainingForFreeShipping = freeShippingThreshold - displayTotal;

  return (
    <div className="lg:sticky lg:top-24 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Tóm tắt đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Items Info */}
          {hasSelectedItems && (
            <div className="p-3 bg-primary/5 rounded-lg">
              <p className="text-sm font-medium text-primary">
                Đã chọn {selectedItems.length} sản phẩm ({selectedCount} số
                lượng)
              </p>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Tạm tính ({displayCount} sản phẩm)
              </span>
              <span className="font-medium">
                {formatCurrency(displayTotal)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phí vận chuyển</span>
              {shippingFee === 0 ? (
                <Badge variant="secondary" className="text-xs">
                  Miễn phí
                </Badge>
              ) : (
                <span className="font-medium">
                  {formatCurrency(shippingFee)}
                </span>
              )}
            </div>

            {/* Free Shipping Progress */}
            {remainingForFreeShipping > 0 && displayTotal > 0 && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Truck className="h-3 w-3" />
                  <span>
                    Mua thêm{" "}
                    <span className="font-semibold text-primary">
                      {formatCurrency(remainingForFreeShipping)}
                    </span>{" "}
                    để được miễn phí vận chuyển
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{
                      width: `${Math.min((displayTotal / freeShippingThreshold) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {shippingFee === 0 && displayTotal > 0 && (
              <div className="flex items-center gap-2 p-2 bg-green-50 text-green-700 rounded-lg text-xs">
                <Truck className="h-4 w-4" />
                <span>Bạn được miễn phí vận chuyển!</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="font-semibold">Tổng cộng</span>
            <div className="text-right">
              <p className="text-xl font-bold text-primary">
                {formatCurrency(displayTotal + shippingFee)}
              </p>
              <p className="text-xs text-muted-foreground">(Đã bao gồm VAT)</p>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            className="w-full"
            size="lg"
            disabled={!hasSelectedItems}
            asChild={hasSelectedItems}
          >
            {hasSelectedItems ? (
              <Link to="/checkout" state={{ selectedItems, cartItems }}>
                <CreditCard className="h-4 w-4 mr-2" />
                Tiến hành thanh toán
              </Link>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Chọn sản phẩm để thanh toán
              </>
            )}
          </Button>

          {/* Continue Shopping */}
          <Button variant="outline" className="w-full" asChild>
            <Link to="/sneakers">Tiếp tục mua sắm</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Trust Badges */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Bảo hành chính hãng</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Giao hàng toàn quốc</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Tag className="h-4 w-4 text-orange-600" />
              <span>Giá tốt nhất</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CreditCard className="h-4 w-4 text-purple-600" />
              <span>Thanh toán an toàn</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartSummary;
