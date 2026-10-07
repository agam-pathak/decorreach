import { Buyer, BuyerSearchParams, EmailStatus } from './buyer';

export type BusinessProviderName = 'google_places' | 'yelp' | 'foursquare' | 'mock_directory';
export type EnrichmentProviderName = 'apollo' | 'hunter' | 'mock_enrichment';
export type VerificationProviderName = 'hunter' | 'zerobounce' | 'mock_verification';
export type AIProviderName = 'openai' | 'gemini' | 'groq' | 'mock_ai';
export type EmailDeliveryProviderName = 'resend' | 'sendgrid' | 'mock_email';

export interface RawBusiness {
  externalId: string;
  sourceProvider: BusinessProviderName;
  name: string;
  category?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  latitude?: number;
  longitude?: number;
  rawPayload?: Record<string, unknown>;
}

export interface EnrichedBusinessData {
  domain?: string;
  businessEmail?: string;
  emailStatus?: EmailStatus;
  employeeCount?: number;
  industry?: string;
  description?: string;
  socialProfiles?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    pinterest?: string;
  };
  sourceProvider: EnrichmentProviderName;
}

export interface VerificationResult {
  email: string;
  status: EmailStatus;
  score: number;
  provider: VerificationProviderName;
  mxFound: boolean;
  smtpCheck: boolean;
  disposable: boolean;
  details?: string;
}

export interface AIScoringResult {
  matchScore: number;
  relevance: 'excellent' | 'strong' | 'potential' | 'low';
  buyerType: string;
  reasons: string[];
  recommendedPitch: string;
}

export interface AIEmailGenerationParams {
  sellerProduct: {
    name: string;
    category: string;
    description: string;
    keywords?: string[];
  };
  sellerProfile: {
    sellerName: string;
    companyName: string;
    website?: string;
  };
  buyer: Buyer;
  customTone?: 'friendly' | 'executive' | 'wholesale_direct';
}

export interface AIEmailGenerationResult {
  subject: string;
  body: string;
  callToAction: string;
  confidenceScore: number;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  fromName: string;
  replyTo: string;
  buyerId?: string;
  campaignId?: string;
  isTest?: boolean;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  provider: EmailDeliveryProviderName;
  status: 'sent' | 'queued' | 'simulated' | 'failed';
  error?: string;
  simulated?: boolean;
}

export interface ApiUsageRecord {
  id: string;
  userId?: string;
  provider: string;
  endpoint: string;
  requestCount: number;
  durationMs: number;
  statusCode: number;
  status: 'success' | 'rate_limited' | 'error' | 'cached';
  errorMessage?: string;
  timestamp: string;
}

export interface ProviderHealth {
  name: string;
  displayName: string;
  type: 'business' | 'enrichment' | 'verification' | 'ai' | 'email';
  status: 'connected' | 'configured' | 'mock_active' | 'error';
  requestCount: number;
  successRate: number;
  avgLatencyMs: number;
  requiresKey: string;
  isMockFallback: boolean;
}
