export interface UpdateVendorRequest {
  id: number;
  name: string;
  phone: string;
  email: string;
  address?: string;
  isActive: boolean;
}
