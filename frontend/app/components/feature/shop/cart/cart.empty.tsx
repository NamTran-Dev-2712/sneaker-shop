import { Link } from "react-router";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

const CartEmpty = () => {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      <Card className="max-w-lg mx-auto">
        <CardContent className="p-8 text-center">
          {/* Icon */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-2">Giỏ hàng trống</h1>

          {/* Description */}
          <p className="text-muted-foreground mb-6">
            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm
            tuyệt vời của chúng tôi!
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/sneakers">
                Xem giày
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/accessories">Xem phụ kiện</Link>
            </Button>
          </div>

          {/* Suggestions */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Có thể bạn quan tâm:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="secondary" size="sm" asChild>
                <Link to="/sneakers?sortBy=newest">Hàng mới về</Link>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link to="/sneakers?sortBy=bestseller">Bán chạy nhất</Link>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link to="/sneakers?onSale=true">Đang giảm giá</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartEmpty;
