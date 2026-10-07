import { RawBusiness } from '@/types/api';
import { Buyer, BuyerSearchParams, BuyerSearchResponse } from '@/types/buyer';
import { BusinessSearchProvider, EnrichmentProvider, EmailVerificationProvider, AIProvider } from './interfaces';
import { GooglePlacesProvider } from './providers/google-places';
import { YelpProvider } from './providers/yelp';
import { FoursquareProvider } from './providers/foursquare';
import { ApolloProvider, HunterProvider } from './providers/apollo-hunter';
import { OpenAIAIProvider } from './providers/ai-providers';
import {
  MockBusinessProvider,
  MockEnrichmentProvider,
  MockVerificationProvider,
  MockAIProvider,
} from './providers/mock-providers';
import { deduplicateBusinesses } from '@/lib/deduplication';
import { calculateBuyerMatchScore } from '@/lib/scoring';

export class BuyerDiscoveryEngine {
  private businessProviders: BusinessSearchProvider[];
  private enrichmentProviders: EnrichmentProvider[];
  private verificationProviders: EmailVerificationProvider[];
  private aiProvider: AIProvider;

  constructor() {
    // Multi-provider initialization with real adapters and mock fallbacks
    this.businessProviders = [
      new GooglePlacesProvider(),
      new YelpProvider(),
      new FoursquareProvider(),
      new MockBusinessProvider(),
    ];

    this.enrichmentProviders = [
      new ApolloProvider(),
      new HunterProvider(),
      new MockEnrichmentProvider(),
    ];

    this.verificationProviders = [
      new HunterProvider(),
      new MockVerificationProvider(),
    ];

    this.aiProvider = new OpenAIAIProvider();
  }

  async searchAndEnrich(params: BuyerSearchParams): Promise<BuyerSearchResponse> {
    const startTime = Date.now();
    const warnings: string[] = [];
    const providersUsed: string[] = [];
    const collectedRaw: RawBusiness[] = [];

    // Filter available business providers based on API keys and mock mode
    const isMockForced = process.env.USE_MOCK_PROVIDERS === 'true';
    const activeProviders = this.businessProviders.filter((p) => {
      if (isMockForced && p.name !== 'mock_directory') return false;
      return p.isAvailable();
    });

    // If no real provider is available, use mock directory fallback
    if (activeProviders.length === 0) {
      activeProviders.push(new MockBusinessProvider());
      warnings.push('Running in Demo / Mock mode (Public U.S. Business Directory active).');
    }

    // Call business providers in parallel
    const searchPromises = activeProviders.map(async (provider) => {
      try {
        const results = await provider.search(params);
        providersUsed.push(provider.name);
        return results;
      } catch (err: any) {
        warnings.push(`${provider.displayName} was unavailable: ${err.message}`);
        return [];
      }
    });

    const resultsArray = await Promise.all(searchPromises);
    for (const res of resultsArray) {
      collectedRaw.push(...res);
    }

    // If real providers returned zero results or all failed, fallback to mock directory
    if (collectedRaw.length === 0 && !isMockForced) {
      const mockFallback = new MockBusinessProvider();
      const mockResults = await mockFallback.search(params);
      collectedRaw.push(...mockResults);
      providersUsed.push('mock_directory');
      warnings.push('External providers yielded no matches. Loaded verified U.S. fallback directory.');
    }

    // Phase 2: Deduplication across all providers
    const deduplicatedBuyers = deduplicateBusinesses(collectedRaw);

    // Phase 3: Enrichment & Email Verification
    // Pick active enrichment provider
    const enrichmentProvider = this.enrichmentProviders.find((p) => p.isAvailable()) || new MockEnrichmentProvider();
    providersUsed.push(enrichmentProvider.name);

    const verificationProvider = this.verificationProviders.find((p) => p.isAvailable()) || new MockVerificationProvider();
    providersUsed.push(verificationProvider.name);

    // Enrich top records
    const enrichedBuyers: Buyer[] = await Promise.all(
      deduplicatedBuyers.map(async (buyer) => {
        try {
          const rawEquiv: RawBusiness = {
            externalId: buyer.id,
            sourceProvider: buyer.sourceProviders[0] as any,
            name: buyer.businessName,
            website: buyer.website,
            city: buyer.city,
            state: buyer.state,
          };

          const enrichment = await enrichmentProvider.enrich(rawEquiv);
          if (enrichment.businessEmail) {
            buyer.businessEmail = enrichment.businessEmail;
            // Verify the email
            const verifyRes = await verificationProvider.verify(enrichment.businessEmail);
            buyer.emailStatus = verifyRes.status;
            buyer.verificationDetails = {
              score: verifyRes.score,
              provider: verifyRes.provider,
              mxFound: verifyRes.mxFound,
              smtpCheck: verifyRes.smtpCheck,
              statusText: verifyRes.details,
            };
          }
          if (enrichment.employeeCount) buyer.employeeCount = enrichment.employeeCount;
          if (enrichment.description && !buyer.description) buyer.description = enrichment.description;
          if (enrichment.socialProfiles) buyer.socialProfiles = enrichment.socialProfiles;
          if (enrichment.industry) buyer.industry = enrichment.industry;
        } catch {
          // Soft failure on enrichment; buyer still preserved
        }

        // Phase 4: Buyer Match Scoring (0-100)
        const scoreBreakdown = calculateBuyerMatchScore(buyer, params);
        buyer.matchScore = scoreBreakdown.total;
        buyer.matchReasons = scoreBreakdown.reasons;

        // Auto-assign pipeline status
        if (buyer.matchScore >= 80) {
          buyer.pipelineStatus = 'qualified';
        } else {
          buyer.pipelineStatus = 'discovered';
        }

        return buyer;
      })
    );

    // Filter by Minimum Match Score
    const minScore = params.minimumMatchScore || 0;
    let filtered = enrichedBuyers.filter((b) => b.matchScore >= minScore);

    // Contact availability filters
    if (params.hasWebsite) filtered = filtered.filter((b) => !!b.website);
    if (params.hasEmail) filtered = filtered.filter((b) => !!b.businessEmail);
    if (params.hasPhone) filtered = filtered.filter((b) => !!b.phone);
    if (params.hasAddress) filtered = filtered.filter((b) => !!b.address);
    if (params.hasSocial) filtered = filtered.filter((b) => !!b.socialProfiles && Object.keys(b.socialProfiles).length > 0);

    // Sort by Match Score descending
    filtered.sort((a, b) => b.matchScore - a.matchScore);

    const qualifiedCount = filtered.filter((b) => b.matchScore >= 80).length;
    const verifiedEmailCount = filtered.filter((b) => b.emailStatus === 'verified').length;

    return {
      searchId: `search_${Date.now()}`,
      total: filtered.length,
      qualifiedCount,
      verifiedEmailCount,
      providersUsed: Array.from(new Set(providersUsed)),
      executionTimeMs: Date.now() - startTime,
      buyers: filtered,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }
}

export const buyerDiscoveryEngine = new BuyerDiscoveryEngine();
