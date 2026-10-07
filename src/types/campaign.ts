export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'completed' | 'paused';

export type CampaignBuyerStatus = 
  | 'pending' 
  | 'sent' 
  | 'delivered' 
  | 'opened' 
  | 'clicked' 
  | 'replied' 
  | 'bounced' 
  | 'failed' 
  | 'unsubscribed';

export interface CampaignBuyer {
  id: string;
  campaignId: string;
  buyerId: string;
  personalizedSubject: string;
  personalizedBody: string;
  status: CampaignBuyerStatus;
  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  repliedAt?: string;
  bouncedAt?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  userId: string;
  name: string;
  subject: string;
  templateId?: string;
  status: CampaignStatus;
  senderName: string;
  replyTo: string;
  personalizationEnabled: boolean;
  dailyLimit: number;
  buyersCount?: number;
  sentCount?: number;
  deliveredCount?: number;
  openedCount?: number;
  clickedCount?: number;
  repliedCount?: number;
  bouncedCount?: number;
  scheduledAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  userId: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EmailEvent {
  id: string;
  campaignId: string;
  buyerId: string;
  eventType: 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'bounced' | 'unsubscribed' | 'complaint';
  providerEventId?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface SuppressionEntry {
  id: string;
  userId: string;
  email: string;
  reason: 'unsubscribed' | 'bounced' | 'manual' | 'complaint';
  createdAt: string;
}

export interface EmailSafetySettings {
  dailyLimit: number;
  optOutFooter: boolean;
  duplicateSuppression: boolean;
  requireVerification: boolean;
  testEmailAddress?: string;
}
