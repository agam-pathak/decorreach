import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const eventType = payload.type || payload.event || payload.eventType; // 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed'
    const email = payload.email || payload.recipient || payload.data?.to?.[0];
    const campaignId = payload.campaignId || payload.data?.campaign_id;
    const buyerId = payload.buyerId;

    if (!eventType) {
      return NextResponse.json({ error: 'Missing event type in webhook payload' }, { status: 400 });
    }

    // Handle unsubscribe & bounce by adding to suppression list
    if (eventType === 'unsubscribed' || eventType === 'complaint' || eventType === 'bounced') {
      if (email) {
        appStore.addToSuppression({
          id: `sup_${Date.now()}`,
          userId: 'usr_demo',
          email,
          reason: eventType === 'bounced' ? 'bounced' : 'unsubscribed',
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Update campaign counters if campaignId is present
    if (campaignId) {
      const camp = appStore.getCampaignById(campaignId);
      if (camp) {
        if (eventType === 'delivered') appStore.updateCampaign(campaignId, { deliveredCount: (camp.deliveredCount || 0) + 1 });
        if (eventType === 'opened') appStore.updateCampaign(campaignId, { openedCount: (camp.openedCount || 0) + 1 });
        if (eventType === 'clicked') appStore.updateCampaign(campaignId, { clickedCount: (camp.clickedCount || 0) + 1 });
        if (eventType === 'replied') appStore.updateCampaign(campaignId, { repliedCount: (camp.repliedCount || 0) + 1 });
        if (eventType === 'bounced') appStore.updateCampaign(campaignId, { bouncedCount: (camp.bouncedCount || 0) + 1 });
      }
    }

    // Update buyer pipeline if buyerId or email is matched
    if (buyerId) {
      if (eventType === 'opened') appStore.updateBuyer(buyerId, { pipelineStatus: 'opened' });
      if (eventType === 'replied') appStore.updateBuyer(buyerId, { pipelineStatus: 'replied' });
    }

    return NextResponse.json({
      received: true,
      event: eventType,
      processedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
