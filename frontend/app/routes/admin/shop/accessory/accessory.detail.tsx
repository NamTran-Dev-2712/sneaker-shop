import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  useAccessoryDetail,
  useDeleteAccessory,
} from "~/hooks/react-query/use-accessory.query";
import { AccessoryViewDetail } from "~/components/feature/admin/shop/accessory/detail/accessory.view-detail";
import { DeleteModal } from "~/components/common/modal/modal.delete";
import type { Route } from "./+types/accessory.detail";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chi tiết phụ kiện - Admin Panel" },
    {
      name: "description",
      content: "View accessory details within the admin panel",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function AccessoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessoryId = Number(id);

  const { data: accessory, isLoading } = useAccessoryDetail(accessoryId);
  const deleteMutation = useDeleteAccessory();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = () => {
    navigate(`/admin/accessories/${accessoryId}/edit`);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deleteMutation.mutateAsync(accessoryId);
    setIsDeleteModalOpen(false);
    navigate("/admin/accessories");
  };

  return (
    <>
      <AccessoryViewDetail
        accessory={accessory ?? undefined}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Xóa phụ kiện"
        itemName={accessory?.name}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
