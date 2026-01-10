import type { Role } from "~/types/entities/user.type";

export interface RegisterResponse {
  accountId: number;
  email: string;
  role: Role;
}
