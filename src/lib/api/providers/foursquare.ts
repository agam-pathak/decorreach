import { RawBusiness } from '@/types/api';
import { BuyerSearchParams } from '@/types/buyer';
import { BusinessSearchProvider } from '../interfaces';
import { logApiCall } from '../telemetry';

export class FoursquareProvider implements BusinessSearchProvider {
  name = 'foursquare' as const;
  displayName = 'Foursquare Places API';

  isAvailable(): boolean {
    return !!process.env.FOURSQUARE_API_KEY;
  }

  async search(params: BuyerSearchParams): Promise<RawBusiness[]> {
    const apiKey = process.env.FOURSQUARE_API_KEY;
    if (!apiKey) {
      throw new Error('Foursquare API key is not configured');
    }

    const startTime = Date.now();
    const query = `${params.productCategory} ${params.buyerTypes[0] || 'retail'}`;
    const near = (params.states && params.states.length > 0 && params.states[0] !== 'All States')
      ? `${params.states[0]}, USA`
      : 'United States';

    const url = `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(
      query
    )}&near=${encodeURIComponent(near)}&limit=25`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: apiKey,
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(8000),
      });

      const durationMs = Date.now() - startTime;
      const data = await response.json();

      logApiCall({
        provider: 'foursquare',
        endpoint: '/v3/places/search',
        requestCount: 1,
        durationMs,
        statusCode: response.status,
        status: response.ok ? 'success' : 'error',
      });

      if (!response.ok) {
        throw new Error(data.message || `Foursquare API error: ${response.status}`);
      }

      const results: RawBusiness[] = (data.results || []).map((item: any) => ({
        externalId: `fs_${item.fsq_id}`,
        sourceProvider: 'foursquare' as const,
        name: item.name,
        category: (item.categories && item.categories[0]?.name) || 'Home Goods Store',
        address: item.location?.formatted_address || item.location?.address,
        city: item.location?.locality,
        state: item.location?.region,
        zipCode: item.location?.postcode,
        country: item.location?.country || 'US',
        phone: item.tel,
        website: item.website,
        rating: item.rating ? item.rating / 2 : undefined,
        latitude: item.geocodes?.main?.latitude,
        longitude: item.geocodes?.main?.longitude,
        rawPayload: item,
      }));

      return results;
    } catch (err: any) {
      logApiCall({
        provider: 'foursquare',
        endpoint: '/v3/places/search',
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
