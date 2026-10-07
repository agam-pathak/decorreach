import { z } from 'zod';

export const BuyerSearchSchema = z.object({
  productName: z.string().min(2, 'Product name must be at least 2 characters'),
  productCategory: z.string().min(2, 'Category is required'),
  productDescription: z.string().min(5, 'Product description is required'),
  keywords: z.array(z.string()).optional().default([]),
  country: z.string().optional().default('United States'),
  states: z.array(z.string()).optional().default([]),
  cities: z.array(z.string()).optional().default([]),
  buyerTypes: z.array(z.string()).min(1, 'Select at least one buyer type'),
  minimumMatchScore: z.number().min(0).max(100).default(60),
  hasWebsite: z.boolean().optional().default(false),
  hasEmail: z.boolean().optional().default(false),
  hasPhone: z.boolean().optional().default(false),
  hasAddress: z.boolean().optional().default(false),
  hasSocial: z.boolean().optional().default(false),
});

export const CreateCampaignSchema = z.object({
  name: z.string().min(3, 'Campaign name must be at least 3 characters'),
  subject: z.string().min(3, 'Subject line is required'),
  templateId: z.string().optional(),
  senderName: z.string().min(2, 'Sender name is required'),
  replyTo: z.string().email('Valid reply-to email is required'),
  personalizationEnabled: z.boolean().default(true),
  dailyLimit: z.number().min(1).max(200).default(50),
  buyerIds: z.array(z.string()).min(1, 'Select at least one buyer for outreach'),
  customSubject: z.string().optional(),
  customBody: z.string().optional(),
});

export const GenerateEmailSchema = z.object({
  buyerId: z.string().min(1, 'Buyer ID is required'),
  sellerProduct: z.object({
    name: z.string(),
    category: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).optional(),
  }),
  sellerProfile: z.object({
    sellerName: z.string(),
    companyName: z.string(),
    website: z.string().optional(),
  }),
  customTone: z.enum(['friendly', 'executive', 'wholesale_direct']).optional().default('wholesale_direct'),
});

export const SendTestEmailSchema = z.object({
  recipientEmail: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  senderName: z.string().min(1, 'Sender name is required'),
  replyTo: z.string().email('Invalid reply-to email'),
});

export const VerifyEmailSchema = z.object({
  email: z.string().email('Invalid email address to verify'),
  buyerId: z.string().optional(),
});

export const UpdateBuyerPipelineSchema = z.object({
  pipelineStatus: z.enum([
    'discovered',
    'qualified',
    'contact_verified',
    'added_to_campaign',
    'contacted',
    'opened',
    'replied',
    'interested',
    'customer',
  ]),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
