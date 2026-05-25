export interface CreateStoreResponse {
  id: number;
  code: string;
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string; // ISO date string
}
