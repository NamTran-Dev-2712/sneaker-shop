export const STATUS_CLASS: Record<string, string> = {
  PLACED: "bg-blue-50 text-blue-700 border-blue-500",
  CONFIRMED: "bg-indigo-50 text-indigo-700 border-indigo-500",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-500",
  PACKED: "bg-purple-50 text-purple-700 border-purple-500",
  SHIPPED: "bg-orange-50 text-orange-700 border-orange-500",
  DELIVERED: "bg-green-50 text-green-700 border-green-500",
  CANCELLED: "bg-red-50 text-red-700 border-red-500",
};

export type StaffOrderAction = {
  key: string;
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline";
};
