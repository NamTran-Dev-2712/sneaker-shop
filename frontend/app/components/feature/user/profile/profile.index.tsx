import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Save,
  RotateCcw,
  Loader2,
  Camera,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { showSuccessToast, showErrorToast } from "~/components/common/toast";
import useAuth from "~/store/auth/auth.hook";
import { useAppDispatch } from "~/hooks/redux";
import { login } from "~/store/auth/auth.slice";
import { authSerivce } from "~/services/auth/auth.service";

// ========================
// Zod Schema
// ========================
const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, "Họ tên không được để trống")
    .max(100, "Họ tên không được vượt quá 100 ký tự"),
  birthday: z.string().optional(),
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  phone: z
    .string()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ========================
// Component
// ========================
const ProfilePage = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      birthday: user?.birthday ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    },
  });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  // ========================
  // Avatar Upload
  // ========================
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected
    e.target.value = "";

    // Validate file
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      showErrorToast("Chỉ chấp nhận file ảnh định dạng JPG, PNG, WEBP, GIF.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      showErrorToast("Kích thước ảnh không được vượt quá 5MB.");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const response = await authSerivce.updateAvatar(file);

      if (response.success && response.data) {
        // Update Redux with new avatar
        if (user) {
          dispatch(login({ ...user, avatar: response.data.avatar }));
        }
        showSuccessToast("Cập nhật ảnh đại diện thành công!");
      } else {
        showErrorToast(response.message || "Cập nhật ảnh đại diện thất bại.");
      }
    } catch {
      showErrorToast("Đã xảy ra lỗi khi tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // ========================
  // Profile Submit
  // ========================
  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const response = await authSerivce.updateProfile({
        email: data.email,
        phone: data.phone,
        fullName: data.fullName,
        birthday: data.birthday || undefined,
      });

      if (response.success && response.data) {
        // Update Redux with ALL fields from response
        if (user) {
          dispatch(
            login({
              ...user,
              email: response.data.email,
              phone: response.data.phone,
              fullName: response.data.fullName ?? "",
              birthday: response.data.birthday ?? undefined,
              avatar: response.data.avatar ?? user.avatar,
            }),
          );
        }

        // Reset form with new values so isDirty resets
        reset({
          fullName: response.data.fullName ?? "",
          birthday: response.data.birthday ?? "",
          email: response.data.email,
          phone: response.data.phone,
        });

        showSuccessToast("Cập nhật thông tin thành công!");
      } else {
        showErrorToast(response.message || "Cập nhật thất bại.");
      }
    } catch {
      showErrorToast("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset({
      fullName: user?.fullName ?? "",
      birthday: user?.birthday ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    });
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Tài khoản của tôi
        </h1>
        <p className="mt-1 text-muted-foreground">
          Quản lý thông tin cá nhân của bạn
        </p>
      </div>

      {/* Avatar Section */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-6 pt-6">
          {/* Avatar with upload overlay */}
          <div className="relative group">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar} alt={user?.fullName} />
              <AvatarFallback className="bg-linear-to-br from-primary to-primary/70 text-white text-xl font-semibold">
                {user?.fullName ? getInitials(user.fullName) : "U"}
              </AvatarFallback>
            </Avatar>

            {/* Upload overlay */}
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-wait"
            >
              {isUploadingAvatar ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <Camera className="h-6 w-6 text-white" />
              )}
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">
              {user?.fullName || "Chưa cập nhật"}
            </h2>
            <p className="text-sm text-muted-foreground truncate">
              {user?.email}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge
                variant="outline"
                className="text-xs border-blue-500 text-blue-700 bg-blue-50"
              >
                <Shield className="mr-1 h-3 w-3" />
                {user?.role}
              </Badge>
              {user?.isEmailVerified ? (
                <Badge
                  variant="outline"
                  className="text-xs border-green-500 text-green-700 bg-green-50"
                >
                  Email đã xác thực
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs border-yellow-500 text-yellow-700 bg-yellow-50"
                >
                  Email chưa xác thực
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Di chuột vào ảnh đại diện để thay đổi
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Họ và tên
              </Label>
              <Input
                id="fullName"
                placeholder="Nhập họ và tên"
                {...register("fullName")}
                className={errors.fullName ? "border-destructive" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Birthday */}
            <div className="space-y-2">
              <Label htmlFor="birthday" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Ngày sinh
              </Label>
              <Input
                id="birthday"
                type="date"
                {...register("birthday")}
                max={new Date().toISOString().split("T")[0]}
                min="1900-01-01"
                className={errors.birthday ? "border-destructive" : ""}
              />
              {errors.birthday && (
                <p className="text-sm text-destructive">
                  {errors.birthday.message}
                </p>
              )}
            </div>

            <Separator />

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Số điện thoại
              </Label>
              <Input
                id="phone"
                placeholder="Nhập số điện thoại"
                {...register("phone")}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={!isDirty || isSubmitting}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Hủy thay đổi
              </Button>
              <Button type="submit" disabled={!isDirty || isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
