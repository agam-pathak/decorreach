import {
  AIScoringResult,
  AIEmailGenerationParams,
  AIEmailGenerationResult,
  AIProviderName,
} from '@/types/api';
import { AIProvider } from '../interfaces';
import { MockAIProvider } from './mock-providers';
import { logApiCall } from '../telemetry';

export class OpenAIAIProvider implements AIProvider {
  name: AIProviderName = 'openai';
  displayName = 'OpenAI (GPT-4o)';

  isAvailable(): boolean {
    return !!process.env.OPENAI_API_KEY;
  }

  async analyzeBuyer(product: any, buyer: any): Promise<AIScoringResult> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return new MockAIProvider().analyzeBuyer(product, buyer);

    const startTime = Date.now();
    try {
      const prompt = `You are a B2B retail discovery analyst for U.S. home decor.
Evaluate the relevance between this seller's product and this U.S. buyer.

Seller Product:
${JSON.stringify(product, null, 2)}

Buyer Information:
${JSON.stringify({
  businessName: buyer.businessName,
  category: buyer.category,
  buyerType: buyer.buyerType,
  description: buyer.description,
  city: buyer.city,
  state: buyer.state,
}, null, 2)}

Return strict JSON only matching:
{
  "matchScore": number (0-100),
  "buyerType": string,
  "relevance": "excellent" | "strong" | "potential" | "low",
  "reasons": string[] (3 concise factual reasons),
  "recommendedPitch": string
}`;

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
        signal: AbortSignal.timeout(10000),
      });

      const durationMs = Date.now() - startTime;
      const data = await res.json();

      logApiCall({
        provider: 'openai',
        endpoint: '/v1/chat/completions',
        requestCount: 1,
        durationMs,
        statusCode: res.status,
        status: res.ok ? 'success' : 'error',
      });

      if (!res.ok) throw new Error('OpenAI request failed');
      const parsed = JSON.parse(data.choices[0].message.content);
      return parsed;
    } catch (err: any) {
      logApiCall({
        provider: 'openai',
        endpoint: '/v1/chat/completions',
        requestCount: 1,
        durationMs: Date.now() - startTime,
        statusCode: 500,
        status: 'error',
        errorMessage: err.message,
      });
      return new MockAIProvider().analyzeBuyer(product, buyer);
    }
  }

  async generatePersonalizedEmail(params: AIEmailGenerationParams): Promise<AIEmailGenerationResult> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return new MockAIProvider().generatePersonalizedEmail(params);

    const startTime = Date.now();
    try {
      const prompt = `You are a professional B2B wholesale sales development representative.
Write a personalized outreach email from a home decor manufacturer to a verified U.S. business buyer.

Rules:
1. NEVER fabricate or invent facts about the buyer.
2. Only reference their verified business name, category, and city.
3. Keep it concise, high-converting, and respectful.
4. Tone: ${params.customTone || 'wholesale_direct'}

Seller:
Name: ${params.sellerProfile.sellerName}
Company: ${params.sellerProfile.companyName}
Website: ${params.sellerProfile.website || 'N/A'}
Product: ${params.sellerProduct.name} (${params.sellerProduct.category})
Description: ${params.sellerProduct.description}

Buyer:
Business Name: ${params.buyer.businessName}
Category: ${params.buyer.category}
City: ${params.buyer.city}, ${params.buyer.state}

Return strict JSON:
{
  "subject": string,
  "body": string,
  "callToAction": string,
  "confidenceScore": number (0.0 to 1.0)
}`;

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.3,
        }),
        signal: AbortSignal.timeout(10000),
      });

      const durationMs = Date.now() - startTime;
      const data = await res.json();

      logApiCall({
        provider: 'openai',
        endpoint: '/v1/chat/completions',
        requestCount: 1,
        durationMs,
        statusCode: res.status,
        status: res.ok ? 'success' : 'error',
      });

      if (!res.ok) throw new Error('OpenAI generation failed');
      const parsed = JSON.parse(data.choices[0].message.content);
      return parsed;
    } catch (err: any) {
      logApiCall({
        provider: 'openai',
        endpoint: '/v1/chat/completions',
        requestCount: 1,
        durationMs: Date.now() - startTime,
        statusCode: 500,
        status: 'error',
        errorMessage: err.message,
      });
      return new MockAIProvider().generatePersonalizedEmail(params);
    }
  }
}
