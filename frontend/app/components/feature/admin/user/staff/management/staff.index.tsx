import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DeleteModal } from "~/components/common/modal/modal.delete";
import { Pagination } from "~/components/common/shared/pagination";
import { StaffFilter } from "./staff.filter";
import { StaffListItem } from "./staff.list-item";
import { StaffModal } from "./staff.modal";
import {
  useStaffList,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
} from "~/hooks/react-query/use-staff.query";
import type { GetStaffItem } from "~/services/user/staff/dto/get-staff/get-staff.response";
import type {
  GetStaffRequest,
  SortStaffBy,
} from "~/services/user/staff/dto/get-staff/get-staff.request";
import type { CreateStaffRequest } from "~/services/user/staff/dto/create-staff/create-staff.request";
import type { UpdateStaffRequest } from "~/services/user/staff/dto/update-staff/update-staff.request";
import { SortOrder } from "~/types/global/filter/sort-order.filter";

export const StaffIndex = () => {
  const [query, setQuery] = useState<GetStaffRequest>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    storeId: undefined,
    isActive: undefined,
    sortBy: "name",
    sortOrder: SortOrder.ASC,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<GetStaffItem | null>(null);

  const { data, isLoading, error } = useStaffList(query);
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const deleteMutation = useDeleteStaff();

  const handleSearchChange = useCallback((search: string) => {
    setQuery((prev) => ({ ...prev, search, pageNumber: 1 }));
  }, []);

  const handleStoreIdChange = useCallback((storeId: number | undefined) => {
    setQuery((prev) => ({ ...prev, storeId, pageNumber: 1 }));
  }, []);

  const handleIsActiveChange = useCallback((isActive: boolean | undefined) => {
    setQuery((prev) => ({ ...prev, isActive, pageNumber: 1 }));
  }, []);

  const handleSortByChange = useCallback((sortBy: SortStaffBy) => {
    setQuery((prev) => ({ ...prev, sortBy }));
  }, []);

  const handleSortOrderChange = useCallback((sortOrder: SortOrder) => {
    setQuery((prev) => ({ ...prev, sortOrder }));
  }, []);

  const handleResetFilter = useCallback(() => {
    setQuery({
      pageNumber: 1,
      pageSize: 10,
      search: "",
      storeId: undefined,
      isActive: undefined,
      sortBy: "name",
      sortOrder: SortOrder.ASC,
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, pageNumber: page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize, pageNumber: 1 }));
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((staff: GetStaffItem) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((staff: GetStaffItem) => {
    setSelectedStaff(staff);
    setIsDeleteModalOpen(true);
  }, []);

  const handleModalSubmit = useCallback(
    async (data: CreateStaffRequest | UpdateStaffRequest) => {
      if (selectedStaff) {
        await updateMutation.mutateAsync({
          id: selectedStaff.id,
          data: data as UpdateStaffRequest,
        });
      } else {
        await createMutation.mutateAsync(data as CreateStaffRequest);
      }
      setIsModalOpen(false);
      setSelectedStaff(null);
    },
    [selectedStaff, createMutation, updateMutation],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (selectedStaff) {
      await deleteMutation.mutateAsync(selectedStaff.id);
      setIsDeleteModalOpen(false);
      setSelectedStaff(null);
    }
  }, [selectedStaff, deleteMutation]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý nhân viên
          </h1>
          <p className="text-muted-foreground">
            Quản lý nhân viên trong hệ thống
          </p>
        </div>
        <Button onClick={handleAdd} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Thêm nhân viên
        </Button>
      </div>

      <StaffFilter
        search={query.search || ""}
        storeId={query.storeId}
        isActive={query.isActive}
        sortBy={query.sortBy || "name"}
        sortOrder={query.sortOrder || SortOrder.ASC}
        onSearchChange={handleSearchChange}
        onStoreIdChange={handleStoreIdChange}
        onIsActiveChange={handleIsActiveChange}
        onSortByChange={handleSortByChange}
        onSortOrderChange={handleSortOrderChange}
        onReset={handleResetFilter}
      />

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p className="text-sm font-medium">Lỗi khi tải dữ liệu</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      <StaffListItem
        staffs={data?.items}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      {data && data.totalPages > 0 && (
        <Pagination
          currentPage={query.pageNumber || 1}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
          pageSize={query.pageSize || 10}
          hasPreviousPage={data.hasPreviousPage}
          hasNextPage={data.hasNextPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <StaffModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        staff={selectedStaff}
        onSubmit={handleModalSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Vô hiệu hóa nhân viên"
        description={
          selectedStaff
            ? `Bạn có chắc chắn muốn vô hiệu hóa nhân viên "${selectedStaff.fullName}"? Tài khoản nhân viên sẽ bị khóa.`
            : undefined
        }
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default StaffIndex;
