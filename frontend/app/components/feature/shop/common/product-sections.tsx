import { Star, MessageSquare, ThumbsUp, User, CheckCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

interface ProductDescriptionSectionProps {
  description?: string;
}

export const ProductDescriptionSection = ({
  description,
}: ProductDescriptionSectionProps) => {
  return (
    <section className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Mô tả sản phẩm
        </h2>
      </div>
      <div className="p-6">
        {description ? (
          <div
            className="prose prose-gray max-w-none 
              prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:mt-6 prose-headings:mb-3
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
              prose-li:text-gray-600 prose-li:my-1
              prose-strong:text-gray-900
              prose-a:text-primary hover:prose-a:text-primary/80
              prose-ul:my-4 prose-ol:my-4"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Chưa có mô tả cho sản phẩm này.</p>
          </div>
        )}
      </div>
    </section>
  );
};

interface ProductReviewSectionProps {
  reviewCount?: number;
  averageRating?: number;
}

export const ProductReviewSection = ({
  reviewCount = 0,
  averageRating = 0,
}: ProductReviewSectionProps) => {
  return (
    <section className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Đánh giá sản phẩm
          {reviewCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {reviewCount} đánh giá
            </Badge>
          )}
        </h2>
      </div>
      <div className="p-6">
        {reviewCount > 0 ? (
          <ReviewContent
            averageRating={averageRating}
            reviewCount={reviewCount}
          />
        ) : (
          <EmptyReviews />
        )}
      </div>
    </section>
  );
};

const EmptyReviews = () => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-50 to-orange-50 mb-6">
      <Star className="h-10 w-10 text-yellow-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Chưa có đánh giá nào
    </h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">
      Hãy là người đầu tiên đánh giá sản phẩm này và chia sẻ trải nghiệm của bạn
      với cộng đồng.
    </p>
    <Button className="bg-yellow-500 hover:bg-yellow-600">
      <Star className="h-4 w-4 mr-2" />
      Viết đánh giá đầu tiên
    </Button>
  </div>
);

interface ReviewContentProps {
  averageRating: number;
  reviewCount: number;
}

const ReviewContent = ({ averageRating, reviewCount }: ReviewContentProps) => (
  <div className="space-y-8">
    {/* Review Summary */}
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
      {/* Average Rating */}
      <div className="text-center lg:text-left lg:pr-8 lg:border-r lg:border-yellow-200">
        <div className="text-5xl font-bold text-gray-900">
          {averageRating.toFixed(1)}
        </div>
        <div className="flex items-center justify-center lg:justify-start gap-1 my-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "h-6 w-6",
                star <= Math.round(averageRating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300",
              )}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600">Dựa trên {reviewCount} đánh giá</p>
      </div>

      {/* Rating Breakdown */}
      <div className="flex-1 space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const percentage =
            rating === 5
              ? 60
              : rating === 4
                ? 25
                : rating === 3
                  ? 10
                  : rating === 2
                    ? 3
                    : 2;
          return (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 w-4">
                {rating}
              </span>
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <div className="flex-1 h-3 bg-white rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>

    {/* Review List */}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Đánh giá từ khách hàng</h3>
        <select className="text-sm border rounded-lg px-3 py-2 bg-white">
          <option>Mới nhất</option>
          <option>Cao nhất</option>
          <option>Thấp nhất</option>
        </select>
      </div>

      {/* Sample Reviews */}
      <ReviewItem
        author="Nguyễn Văn A"
        rating={5}
        date="15/01/2026"
        content="Sản phẩm rất đẹp, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ shop!"
        helpful={12}
        verified
      />
      <ReviewItem
        author="Trần Thị B"
        rating={4}
        date="10/01/2026"
        content="Chất lượng tốt so với giá tiền. Giao hàng hơi chậm nhưng đóng gói cẩn thận."
        helpful={8}
        verified
      />
    </div>

    {/* Load More */}
    <div className="text-center pt-4">
      <Button variant="outline" className="min-w-[200px]">
        Xem thêm đánh giá
      </Button>
    </div>
  </div>
);

interface ReviewItemProps {
  author: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
  verified?: boolean;
}

const ReviewItem = ({
  author,
  rating,
  date,
  content,
  helpful,
  verified,
}: ReviewItemProps) => (
  <div className="border rounded-xl p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
        <User className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{author}</h4>
              {verified && (
                <Badge
                  variant="outline"
                  className="text-xs text-green-600 border-green-200 bg-green-50"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Đã mua hàng
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-4 w-4",
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">{date}</span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-gray-600 leading-relaxed">{content}</p>
        <div className="mt-4 flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
            <ThumbsUp className="h-4 w-4" />
            Hữu ích ({helpful})
          </button>
          <button className="text-sm text-gray-500 hover:text-primary transition-colors">
            Trả lời
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ProductDescriptionSection;
