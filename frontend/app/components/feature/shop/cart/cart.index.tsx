import { useState } from "react";
import { Link } from "react-router";
import { ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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
import { useCart, useClearCart } from "~/hooks/react-query/use-cart.query";
import CartList from "./cart.list";
import CartSummary from "./cart.summary";
import CartSkeleton from "./cart.skeleton";
import CartEmpty from "./cart.empty";
import Pagination from "~/components/common/shared/pagination";

const CartIndex = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const { data: cartData, isLoading, error } = useCart(pageNumber, pageSize);
  const clearCartMutation = useClearCart();

  // Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked && cartData?.items) {
      const availableItemIds = cartData.items
        .filter((item) => item.isAvailable)
        .map((item) => item.cartItemId);
      setSelectedItems(availableItemIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (cartItemId: number, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, cartItemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== cartItemId));
    }
  };

  const handleClearCart = () => {
    clearCartMutation.mutate();
    setSelectedItems([]);
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageNumber(1);
  };

  // Calculate selected items summary
  const getSelectedItemsSummary = () => {
    if (!cartData?.items) return { count: 0, total: 0 };

    const selectedCartItems = cartData.items.filter((item) =>
      selectedItems.includes(item.cartItemId),
    );

    return {
      count: selectedCartItems.reduce((sum, item) => sum + item.quantity, 0),
      total: selectedCartItems.reduce((sum, item) => sum + item.lineTotal, 0),
    };
  };

  // Check if all available items on current page are selected
  const isAllSelected = () => {
    if (!cartData?.items || cartData.items.length === 0) return false;
    const availableItems = cartData.items.filter((item) => item.isAvailable);
    if (availableItems.length === 0) return false;
    return availableItems.every((item) =>
      selectedItems.includes(item.cartItemId),
    );
  };

  // Loading state
  if (isLoading) {
    return <CartSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">
            Đã xảy ra lỗi khi tải giỏ hàng
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cartData || cartData.totalItems === 0) {
    return <CartEmpty />;
  }

  const selectedSummary = getSelectedItemsSummary();

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-7 w-7 text-primary" />
              Giỏ hàng của bạn
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {cartData.totalQuantity} sản phẩm trong giỏ hàng
            </p>
          </div>
        </div>

        {/* Clear cart button */}
        {cartData.totalItems > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tất cả
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xóa toàn bộ giỏ hàng?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa tất cả {cartData.totalQuantity} sản
                  phẩm khỏi giỏ hàng? Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearCart}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Xóa tất cả
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Select All */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Checkbox
              id="select-all"
              checked={isAllSelected()}
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium cursor-pointer select-none"
            >
              Chọn tất cả sản phẩm có sẵn (
              {cartData.items.filter((i) => i.isAvailable).length})
            </label>
          </div>

          {/* Cart Items */}
          <CartList
            items={cartData.items}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
          />

          {/* Pagination */}
          {cartData.totalPages > 1 && (
            <Pagination
              currentPage={pageNumber}
              totalPages={cartData.totalPages}
              totalItems={cartData.totalItems}
              pageSize={pageSize}
              hasPreviousPage={cartData.hasPreviousPage}
              hasNextPage={cartData.hasNextPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary
            subTotal={cartData.subTotal}
            totalQuantity={cartData.totalQuantity}
            selectedCount={selectedSummary.count}
            selectedTotal={selectedSummary.total}
            selectedItems={selectedItems}
            cartItems={cartData.items}
          />
        </div>
      </div>
    </div>
  );
};

export default CartIndex;
