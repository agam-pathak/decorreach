import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.toLowerCase();
    const state = searchParams.get('state');
    const category = searchParams.get('category');
    const buyerType = searchParams.get('buyerType');
    const pipelineStatus = searchParams.get('pipelineStatus');
    const minScore = searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!) : 0;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;

    let buyers = appStore.getBuyers();

    if (query) {
      buyers = buyers.filter(
        (b) =>
          b.businessName.toLowerCase().includes(query) ||
          b.city?.toLowerCase().includes(query) ||
          b.category?.toLowerCase().includes(query) ||
          b.tags?.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (state && state !== 'All States') {
      buyers = buyers.filter((b) => b.state?.toLowerCase() === state.toLowerCase());
    }

    if (category) {
      buyers = buyers.filter((b) => b.category?.toLowerCase().includes(category.toLowerCase()));
    }

    if (buyerType) {
      buyers = buyers.filter((b) => b.buyerType?.toLowerCase() === buyerType.toLowerCase());
    }

    if (pipelineStatus) {
      buyers = buyers.filter((b) => b.pipelineStatus === pipelineStatus);
    }

    if (minScore > 0) {
      buyers = buyers.filter((b) => b.matchScore >= minScore);
    }

    return NextResponse.json({
      total: buyers.length,
      buyers: buyers.slice(0, limit),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
