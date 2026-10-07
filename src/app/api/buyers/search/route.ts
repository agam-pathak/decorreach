import { NextRequest, NextResponse } from 'next/server';
import { BuyerSearchSchema } from '@/lib/validation';
import { buyerDiscoveryEngine } from '@/lib/api/buyer-engine';
import { appStore } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = BuyerSearchSchema.parse(json);

    const result = await buyerDiscoveryEngine.searchAndEnrich(validated);

    // Save discovered buyers to database/store
    appStore.saveBuyers(result.buyers);

    // Save to search history
    appStore.saveSearch({
      id: result.searchId,
      name: `${validated.productName} (${validated.states?.join(', ') || 'All States'})`,
      productName: validated.productName,
      productCategory: validated.productCategory,
      states: validated.states || ['All States'],
      buyerTypes: validated.buyerTypes,
      resultsCount: result.total,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Buyer search error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message: "We couldn't complete the full search with all providers. Some data providers may be temporarily unavailable.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
