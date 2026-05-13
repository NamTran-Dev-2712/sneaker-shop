import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch } from "~/hooks/redux";
import useCheckout from "~/store/checkout/checkout.hook";
import {
  updateShippingInfo,
  setCurrentStep,
} from "~/store/checkout/checkout.slice";
import { useProvinces, useWards } from "~/hooks/react-query/use-address.query";
import { FulfillmentType } from "~/types/entities/order.type";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { MapPin, Truck, Store, ArrowRight } from "lucide-react";

const shippingSchema = z
  .object({
    fulfillmentType: z.nativeEnum(FulfillmentType),
    recipientName: z.string().optional(),
    recipientPhone: z.string().optional(),
    province: z.string().optional(),
    ward: z.string().optional(),
    addressDetail: z.string().optional(),
    note: z
      .string()
      .max(1000, "Ghi chú không được vượt quá 1000 ký tự")
      .optional(),
    pickupStoreId: z.number().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    // Both DELIVERY and PICKUP require recipient name + phone
    if (
      data.fulfillmentType === FulfillmentType.DELIVERY ||
      data.fulfillmentType === FulfillmentType.PICKUP
    ) {
      if (!data.recipientName || data.recipientName.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tên người nhận là bắt buộc",
          path: ["recipientName"],
        });
      }
      if (
        !data.recipientPhone ||
        !/^(\+84|0)\d{9,10}$/.test(data.recipientPhone)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Số điện thoại không hợp lệ",
          path: ["recipientPhone"],
        });
      }
    }

    // DELIVERY additionally requires address fields
    if (data.fulfillmentType === FulfillmentType.DELIVERY) {
      if (!data.province) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tỉnh/thành phố là bắt buộc",
          path: ["province"],
        });
      }
      if (!data.ward) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phường/xã là bắt buộc",
          path: ["ward"],
        });
      }
      if (!data.addressDetail || data.addressDetail.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Địa chỉ chi tiết là bắt buộc",
          path: ["addressDetail"],
        });
      }
    }
  });

type ShippingFormValues = z.infer<typeof shippingSchema>;

const CheckoutShipping = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const checkout = useCheckout();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fulfillmentType: checkout.shippingInfo.fulfillmentType as FulfillmentType,
      recipientName: checkout.shippingInfo.recipientName,
      recipientPhone: checkout.shippingInfo.recipientPhone,
      province: checkout.shippingInfo.province,
      ward: checkout.shippingInfo.ward,
      addressDetail: checkout.shippingInfo.addressDetail,
      note: checkout.shippingInfo.note,
      pickupStoreId: checkout.shippingInfo.pickupStoreId,
    },
  });

  const fulfillmentType = watch("fulfillmentType");
  const selectedProvince = watch("province");

  const { data: provinces, isLoading: loadingProvinces } = useProvinces();
  const { data: wards, isLoading: loadingWards } = useWards(
    selectedProvince || "",
  );

  const onSubmit = (data: ShippingFormValues) => {
    dispatch(
      updateShippingInfo({
        fulfillmentType: data.fulfillmentType,
        recipientName: data.recipientName || "",
        recipientPhone: data.recipientPhone || "",
        province: data.province || "",
        ward: data.ward || "",
        addressDetail: data.addressDetail || "",
        note: data.note || "",
        pickupStoreId: data.pickupStoreId ?? null,
      }),
    );
    dispatch(setCurrentStep(2));
    navigate("/checkout/payment");
  };

  return (
    <div className="max-w-2xl mx-auto my-3 space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1 text-primary font-semibold">
          <MapPin className="h-4 w-4" /> 1. Thông tin giao hàng
        </span>
        <span>→</span>
        <span>2. Thanh toán</span>
        <span>→</span>
        <span>3. Xác nhận</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Fulfillment Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hình thức nhận hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={fulfillmentType}
              onValueChange={(value) =>
                setValue("fulfillmentType", value as FulfillmentType, {
                  shouldValidate: true,
                })
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={FulfillmentType.DELIVERY}
                  id="delivery"
                />
                <Label
                  htmlFor="delivery"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Truck className="h-4 w-4" /> Giao tận nhà
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={FulfillmentType.PICKUP} id="pickup" />
                <Label
                  htmlFor="pickup"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Store className="h-4 w-4" /> Nhận tại cửa hàng
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Delivery Form */}
        {fulfillmentType === FulfillmentType.DELIVERY && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin người nhận</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">
                    Tên người nhận <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="recipientName"
                    placeholder="Nguyễn Văn A"
                    {...register("recipientName")}
                  />
                  {errors.recipientName && (
                    <p className="text-sm text-destructive">
                      {errors.recipientName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipientPhone">
                    Số điện thoại <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="recipientPhone"
                    placeholder="0901234567"
                    {...register("recipientPhone")}
                  />
                  {errors.recipientPhone && (
                    <p className="text-sm text-destructive">
                      {errors.recipientPhone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Tỉnh/Thành phố <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={selectedProvince}
                    onValueChange={(value) => {
                      setValue("province", value, { shouldValidate: true });
                      setValue("ward", "", { shouldValidate: false });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingProvinces
                            ? "Đang tải..."
                            : "Chọn tỉnh/thành phố"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces?.map((province) => (
                        <SelectItem key={province.id} value={province.name}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.province && (
                    <p className="text-sm text-destructive">
                      {errors.province.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>
                    Phường/Xã <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={watch("ward")}
                    onValueChange={(value) =>
                      setValue("ward", value, { shouldValidate: true })
                    }
                    disabled={!selectedProvince || loadingWards}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingWards
                            ? "Đang tải..."
                            : !selectedProvince
                              ? "Chọn tỉnh trước"
                              : "Chọn phường/xã"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {wards?.map((ward) => (
                        <SelectItem key={ward.name} value={ward.name}>
                          {ward.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ward && (
                    <p className="text-sm text-destructive">
                      {errors.ward.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressDetail">
                  Địa chỉ chi tiết <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="addressDetail"
                  placeholder="Số nhà, tên đường..."
                  {...register("addressDetail")}
                />
                {errors.addressDetail && (
                  <p className="text-sm text-destructive">
                    {errors.addressDetail.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Ghi chú</Label>
                <Textarea
                  id="note"
                  placeholder="Ghi chú cho đơn hàng (tuỳ chọn)"
                  rows={3}
                  {...register("note")}
                />
                {errors.note && (
                  <p className="text-sm text-destructive">
                    {errors.note.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pickup Form */}
        {fulfillmentType === FulfillmentType.PICKUP && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin người nhận</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg border border-blue-200 bg-blue-50 text-sm text-blue-800">
                <Store className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  Cửa hàng xử lý đơn sẽ được xác định tự động dựa trên kho hàng
                  của sản phẩm bạn đã chọn.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickupRecipientName">
                    Tên người nhận <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pickupRecipientName"
                    placeholder="Nguyễn Văn A"
                    {...register("recipientName")}
                  />
                  {errors.recipientName && (
                    <p className="text-sm text-destructive">
                      {errors.recipientName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupRecipientPhone">
                    Số điện thoại <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pickupRecipientPhone"
                    placeholder="0901234567"
                    {...register("recipientPhone")}
                  />
                  {errors.recipientPhone && (
                    <p className="text-sm text-destructive">
                      {errors.recipientPhone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupNote">Ghi chú</Label>
                <Textarea
                  id="pickupNote"
                  placeholder="Ghi chú khi đến nhận hàng (tuỳ chọn)"
                  rows={3}
                  {...register("note")}
                />
                {errors.note && (
                  <p className="text-sm text-destructive">
                    {errors.note.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate("/cart")}
          >
            ← Quay lại giỏ hàng
          </Button>
          <Button type="submit">
            Tiếp tục <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutShipping;
