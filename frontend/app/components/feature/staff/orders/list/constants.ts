export const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "PLACED", label: "Đã đặt" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "PAID", label: "Đã thanh toán" },
  { value: "PACKED", label: "Đã đóng gói" },
  { value: "SHIPPED", label: "Đang giao" },
  { value: "DELIVERED", label: "Đã giao" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export const PAYMENT_STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả thanh toán" },
  { value: "PENDING", label: "Chờ thanh toán" },
  { value: "PAID", label: "Đã thanh toán" },
  { value: "FAILED", label: "Thất bại" },
  { value: "REFUNDED", label: "Hoàn tiền" },
];

export const FULFILLMENT_OPTIONS = [
  { value: "ALL", label: "Tất cả hình thức" },
  { value: "DELIVERY", label: "Giao hàng" },
  { value: "PICKUP", label: "Nhận tại cửa hàng" },
];

export const STATUS_CLASS: Record<string, string> = {
  PLACED: "bg-blue-50 text-blue-700 border-blue-500",
  CONFIRMED: "bg-indigo-50 text-indigo-700 border-indigo-500",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-500",
  PACKED: "bg-purple-50 text-purple-700 border-purple-500",
  SHIPPED: "bg-orange-50 text-orange-700 border-orange-500",
  DELIVERED: "bg-green-50 text-green-700 border-green-500",
  CANCELLED: "bg-red-50 text-red-700 border-red-500",
};
