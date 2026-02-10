import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { ModalLayout } from "~/components/common/modal/modal.layout";
import { UploadImage } from "~/components/common/shared/upload-image";
import type { GetSlideItem } from "~/services/attribute/slide/dto/get-slide/get-slide.response";
import {
  createSlideSchema,
  updateSlideSchema,
  type CreateSlideFormData,
  type UpdateSlideFormData,
} from "~/lib/validation/admin/attribute/slide.schema";

interface SlideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slide?: GetSlideItem | null;
  onSubmit: (data: CreateSlideFormData | UpdateSlideFormData) => void;
  isLoading?: boolean;
}

export const SlideModal = ({
  open,
  onOpenChange,
  slide,
  onSubmit,
  isLoading = false,
}: SlideModalProps) => {
  const isEdit = !!slide;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? updateSlideSchema : createSlideSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      buttonText: "",
      buttonUrl: "",
      image: undefined as File | undefined,
    },
  });

  // Reset form when modal opens/closes or slide changes
  useEffect(() => {
    if (open) {
      if (slide) {
        reset({
          title: slide.title,
          subtitle: slide.subtitle,
          description: slide.description,
          buttonText: slide.buttonText,
          buttonUrl: slide.buttonUrl,
        });
        setPreviewUrl(slide.imageUrl);
        setImageFile(null);
      } else {
        reset({
          title: "",
          subtitle: "",
          description: "",
          buttonText: "",
          buttonUrl: "",
        });
        setPreviewUrl(null);
        setImageFile(null);
      }
    }
  }, [open, slide, reset]);

  const handleImageChange = useCallback(
    (file: File | null) => {
      setImageFile(file);
      if (file) {
        setValue("image", file, { shouldValidate: true });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setValue("image", undefined as unknown as File, {
          shouldValidate: true,
        });
        setPreviewUrl(isEdit && slide ? slide.imageUrl : null);
      }
    },
    [setValue, isEdit, slide],
  );

  const handleFormSubmit = (
    data: CreateSlideFormData | UpdateSlideFormData,
  ) => {
    onSubmit(data);
  };

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa slide" : "Thêm slide mới"}
      description={
        isEdit
          ? "Cập nhật thông tin slide hiển thị trên trang chủ"
          : "Điền thông tin để tạo slide mới cho trang chủ"
      }
      isLoading={isLoading}
      className="max-w-2xl"
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" form="slide-form" disabled={isLoading}>
            {isEdit ? "Cập nhật" : "Tạo slide"}
          </Button>
        </>
      }
    >
      <form
        id="slide-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5"
      >
        {/* Tiêu đề */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Tiêu đề <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Nhập tiêu đề slide (vd: Bộ Sưu Tập Mới)"
            {...register("title")}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Phụ đề */}
        <div className="space-y-2">
          <Label htmlFor="subtitle">
            Phụ đề <span className="text-destructive">*</span>
          </Label>
          <Input
            id="subtitle"
            placeholder="Nhập phụ đề slide (vd: Nike Air Max 2024)"
            {...register("subtitle")}
            aria-invalid={!!errors.subtitle}
          />
          {errors.subtitle && (
            <p className="text-sm text-destructive">
              {errors.subtitle.message}
            </p>
          )}
        </div>

        {/* Mô tả */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Mô tả <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Nhập mô tả chi tiết cho slide..."
            rows={3}
            {...register("description")}
            aria-invalid={!!errors.description}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Upload ảnh */}
        <div className="space-y-2">
          <Label>
            Ảnh slide {!isEdit && <span className="text-destructive">*</span>}
          </Label>
          {previewUrl && !imageFile && isEdit ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="absolute bottom-2 right-2"
                onClick={() => {
                  setPreviewUrl(null);
                }}
              >
                Thay đổi ảnh
              </Button>
            </div>
          ) : (
            <UploadImage
              value={imageFile}
              onChange={handleImageChange}
              label=""
              required={!isEdit}
              error={errors.image?.message}
            />
          )}
          {errors.image && (
            <p className="text-sm text-destructive">{errors.image.message}</p>
          )}
        </div>

        {/* Text nút */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="buttonText">
              Text nút <span className="text-destructive">*</span>
            </Label>
            <Input
              id="buttonText"
              placeholder="Khám phá ngay"
              {...register("buttonText")}
              aria-invalid={!!errors.buttonText}
            />
            {errors.buttonText && (
              <p className="text-sm text-destructive">
                {errors.buttonText.message}
              </p>
            )}
          </div>

          {/* URL nút */}
          <div className="space-y-2">
            <Label htmlFor="buttonUrl">
              URL nút <span className="text-destructive">*</span>
            </Label>
            <Input
              id="buttonUrl"
              placeholder="/sneakers"
              {...register("buttonUrl")}
              aria-invalid={!!errors.buttonUrl}
            />
            {errors.buttonUrl && (
              <p className="text-sm text-destructive">
                {errors.buttonUrl.message}
              </p>
            )}
          </div>
        </div>
      </form>
    </ModalLayout>
  );
};

export default SlideModal;
