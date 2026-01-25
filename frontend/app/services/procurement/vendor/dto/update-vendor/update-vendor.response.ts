export interface UpdateVendorResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
  address?: string;
  isActive: boolean;
  updatedAt: string; // ISO date string
}
