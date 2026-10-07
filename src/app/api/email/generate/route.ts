import { NextRequest, NextResponse } from 'next/server';
import { GenerateEmailSchema } from '@/lib/validation';
import { appStore } from '@/lib/db/store';
import { OpenAIAIProvider } from '@/lib/api/providers/ai-providers';
import { MockAIProvider } from '@/lib/api/providers/mock-providers';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = GenerateEmailSchema.parse(json);

    const buyer = appStore.getBuyerById(validated.buyerId);
    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    const ai = process.env.OPENAI_API_KEY ? new OpenAIAIProvider() : new MockAIProvider();

    const result = await ai.generatePersonalizedEmail({
      sellerProduct: validated.sellerProduct,
      sellerProfile: validated.sellerProfile,
      buyer,
      customTone: validated.customTone,
    });

    return NextResponse.json({
      buyerId: buyer.id,
      buyerName: buyer.businessName,
      recipientEmail: buyer.businessEmail,
      emailStatus: buyer.emailStatus,
      ...result,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
