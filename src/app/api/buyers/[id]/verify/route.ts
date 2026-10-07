import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/db/store';
import { HunterProvider } from '@/lib/api/providers/apollo-hunter';
import { MockVerificationProvider } from '@/lib/api/providers/mock-providers';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const buyer = appStore.getBuyerById(id);

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    if (!buyer.businessEmail) {
      return NextResponse.json({ error: 'Buyer does not have an email address to verify' }, { status: 400 });
    }

    const verifier = process.env.HUNTER_API_KEY ? new HunterProvider() : new MockVerificationProvider();
    const result = await verifier.verify(buyer.businessEmail);

    const updated = appStore.updateBuyer(id, {
      emailStatus: result.status,
      verificationDetails: {
        score: result.score,
        provider: result.provider,
        mxFound: result.mxFound,
        smtpCheck: result.smtpCheck,
        disposable: result.disposable,
        statusText: result.details,
      },
      pipelineStatus: result.status === 'verified' ? 'contact_verified' : buyer.pipelineStatus,
    });

    return NextResponse.json({
      verification: result,
      buyer: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
