import { Buyer, BuyerSearchParams } from '@/types/buyer';

export interface ScoreBreakdown {
  categoryRelevance: number; // max 25
  productRelevance: number;  // max 20
  locationRelevance: number; // max 15
  buyerTypeRelevance: number;// max 15
  businessQuality: number;   // max 10
  websitePresence: number;   // max 5
  contactAvailability: number;// max 5
  emailVerification: number; // max 5
  total: number;             // max 100
  tier: 'Excellent Match' | 'Strong Match' | 'Potential Match' | 'Low Match';
  reasons: string[];
}

export function calculateBuyerMatchScore(
  buyer: Partial<Buyer>,
  searchCriteria: BuyerSearchParams
): ScoreBreakdown {
  let categoryScore = 0;
  let productScore = 0;
  let locationScore = 0;
  let buyerTypeScore = 0;
  let businessQualityScore = 0;
  let websiteScore = 0;
  let contactScore = 0;
  let verificationScore = 0;

  const reasons: string[] = [];

  // 1. Category relevance (max 25)
  const targetCategory = (searchCriteria.productCategory || '').toLowerCase();
  const buyerCategory = (buyer.category || '').toLowerCase();
  const buyerDesc = (buyer.description || '').toLowerCase();

  if (buyerCategory.includes(targetCategory) || targetCategory.includes(buyerCategory)) {
    categoryScore = 25;
    reasons.push(`Direct alignment with your product category (${searchCriteria.productCategory})`);
  } else if (
    (targetCategory.includes('wall') && (buyerCategory.includes('art') || buyerCategory.includes('decor') || buyerDesc.includes('wall'))) ||
    (targetCategory.includes('furn') && (buyerCategory.includes('furn') || buyerDesc.includes('furniture'))) ||
    (targetCategory.includes('light') && (buyerCategory.includes('lamp') || buyerDesc.includes('lighting'))) ||
    (targetCategory.includes('rug') && (buyerCategory.includes('textile') || buyerCategory.includes('floor')))
  ) {
    categoryScore = 20;
    reasons.push(`Complementary catalog focus in ${buyer.category || 'home decor'}`);
  } else if (buyerCategory.includes('decor') || buyerCategory.includes('interior') || buyerCategory.includes('lifestyle')) {
    categoryScore = 15;
    reasons.push(`General home & lifestyle merchandise store`);
  } else {
    categoryScore = 8;
  }

  // 2. Product relevance & keywords (max 20)
  const keywords = searchCriteria.keywords || [];
  const prodNameWords = searchCriteria.productName.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  let matchedKwCount = 0;

  const textToScan = `${buyer.businessName} ${buyer.category || ''} ${buyer.description || ''} ${(buyer.tags || []).join(' ')}`.toLowerCase();

  for (const kw of keywords) {
    if (textToScan.includes(kw.toLowerCase())) {
      matchedKwCount++;
    }
  }

  for (const word of prodNameWords) {
    if (textToScan.includes(word)) {
      matchedKwCount++;
    }
  }

  if (matchedKwCount >= 3) {
    productScore = 20;
    reasons.push(`High keyword overlap with your product specialty (${matchedKwCount}+ matches)`);
  } else if (matchedKwCount >= 2) {
    productScore = 15;
    reasons.push(`Curated style matches product keywords`);
  } else if (matchedKwCount >= 1) {
    productScore = 10;
  } else {
    productScore = 6;
  }

  // 3. Location relevance (max 15)
  const targetStates = searchCriteria.states || [];
  const buyerState = buyer.state || '';

  if (targetStates.length === 0 || targetStates.includes('All States')) {
    locationScore = 15;
    reasons.push(`Located in active U.S. commercial market (${buyerState || 'United States'})`);
  } else if (targetStates.some(st => st.toLowerCase() === buyerState.toLowerCase())) {
    locationScore = 15;
    reasons.push(`Direct state match in priority expansion area (${buyerState})`);
  } else {
    locationScore = 7;
  }

  // 4. Buyer type relevance (max 15)
  const targetTypes = searchCriteria.buyerTypes || [];
  const buyerType = buyer.buyerType || '';

  if (targetTypes.some(t => t.toLowerCase() === buyerType.toLowerCase())) {
    buyerTypeScore = 15;
    reasons.push(`Exact buyer segment match: ${buyerType}`);
  } else if (targetTypes.some(t => buyerType.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(buyerType.toLowerCase()))) {
    buyerTypeScore = 12;
    reasons.push(`High affinity buyer category: ${buyerType}`);
  } else {
    buyerTypeScore = 6;
  }

  // 5. Business quality (max 10)
  // Check employee count, multi-provider verification, reviews/presence
  const sourceCount = (buyer.sourceProviders || []).length;
  if (sourceCount >= 2) {
    businessQualityScore += 5;
    reasons.push(`Cross-verified across multiple data providers (${buyer.sourceProviders?.join(', ')})`);
  } else {
    businessQualityScore += 3;
  }

  if (buyer.employeeCount && buyer.employeeCount >= 5) {
    businessQualityScore += 5;
  } else if (buyer.description && buyer.description.length > 50) {
    businessQualityScore += 4;
  } else {
    businessQualityScore += 2;
  }
  businessQualityScore = Math.min(10, businessQualityScore);

  // 6. Website presence (max 5)
  if (buyer.website && buyer.domain) {
    websiteScore = 5;
  } else if (buyer.website) {
    websiteScore = 3;
  }

  // 7. Contact availability (max 5)
  if (buyer.phone && buyer.address) {
    contactScore = 5;
  } else if (buyer.phone || buyer.address) {
    contactScore = 3;
  }

  // 8. Email verification (max 5)
  if (buyer.emailStatus === 'verified') {
    verificationScore = 5;
    reasons.push('Direct verified corporate email ready for outreach');
  } else if (buyer.businessEmail) {
    verificationScore = 3;
  }

  const total = Math.min(
    100,
    categoryScore +
      productScore +
      locationScore +
      buyerTypeScore +
      businessQualityScore +
      websiteScore +
      contactScore +
      verificationScore
  );

  let tier: 'Excellent Match' | 'Strong Match' | 'Potential Match' | 'Low Match' = 'Low Match';
  if (total >= 88) tier = 'Excellent Match';
  else if (total >= 78) tier = 'Strong Match';
  else if (total >= 65) tier = 'Potential Match';

  return {
    categoryRelevance: categoryScore,
    productRelevance: productScore,
    locationRelevance: locationScore,
    buyerTypeRelevance: buyerTypeScore,
    businessQuality: businessQualityScore,
    websitePresence: websiteScore,
    contactAvailability: contactScore,
    emailVerification: verificationScore,
    total,
    tier,
    reasons: reasons.slice(0, 4),
  };
}
