import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import VerifyLayout from "../verify-layout";
import SuccessIcon from "../success-icon";

const VerifySuccess = () => {
  return (
    <VerifyLayout>
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <SuccessIcon />

        {/* Heading */}
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Xác thực thành công!
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Tài khoản của bạn đã được xác thực thành công
          </p>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Mail className="h-5 w-5 text-green-600 mt-0.5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-green-800">
                Email đã được xác thực
              </p>
              <p className="text-sm text-green-700 mt-1">
                Bạn có thể đăng nhập và bắt đầu mua sắm ngay bây giờ. Chúng tôi
                rất vui được chào đón bạn đến với cộng đồng Sneaker Shop!
              </p>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <div className="bg-gray-50 rounded-lg p-3 text-left">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-sm font-medium text-gray-900">
                Truy cập đầy đủ
              </p>
            </div>
            <p className="text-xs text-gray-600">Khám phá toàn bộ sản phẩm</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-left">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-sm font-medium text-gray-900">
                Ưu đãi đặc biệt
              </p>
            </div>
            <p className="text-xs text-gray-600">
              Nhận thông báo về khuyến mãi
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button asChild className="w-full group" size="lg">
            <Link to="/login">
              Đăng nhập ngay
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full" size="lg">
            <Link to="/">Về trang chủ</Link>
          </Button>
        </div>
      </div>
    </VerifyLayout>
  );
};

export default VerifySuccess;
