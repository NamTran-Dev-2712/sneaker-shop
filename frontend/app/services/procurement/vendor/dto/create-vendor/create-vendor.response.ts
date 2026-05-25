export interface CreateVendorResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
  address?: string;
  isActive: boolean;
  createdAt: string; // ISO date string
}
