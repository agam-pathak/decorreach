export type EmailStatus = 'verified' | 'unverified' | 'invalid' | 'risky';

export type PipelineStatus = 
  | 'discovered' 
  | 'qualified' 
  | 'contact_verified' 
  | 'added_to_campaign' 
  | 'contacted' 
  | 'opened' 
  | 'replied' 
  | 'interested' 
  | 'customer';

export interface SocialProfiles {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  pinterest?: string;
}

export interface VerificationDetails {
  score?: number;
  provider?: string;
  mxFound?: boolean;
  smtpCheck?: boolean;
  disposable?: boolean;
  statusText?: string;
}

export interface Buyer {
  id: string;
  userId?: string;
  businessName: string;
  normalizedName: string;
  category: string;
  description?: string;
  website?: string;
  domain?: string;
  businessEmail?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  industry?: string;
  buyerType: string;
  employeeCount?: number;
  socialProfiles?: SocialProfiles;
  sourceProviders: string[];
  emailStatus: EmailStatus;
  verificationDetails?: VerificationDetails;
  matchScore: number;
  matchReasons: string[];
  aiPitch?: string;
  pipelineStatus: PipelineStatus;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface BuyerSearchParams {
  productName: string;
  productCategory: string;
  productDescription: string;
  keywords?: string[];
  country?: string;
  states?: string[];
  cities?: string[];
  buyerTypes: string[];
  minimumMatchScore: number;
  hasWebsite?: boolean;
  hasEmail?: boolean;
  hasPhone?: boolean;
  hasAddress?: boolean;
  hasSocial?: boolean;
}

export interface BuyerSearchResponse {
  searchId: string;
  total: number;
  qualifiedCount: number;
  verifiedEmailCount: number;
  providersUsed: string[];
  executionTimeMs: number;
  buyers: Buyer[];
  warnings?: string[];
}
