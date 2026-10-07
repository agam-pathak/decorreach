export interface QueryExpansionResult {
  primaryCategory: string;
  expandedConcepts: string[];
  suggestedBuyerTypes: string[];
  suggestedKeywords: string[];
}

export function expandSearchQuery(
  productName: string,
  category: string,
  description: string
): QueryExpansionResult {
  const text = `${productName} ${category} ${description}`.toLowerCase();
  const concepts: Set<string> = new Set();
  const buyerTypes: Set<string> = new Set();
  const keywords: Set<string> = new Set();

  // Category mapping
  if (text.includes('wall') || text.includes('art') || text.includes('mirror') || text.includes('frame')) {
    concepts.add('art galleries');
    concepts.add('interior design studios');
    concepts.add('home staging companies');
    concepts.add('boutique home decor');
    buyerTypes.add('Interior Design Studio');
    buyerTypes.add('Home Staging Company');
    buyerTypes.add('Home Decor Store');
    keywords.add('wall art');
    keywords.add('statement decor');
    keywords.add('gallery');
  }

  if (text.includes('wood') || text.includes('craft') || text.includes('hand') || text.includes('rustic')) {
    concepts.add('artisan gift shops');
    concepts.add('rustic living stores');
    concepts.add('fair trade home boutiques');
    concepts.add('craft retailers');
    buyerTypes.add('Gift Shop');
    buyerTypes.add('Boutique Store');
    buyerTypes.add('Wholesale Distributor');
    keywords.add('handmade');
    keywords.add('artisan');
    keywords.add('sustainable');
    keywords.add('woodwork');
  }

  if (text.includes('light') || text.includes('lamp') || text.includes('fixture')) {
    concepts.add('lighting showrooms');
    concepts.add('architectural lighting studios');
    concepts.add('hospitality design firms');
    buyerTypes.add('Interior Designer');
    buyerTypes.add('Hotel');
    buyerTypes.add('Furniture Store');
    keywords.add('ambient lighting');
    keywords.add('custom fixtures');
  }

  if (text.includes('rug') || text.includes('cushion') || text.includes('pillow') || text.includes('textile')) {
    concepts.add('textile showrooms');
    concepts.add('upholstery & soft furnishings');
    concepts.add('lifestyle boutiques');
    buyerTypes.add('Retail Store');
    buyerTypes.add('Interior Design Studio');
    keywords.add('woven');
    keywords.add('natural fibers');
  }

  if (text.includes('furniture') || text.includes('table') || text.includes('chair') || text.includes('cabinet')) {
    concepts.add('furniture retail showrooms');
    concepts.add('high-end staging firms');
    concepts.add('commercial interior outfitters');
    buyerTypes.add('Furniture Store');
    buyerTypes.add('Home Staging Company');
    buyerTypes.add('Distributor');
    keywords.add('solid timber');
    keywords.add('trade showroom');
  }

  // Fallback defaults
  if (concepts.size === 0) {
    concepts.add('home decor retailers');
    concepts.add('interior design studios');
    concepts.add('gift & lifestyle boutiques');
    buyerTypes.add('Home Decor Store');
    buyerTypes.add('Retail Store');
    buyerTypes.add('Interior Designer');
  }

  return {
    primaryCategory: category || 'Home Decor',
    expandedConcepts: Array.from(concepts),
    suggestedBuyerTypes: Array.from(buyerTypes),
    suggestedKeywords: Array.from(keywords),
  };
}
