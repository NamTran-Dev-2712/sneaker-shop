export interface CustomerDetailResponse {
  id: number;
  fullName: string;
  phone?: string;
  email?: string;
  birthday?: string;
  createdAt: string;
  accountId?: number;
  hasAccount: boolean;
  isActive: boolean;
  isEmailVerified: boolean;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  loyaltyTier: string;
}
