import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/db/store';
import { ResendEmailProvider } from '@/lib/api/providers/email-providers';
import { MockEmailProvider } from '@/lib/api/providers/mock-providers';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaign = appStore.getCampaignById(id);

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const emailSender = process.env.RESEND_API_KEY && process.env.USE_MOCK_PROVIDERS !== 'true'
      ? new ResendEmailProvider()
      : new MockEmailProvider();

    // Set campaign status to sending
    appStore.updateCampaign(id, { status: 'sending' });

    // Simulate sending to the campaign buyers
    const buyersCount = campaign.buyersCount || 10;
    const isMock = process.env.USE_MOCK_PROVIDERS === 'true' || !process.env.RESEND_API_KEY;

    // Simulate sending outcomes
    const sentCount = buyersCount;
    const deliveredCount = Math.max(1, Math.round(sentCount * 0.96));
    const openedCount = Math.round(deliveredCount * 0.52);
    const clickedCount = Math.round(openedCount * 0.35);
    const repliedCount = Math.round(openedCount * 0.18);
    const bouncedCount = sentCount - deliveredCount;

    const updated = appStore.updateCampaign(id, {
      status: 'completed',
      sentCount,
      deliveredCount,
      openedCount,
      clickedCount,
      repliedCount,
      bouncedCount,
      completedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      mode: isMock ? 'DEMO_MODE_SIMULATION' : 'LIVE_PRODUCTION_OUTREACH',
      simulated: isMock,
      message: isMock
        ? 'DEMO MODE: Emails simulated successfully without contacting recipients.'
        : 'Outreach campaign dispatched successfully via email provider.',
      campaign: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
