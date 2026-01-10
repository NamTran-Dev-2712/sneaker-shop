import { ShoppingCart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Link } from "react-router";

interface CartButtonProps {
  itemCount?: number;
}

const CartButton = ({ itemCount = 0 }: CartButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      className="relative hover:bg-primary/10 transition-colors"
    >
      <Link to="/cart">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full p-0 flex items-center justify-center text-xs border-2 border-white bg-primary hover:bg-primary">
            {itemCount > 99 ? "99+" : itemCount}
          </Badge>
        )}
        <span className="sr-only">Giỏ hàng ({itemCount})</span>
      </Link>
    </Button>
  );
};

export default CartButton;
