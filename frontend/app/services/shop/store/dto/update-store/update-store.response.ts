export interface UpdateStoreResponse {
  id: number;
  code: string;
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  updatedAt: string; // ISO date string
}
