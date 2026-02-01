import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

// Mock reviews data - will be replaced with API data later
const mockReviews = [
  {
    id: 1,
    customerName: "Nguyễn Văn An",
    customerAvatar: "",
    rating: 5,
    comment:
      "Giày chất lượng tuyệt vời, đóng gói cẩn thận. Giao hàng nhanh và đúng hẹn. Rất hài lòng với dịch vụ của shop!",
    productName: "Nike Air Max 90",
    date: "2024-01-15",
  },
  {
    id: 2,
    customerName: "Trần Thị Bình",
    customerAvatar: "",
    rating: 5,
    comment:
      "Đây là lần thứ 3 mình mua giày ở đây. Sản phẩm luôn chính hãng, giá cả hợp lý. Nhân viên tư vấn nhiệt tình.",
    productName: "Adidas Ultraboost",
    date: "2024-01-10",
  },
  {
    id: 3,
    customerName: "Lê Minh Cường",
    customerAvatar: "",
    rating: 4,
    comment:
      "Sản phẩm đẹp đúng như hình. Giao hàng hơi chậm một chút nhưng nhìn chung vẫn rất ổn.",
    productName: "Converse Chuck Taylor",
    date: "2024-01-08",
  },
  {
    id: 4,
    customerName: "Phạm Thị Dung",
    customerAvatar: "",
    rating: 5,
    comment:
      "Giày nhẹ, êm chân, rất phù hợp để chạy bộ. Definitely sẽ quay lại mua thêm!",
    productName: "New Balance 990",
    date: "2024-01-05",
  },
];

export const ReviewsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hàng ngàn khách hàng đã tin tưởng và hài lòng với dịch vụ của
            Sneaker Shop
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockReviews.map((review) => (
            <Card
              key={review.id}
              className="border-0 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              <CardContent className="p-6">
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-primary/20 mb-4" />

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-4 w-4",
                        star <= review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300",
                      )}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                  "{review.comment}"
                </p>

                {/* Product */}
                <p className="text-xs text-primary font-medium mb-4">
                  {review.productName}
                </p>

                {/* Customer */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.customerAvatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {review.customerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{review.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.date).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">10K+</p>
            <p className="text-muted-foreground">Khách hàng</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">4.9</p>
            <p className="text-muted-foreground">Đánh giá trung bình</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">99%</p>
            <p className="text-muted-foreground">Hài lòng</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">500+</p>
            <p className="text-muted-foreground">Sản phẩm</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
