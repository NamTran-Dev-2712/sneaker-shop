import type { CartItemDto } from "~/services/shop/cart/dto/get-cart/get-cart.response";
import CartItem from "./cart.item";

interface CartListProps {
  items: CartItemDto[];
  selectedItems: number[];
  onSelectItem: (cartItemId: number, checked: boolean) => void;
}

const CartList = ({ items, selectedItems, onSelectItem }: CartListProps) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.cartItemId}
          item={item}
          isSelected={selectedItems.includes(item.cartItemId)}
          onSelect={(checked) => onSelectItem(item.cartItemId, checked)}
        />
      ))}
    </div>
  );
};

export default CartList;
