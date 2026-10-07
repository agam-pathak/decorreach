import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/db/store';
import { OpenAIAIProvider } from '@/lib/api/providers/ai-providers';
import { MockAIProvider } from '@/lib/api/providers/mock-providers';

export async function POST(req: NextRequest) {
  try {
    const { buyerId, product } = await req.json();

    const buyer = appStore.getBuyerById(buyerId);
    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    const ai = process.env.OPENAI_API_KEY ? new OpenAIAIProvider() : new MockAIProvider();
    const analysis = await ai.analyzeBuyer(product, buyer);

    // Save pitch to buyer
    appStore.updateBuyer(buyerId, {
      aiPitch: analysis.recommendedPitch,
      matchReasons: analysis.reasons,
    });

    return NextResponse.json(analysis);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
