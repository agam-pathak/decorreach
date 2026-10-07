import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/db/store';
import { CreateCampaignSchema } from '@/lib/validation';
import { Campaign } from '@/types/campaign';

export async function GET() {
  try {
    const campaigns = appStore.getCampaigns();
    return NextResponse.json(campaigns);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateCampaignSchema.parse(body);

    const newCampaign: Campaign = {
      id: `camp_${Date.now()}`,
      userId: 'usr_demo',
      name: validated.name,
      subject: validated.subject,
      templateId: validated.templateId,
      status: 'scheduled',
      senderName: validated.senderName,
      replyTo: validated.replyTo,
      personalizationEnabled: validated.personalizationEnabled,
      dailyLimit: validated.dailyLimit,
      buyersCount: validated.buyerIds.length,
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      repliedCount: 0,
      bouncedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = appStore.createCampaign(newCampaign);

    // Update selected buyers pipeline status to 'added_to_campaign'
    for (const buyerId of validated.buyerIds) {
      appStore.updateBuyer(buyerId, {
        pipelineStatus: 'added_to_campaign',
      });
    }

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
