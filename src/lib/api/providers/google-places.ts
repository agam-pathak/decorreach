import { RawBusiness } from '@/types/api';
import { BuyerSearchParams } from '@/types/buyer';
import { BusinessSearchProvider } from '../interfaces';
import { logApiCall } from '../telemetry';

export class GooglePlacesProvider implements BusinessSearchProvider {
  name = 'google_places' as const;
  displayName = 'Google Maps / Places API';

  isAvailable(): boolean {
    return !!process.env.GOOGLE_MAPS_API_KEY;
  }

  async search(params: BuyerSearchParams): Promise<RawBusiness[]> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Google Places API key is not configured');
    }

    const startTime = Date.now();
    const queryTerm = `${params.productCategory} ${params.buyerTypes.join(' ')} in ${params.states?.join(' ') || 'USA'}`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      queryTerm
    )}&key=${apiKey}`;

    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(8000),
      });

      const durationMs = Date.now() - startTime;
      const data = await response.json();

      logApiCall({
        provider: 'google_places',
        endpoint: '/maps/api/place/textsearch/json',
        requestCount: 1,
        durationMs,
        statusCode: response.status,
        status: response.ok ? 'success' : 'error',
      });

      if (!response.ok || data.status !== 'OK') {
        throw new Error(data.error_message || `Google Places API returned status ${data.status}`);
      }

      const results: RawBusiness[] = (data.results || []).map((item: any) => ({
        externalId: `gp_${item.place_id}`,
        sourceProvider: 'google_places' as const,
        name: item.name,
        category: (item.types && item.types[0]) ? item.types[0].replace(/_/g, ' ') : params.productCategory,
        address: item.formatted_address,
        rating: item.rating,
        reviewCount: item.user_ratings_total,
        latitude: item.geometry?.location?.lat,
        longitude: item.geometry?.location?.lng,
        rawPayload: item,
      }));

      return results;
    } catch (err: any) {
      logApiCall({
        provider: 'google_places',
        endpoint: '/maps/api/place/textsearch/json',
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
