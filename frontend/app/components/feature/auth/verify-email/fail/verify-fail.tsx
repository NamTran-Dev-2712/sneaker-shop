import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { AlertTriangle, Mail, RefreshCw, Home } from "lucide-react";
import VerifyLayout from "../verify-layout";
import FailIcon from "../fail-icon";

const VerifyFail = () => {
  const handleResendEmail = () => {
    // TODO: Implement resend verification email logic
    console.log("Resending verification email...");
  };

  return (
    <VerifyLayout>
      <div className="text-center space-y-6">
        {/* Fail Icon */}
        <FailIcon />

        {/* Heading */}
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Xác thực thất bại
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Không thể xác thực email của bạn
          </p>
        </div>

        {/* Error Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-red-800">
                Liên kết xác thực không hợp lệ
              </p>
              <p className="text-sm text-red-700 mt-1">
                Liên kết xác thực có thể đã hết hạn hoặc đã được sử dụng. Vui
                lòng yêu cầu gửi lại email xác thực mới.
              </p>
            </div>
          </div>
        </div>

        {/* Troubleshooting Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">
            Các nguyên nhân có thể:
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Liên kết đã hết hạn (có hiệu lực trong 24 giờ)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Email đã được xác thực trước đó</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Liên kết bị sao chép không đầy đủ</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={handleResendEmail}
            className="w-full group"
            size="lg"
            variant="default"
          >
            <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
            Gửi lại email xác thực
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline" size="lg">
              <Link to="/login">
                <Mail className="mr-2 h-4 w-4" />
                Đăng nhập
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Trang chủ
              </Link>
            </Button>
          </div>
        </div>

        {/* Support Link */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            Vẫn gặp vấn đề?{" "}
            <Link
              to="/contact"
              className="text-primary font-medium hover:underline"
            >
              Liên hệ hỗ trợ
            </Link>
          </p>
        </div>
      </div>
    </VerifyLayout>
  );
};

export default VerifyFail;
