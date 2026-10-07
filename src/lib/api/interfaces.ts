import {
  RawBusiness,
  EnrichedBusinessData,
  VerificationResult,
  AIScoringResult,
  AIEmailGenerationParams,
  AIEmailGenerationResult,
  SendEmailParams,
  SendEmailResult,
  BusinessProviderName,
  EnrichmentProviderName,
  VerificationProviderName,
  AIProviderName,
  EmailDeliveryProviderName,
} from '@/types/api';
import { BuyerSearchParams } from '@/types/buyer';

export interface BusinessSearchProvider {
  name: BusinessProviderName;
  displayName: string;
  isAvailable(): boolean;
  search(params: BuyerSearchParams): Promise<RawBusiness[]>;
}

export interface EnrichmentProvider {
  name: EnrichmentProviderName;
  displayName: string;
  isAvailable(): boolean;
  enrich(business: RawBusiness): Promise<EnrichedBusinessData>;
}

export interface EmailVerificationProvider {
  name: VerificationProviderName;
  displayName: string;
  isAvailable(): boolean;
  verify(email: string): Promise<VerificationResult>;
}

export interface AIProvider {
  name: AIProviderName;
  displayName: string;
  isAvailable(): boolean;
  analyzeBuyer(product: any, buyer: any): Promise<AIScoringResult>;
  generatePersonalizedEmail(params: AIEmailGenerationParams): Promise<AIEmailGenerationResult>;
}

export interface EmailProvider {
  name: EmailDeliveryProviderName;
  displayName: string;
  isAvailable(): boolean;
  sendEmail(params: SendEmailParams): Promise<SendEmailResult>;
}
