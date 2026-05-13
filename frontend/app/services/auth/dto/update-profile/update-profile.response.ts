export interface UpdateProfileResponse {
  accountId: number;
  email: string;
  phone: string;
  avatar: string | null;
  fullName: string | null;
  birthday: string | null;
  updatedAt: string;
}
