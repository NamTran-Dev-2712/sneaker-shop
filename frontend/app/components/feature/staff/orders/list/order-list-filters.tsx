import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  FULFILLMENT_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  STATUS_OPTIONS,
} from "./constants";

interface OrderListFiltersProps {
  searchInput: string;
  status: string;
  paymentStatus: string;
  fulfillmentType: string;
  onSearchInputChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPaymentStatusChange: (value: string) => void;
  onFulfillmentTypeChange: (value: string) => void;
}

const OrderListFilters = ({
  searchInput,
  status,
  paymentStatus,
  fulfillmentType,
  onSearchInputChange,
  onStatusChange,
  onPaymentStatusChange,
  onFulfillmentTypeChange,
}: OrderListFiltersProps) => {
  return (
    <div className="grid gap-3 p-4 md:grid-cols-4">
      <Input
        value={searchInput}
        onChange={(e) => onSearchInputChange(e.target.value)}
        placeholder="Tìm theo mã đơn, tên KH, số điện thoại"
      />

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger>
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={paymentStatus} onValueChange={onPaymentStatusChange}>
        <SelectTrigger>
          <SelectValue placeholder="Thanh toán" />
        </SelectTrigger>
        <SelectContent>
          {PAYMENT_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={fulfillmentType} onValueChange={onFulfillmentTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Hình thức" />
        </SelectTrigger>
        <SelectContent>
          {FULFILLMENT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default OrderListFilters;
