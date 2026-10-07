import { RawBusiness } from '@/types/api';
import { BuyerSearchParams } from '@/types/buyer';
import { BusinessSearchProvider } from '../interfaces';
import { logApiCall } from '../telemetry';

export class YelpProvider implements BusinessSearchProvider {
  name = 'yelp' as const;
  displayName = 'Yelp Fusion API';

  isAvailable(): boolean {
    return !!process.env.YELP_API_KEY;
  }

  async search(params: BuyerSearchParams): Promise<RawBusiness[]> {
    const apiKey = process.env.YELP_API_KEY;
    if (!apiKey) {
      throw new Error('Yelp API key is not configured');
    }

    const startTime = Date.now();
    const location = (params.states && params.states.length > 0 && params.states[0] !== 'All States')
      ? `${params.states[0]}, USA`
      : 'United States';

    const term = `${params.productCategory} ${params.buyerTypes[0] || 'home decor'}`;
    const url = `https://api.yelp.com/v3/businesses/search?term=${encodeURIComponent(
      term
    )}&location=${encodeURIComponent(location)}&limit=25`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(8000),
      });

      const durationMs = Date.now() - startTime;
      const data = await response.json();

      logApiCall({
        provider: 'yelp',
        endpoint: '/v3/businesses/search',
        requestCount: 1,
        durationMs,
        statusCode: response.status,
        status: response.ok ? 'success' : 'error',
      });

      if (!response.ok) {
        throw new Error(data.error?.description || `Yelp API error: ${response.status}`);
      }

      const results: RawBusiness[] = (data.businesses || []).map((item: any) => ({
        externalId: `yelp_${item.id}`,
        sourceProvider: 'yelp' as const,
        name: item.name,
        category: (item.categories && item.categories[0]?.title) || 'Home Decor Store',
        address: item.location?.display_address?.join(', ') || item.location?.address1,
        city: item.location?.city,
        state: item.location?.state,
        zipCode: item.location?.zip_code,
        country: item.location?.country || 'US',
        phone: item.phone || item.display_phone,
        website: item.url,
        rating: item.rating,
        reviewCount: item.review_count,
        latitude: item.coordinates?.latitude,
        longitude: item.coordinates?.longitude,
        rawPayload: item,
      }));

      return results;
    } catch (err: any) {
      logApiCall({
        provider: 'yelp',
        endpoint: '/v3/businesses/search',
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
