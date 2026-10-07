import { RawBusiness, EnrichedBusinessData, VerificationResult } from '@/types/api';
import { extractDomain } from '@/lib/deduplication';
import { EnrichmentProvider, EmailVerificationProvider } from '../interfaces';
import { logApiCall } from '../telemetry';

export class ApolloProvider implements EnrichmentProvider {
  name = 'apollo' as const;
  displayName = 'Apollo.io Company Enrichment';

  isAvailable(): boolean {
    return !!process.env.APOLLO_API_KEY;
  }

  async enrich(business: RawBusiness): Promise<EnrichedBusinessData> {
    const apiKey = process.env.APOLLO_API_KEY;
    if (!apiKey) throw new Error('Apollo API key not configured');

    const domain = extractDomain(business.website);
    const startTime = Date.now();

    try {
      const response = await fetch('https://api.apollo.io/v1/organizations/enrich', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': apiKey,
        },
        body: JSON.stringify({ domain }),
        signal: AbortSignal.timeout(6000),
      });

      const durationMs = Date.now() - startTime;
      const data = await response.json();

      logApiCall({
        provider: 'apollo',
        endpoint: '/v1/organizations/enrich',
        requestCount: 1,
        durationMs,
        statusCode: response.status,
        status: response.ok ? 'success' : 'error',
      });

      if (!response.ok || !data.organization) {
        throw new Error('Apollo enrichment record not found');
      }

      const org = data.organization;
      return {
        domain: org.primary_domain || domain,
        employeeCount: org.estimated_num_employees,
        industry: org.industry,
        description: org.short_description,
        socialProfiles: {
          linkedin: org.linkedin_url,
          facebook: org.facebook_url,
          instagram: org.instagram_url,
        },
        sourceProvider: 'apollo' as const,
      };
    } catch (err: any) {
      logApiCall({
        provider: 'apollo',
        endpoint: '/v1/organizations/enrich',
        requestCount: 1,
        durationMs: Date.now() - startTime,
        statusCode: 500,
        status: 'error',
        errorMessage: err.message,
      });
      throw err;
    }
  }
}

export class HunterProvider implements EnrichmentProvider, EmailVerificationProvider {
  name = 'hunter' as const;
  displayName = 'Hunter.io API';

  isAvailable(): boolean {
    return !!process.env.HUNTER_API_KEY;
  }

  async enrich(business: RawBusiness): Promise<EnrichedBusinessData> {
    const apiKey = process.env.HUNTER_API_KEY;
    if (!apiKey) throw new Error('Hunter API key not configured');

    const domain = extractDomain(business.website);
    const startTime = Date.now();

    try {
      const response = await fetch(`https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${apiKey}`, {
        signal: AbortSignal.timeout(6000),
      });

      const durationMs = Date.now() - startTime;
      const data = await response.json();

      logApiCall({
        provider: 'hunter',
        endpoint: '/v2/domain-search',
        requestCount: 1,
        durationMs,
        statusCode: response.status,
        status: response.ok ? 'success' : 'error',
      });

      if (!response.ok) throw new Error(data.errors?.[0]?.details || 'Hunter search failed');

      const emails = data.data?.emails || [];
      const primaryEmail = emails[0]?.value;

      return {
        domain,
        businessEmail: primaryEmail,
        emailStatus: primaryEmail ? 'verified' : 'unverified',
        description: data.data?.description,
        sourceProvider: 'hunter' as const,
      };
    } catch (err: any) {
      logApiCall({
        provider: 'hunter',
        endpoint: '/v2/domain-search',
        requestCount: 1,
        durationMs: Date.now() - startTime,
        statusCode: 500,
        status: 'error',
        errorMessage: err.message,
      });
      throw err;
    }
  }

  async verify(email: string): Promise<VerificationResult> {
    const apiKey = process.env.HUNTER_API_KEY || process.env.EMAIL_VERIFICATION_API_KEY;
    if (!apiKey) throw new Error('Hunter / Email verification API key not configured');

    const startTime = Date.now();

    try {
      const response = await fetch(`https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${apiKey}`, {
        signal: AbortSignal.timeout(6000),
      });

      const durationMs = Date.now() - startTime;
      const data = await response.json();

      logApiCall({
        provider: 'hunter',
        endpoint: '/v2/email-verifier',
        requestCount: 1,
        durationMs,
        statusCode: response.status,
        status: response.ok ? 'success' : 'error',
      });

      if (!response.ok) throw new Error('Verification request failed');

      const result = data.data?.result;
      const score = data.data?.score || 50;

      let status: 'verified' | 'unverified' | 'invalid' | 'risky' = 'unverified';
      if (result === 'deliverable') status = 'verified';
      else if (result === 'undeliverable') status = 'invalid';
      else if (result === 'risky') status = 'risky';

      return {
        email,
        status,
        score,
        provider: 'hunter',
        mxFound: data.data?.mx_records,
        smtpCheck: data.data?.smtp_check,
        disposable: data.data?.disposable,
        details: `Hunter verification: ${result} (${score}/100)`,
      };
    } catch (err: any) {
      logApiCall({
        provider: 'hunter',
        endpoint: '/v2/email-verifier',
        requestCount: 1,
        durationMs: Date.now() - startTime,
        statusCode: 500,
        status: 'error',
        errorMessage: err.message,
      });
      throw err;
    }
  }
}
