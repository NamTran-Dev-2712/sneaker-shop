export interface UpdateStoreRequest {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
}
