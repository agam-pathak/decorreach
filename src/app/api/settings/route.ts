import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/db/store';

export async function GET() {
  try {
    const profile = appStore.getSellerProfile();
    const suppressionList = appStore.getSuppressionList();

    return NextResponse.json({
      sellerProfile: profile,
      suppressionList,
      safetySettings: {
        dailyLimit: 50,
        optOutFooter: true,
        duplicateSuppression: true,
        requireVerification: true,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.sellerProfile) {
      appStore.updateSellerProfile(body.sellerProfile);
    }
    if (body.newSuppressionEmail) {
      appStore.addToSuppression({
        id: `sup_${Date.now()}`,
        userId: 'usr_demo',
        email: body.newSuppressionEmail,
        reason: 'manual',
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, profile: appStore.getSellerProfile() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
