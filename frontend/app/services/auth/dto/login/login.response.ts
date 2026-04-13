import type { Role } from "~/types/entities/user.type";

export interface StaffProfileInfo {
  staffId: number;
  storeId: number;
  storeName: string;
  storeCode: string;
  storeAddress?: string;
  storePhone?: string;
}

export interface LoginResponse {
  accountId: number;
  customerId?: number;
  email: string;
  isEmailVerified: boolean;
  hasPassword: boolean;
  phone: string;
  fullName: string;
  avatar?: string;
  birthday?: string;
  role: Role;
  cartItemCount: number;
  staffProfile?: StaffProfileInfo;
}
