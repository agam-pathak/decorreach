import { NextRequest, NextResponse } from 'next/server';
import { SendTestEmailSchema } from '@/lib/validation';
import { ResendEmailProvider } from '@/lib/api/providers/email-providers';
import { MockEmailProvider } from '@/lib/api/providers/mock-providers';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = SendTestEmailSchema.parse(json);

    const isMock = process.env.USE_MOCK_PROVIDERS === 'true' || !process.env.RESEND_API_KEY;
    const provider = isMock ? new MockEmailProvider() : new ResendEmailProvider();

    const result = await provider.sendEmail({
      to: validated.recipientEmail,
      subject: `[TEST] ${validated.subject}`,
      htmlBody: `<p style="font-family: sans-serif; white-space: pre-wrap;">${validated.body}</p>`,
      fromName: validated.senderName,
      replyTo: validated.replyTo,
      isTest: true,
    });

    return NextResponse.json({
      success: true,
      mode: isMock ? 'DEMO_MODE' : 'LIVE',
      message: isMock
        ? `DEMO MODE: Test email simulated successfully for ${validated.recipientEmail}. No actual email dispatched.`
        : `Test email sent to ${validated.recipientEmail}`,
      details: result,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
