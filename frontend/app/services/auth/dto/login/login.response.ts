import type { Role } from "~/types/entities/user.type";

export interface LoginResponse {
  accountId: number;
  email: string;
  isEmailVerified: boolean;
  phone: string;
  fullName: string;
  avatar?: string;
  birthday?: string;
  role: Role;
}
