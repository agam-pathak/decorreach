/**
 * DecorReach Automated Test Suite
 * Covers Unit Tests (Scoring, Deduplication, Query Intelligence, Validation)
 * and Integration Tests (BuyerDiscoveryEngine, Email Personalization, Safety)
 */

import {
  normalizeBusinessName,
  extractDomain,
  normalizePhoneNumber,
  areBusinessesDuplicates,
  deduplicateBusinesses,
} from '../lib/deduplication';
import { calculateBuyerMatchScore } from '../lib/scoring';
import { expandSearchQuery } from '../lib/api/query-intelligence';
import {
  MockBusinessProvider,
  MockEnrichmentProvider,
  MockVerificationProvider,
  MockAIProvider,
  MockEmailProvider,
} from '../lib/api/providers/mock-providers';
import { BuyerDiscoveryEngine } from '../lib/api/buyer-engine';
import { BuyerSearchSchema, CreateCampaignSchema } from '../lib/validation';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n=============================================');
  console.log('🧪 RUNNING DECORREACH COMPREHENSIVE TEST SUITE');
  console.log('=============================================\n');

  // ----------------------------------------------------
  // TEST GROUP 1: Business Name & Domain Normalization
  // ----------------------------------------------------
  console.log('--- 1. Deduplication & Normalization Unit Tests ---');

  const norm1 = normalizeBusinessName('ABC Home Decor LLC');
  const norm2 = normalizeBusinessName('ABC Home Décor, Inc.');
  assert(norm1 === norm2, `Normalizes LLC and diacritics: "${norm1}" === "${norm2}"`);

  const domain1 = extractDomain('https://www.urbannestinteriors.com/shop/catalog');
  assert(domain1 === 'urbannestinteriors.com', `Extracts root domain properly: "${domain1}"`);

  const phoneNorm = normalizePhoneNumber('+1 (512) 555-0142');
  assert(phoneNorm === '5125550142', `Normalizes US phone number: "${phoneNorm}"`);

  const isDup = areBusinessesDuplicates(
    { name: 'Urban Nest Interiors LLC', domain: 'urbannest.com', city: 'Austin' },
    { name: 'Urban Nest Interiors', domain: 'urbannest.com', city: 'Austin' }
  );
  assert(isDup === true, 'Identifies matching businesses by domain and normalized name');

  const isNotDup = areBusinessesDuplicates(
    { name: 'Oak & Stone Living', domain: 'oakstone.com', city: 'Los Angeles' },
    { name: 'Pacific Coast Craft', domain: 'pacificcraft.com', city: 'Seattle' }
  );
  assert(isNotDup === false, 'Distinguishes between different retail businesses');

  // ----------------------------------------------------
  // TEST GROUP 2: Buyer Match Scoring Engine (0-100)
  // ----------------------------------------------------
  console.log('\n--- 2. Buyer Match Scoring Engine Unit Tests ---');

  const highMatchScore = calculateBuyerMatchScore(
    {
      businessName: 'Urban Nest Interiors',
      category: 'Wall Decor & Furnishings',
      description: 'Specializes in handcrafted wooden wall decor and artisan mirrors',
      state: 'California',
      buyerType: 'Home Decor Store',
      website: 'https://urbannest.com',
      domain: 'urbannest.com',
      businessEmail: 'buyer@urbannest.com',
      emailStatus: 'verified',
      sourceProviders: ['google_places', 'yelp'],
      phone: '555-1234',
      address: '123 Main St',
    },
    {
      productName: 'Handmade Wooden Wall Decor',
      productCategory: 'Wall Decor',
      productDescription: 'Handcrafted wooden wall art',
      keywords: ['handmade', 'wooden'],
      states: ['California'],
      buyerTypes: ['Home Decor Store'],
      minimumMatchScore: 70,
    }
  );

  assert(highMatchScore.total >= 88, `Calculates high match score: ${highMatchScore.total}/100`);
  assert(highMatchScore.tier === 'Excellent Match', `Assigns tier: ${highMatchScore.tier}`);
  assert(highMatchScore.reasons.length >= 2, `Generates explainable match reasons (${highMatchScore.reasons.length})`);

  // Low match scenario
  const lowMatchScore = calculateBuyerMatchScore(
    {
      businessName: 'Apex Industrial Pipe Co',
      category: 'Plumbing Supply',
      state: 'Ohio',
      buyerType: 'Distributor',
    },
    {
      productName: 'Handmade Wooden Wall Decor',
      productCategory: 'Wall Decor',
      productDescription: 'Handcrafted wooden wall art',
      states: ['California'],
      buyerTypes: ['Home Decor Store'],
      minimumMatchScore: 70,
    }
  );
  assert(lowMatchScore.total < 60, `Low match receives score < 60: ${lowMatchScore.total}/100`);

  // ----------------------------------------------------
  // TEST GROUP 3: Search Query Intelligence & Expansion
  // ----------------------------------------------------
  console.log('\n--- 3. Query Intelligence Engine Unit Tests ---');

  const expansion = expandSearchQuery(
    'Handmade Wooden Wall Decor',
    'Wall Decor',
    'Handcrafted wooden wall art panels'
  );
  assert(expansion.expandedConcepts.length > 0, `Generates concept expansions: ${expansion.expandedConcepts.join(', ')}`);
  assert(expansion.suggestedBuyerTypes.includes('Interior Design Studio'), 'Suggests Interior Design Studio for wall art');
  assert(expansion.suggestedKeywords.includes('handmade'), 'Extracts relevant keyword tags');

  // ----------------------------------------------------
  // TEST GROUP 4: Provider Adapters & AI Personalization
  // ----------------------------------------------------
  console.log('\n--- 4. Provider Adapters & AI Email Tests ---');

  const bizProvider = new MockBusinessProvider();
  const searchResults = await bizProvider.search({
    productName: 'Wall Decor',
    productCategory: 'Wall Decor',
    productDescription: 'Decor',
    buyerTypes: ['Home Decor Store', 'Furniture Store', 'Retail Store'],
    minimumMatchScore: 60,
  });
  assert(searchResults.length >= 10, `Mock Business Provider returns ${searchResults.length} U.S. businesses`);

  const verifier = new MockVerificationProvider();
  const verifyRes = await verifier.verify('partnerships@urbannestinteriors.com');
  assert(verifyRes.status === 'verified', 'Email verifier confirms valid inbox via SMTP check');
  assert(verifyRes.score >= 90, `Verification score: ${verifyRes.score}/100`);

  const aiProvider = new MockAIProvider();
  const emailDraft = await aiProvider.generatePersonalizedEmail({
    sellerProduct: { name: 'Handmade Wooden Wall Decor', category: 'Wall Decor', description: 'Carved teak' },
    sellerProfile: { sellerName: 'Agam Pathak', companyName: 'Heritage Decor' },
    buyer: {
      id: 'b1',
      businessName: 'Oak & Stone Living',
      normalizedName: 'oak and stone living',
      category: 'Furniture & Decor',
      buyerType: 'Furniture Store',
      city: 'Los Angeles',
      state: 'California',
      country: 'United States',
      sourceProviders: ['mock_directory'],
      emailStatus: 'verified',
      matchScore: 88,
      matchReasons: [],
      pipelineStatus: 'discovered',
      tags: [],
      createdAt: new Date().toISOString(),
    },
  });
  assert(emailDraft.subject.includes('Oak & Stone Living'), `Personalized subject contains buyer name: "${emailDraft.subject}"`);
  assert(emailDraft.body.includes('Heritage Decor'), 'Email body contains seller company identity');

  // ----------------------------------------------------
  // TEST GROUP 5: BuyerDiscoveryEngine Integration Test
  // ----------------------------------------------------
  console.log('\n--- 5. BuyerDiscoveryEngine Integration Test ---');

  const engine = new BuyerDiscoveryEngine();
  const engineResponse = await engine.searchAndEnrich({
    productName: 'Handcrafted Wooden Wall Decor',
    productCategory: 'Wall Decor',
    productDescription: 'Artisan carved panels',
    states: ['California', 'Texas'],
    buyerTypes: ['Home Decor Store', 'Interior Design Studio'],
    minimumMatchScore: 70,
    hasWebsite: true,
  });

  assert(engineResponse.total > 0, `Engine discovered ${engineResponse.total} buyers`);
  assert(engineResponse.qualifiedCount > 0, `Found ${engineResponse.qualifiedCount} qualified buyers (score >= 80)`);
  assert(engineResponse.providersUsed.length >= 2, `Utilized multiple providers: ${engineResponse.providersUsed.join(', ')}`);

  // ----------------------------------------------------
  // TEST GROUP 6: Zod Schema Validation Tests
  // ----------------------------------------------------
  console.log('\n--- 6. Schema Validation Tests ---');

  const validSearchPayload = BuyerSearchSchema.safeParse({
    productName: 'Wooden Mirror',
    productCategory: 'Mirrors',
    productDescription: 'Hand-carved mirrors',
    buyerTypes: ['Home Decor Store'],
  });
  assert(validSearchPayload.success === true, 'Accepts valid search criteria schema');

  const invalidSearchPayload = BuyerSearchSchema.safeParse({
    productName: '', // too short
    productCategory: '',
    buyerTypes: [], // empty
  });
  assert(invalidSearchPayload.success === false, 'Rejects invalid empty search input');

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n=============================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
