export interface CreateStaffResponse {
  id: number;
  accountId: number;
  fullName: string;
  email: string;
  phone: string;
  storeId: number;
  storeName: string;
  storeCode: string;
  isActive: boolean;
  createdAt: string;
}
