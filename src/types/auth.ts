export interface User {
  id: string;
  email: string;
  name: string;
  companyName: string;
  role?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface SellerProfile {
  id: string;
  userId: string;
  companyName: string;
  website?: string;
  description: string;
  productCategories: string[];
  targetMarket: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  isMockUser: boolean;
}
