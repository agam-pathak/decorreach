import { SendEmailParams, SendEmailResult, EmailDeliveryProviderName } from '@/types/api';
import { EmailProvider } from '../interfaces';
import { MockEmailProvider } from './mock-providers';
import { logApiCall } from '../telemetry';

export class ResendEmailProvider implements EmailProvider {
  name: EmailDeliveryProviderName = 'resend';
  displayName = 'Resend Transactional Email';

  isAvailable(): boolean {
    return !!process.env.RESEND_API_KEY && process.env.USE_MOCK_PROVIDERS !== 'true';
  }

  async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
    const isMock = process.env.USE_MOCK_PROVIDERS === 'true' || !process.env.RESEND_API_KEY;
    if (isMock) {
      return new MockEmailProvider().sendEmail(params);
    }

    const apiKey = process.env.RESEND_API_KEY!;
    const startTime = Date.now();

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: `${params.fromName} <outreach@decorreach.com>`,
          to: [params.to],
          reply_to: params.replyTo,
          subject: params.subject,
          html: params.htmlBody,
          text: params.textBody,
        }),
        signal: AbortSignal.timeout(8000),
      });

      const durationMs = Date.now() - startTime;
      const data = await response.json();

      logApiCall({
        provider: 'resend',
        endpoint: '/emails',
        requestCount: 1,
        durationMs,
        statusCode: response.status,
        status: response.ok ? 'success' : 'error',
      });

      if (!response.ok) {
        throw new Error(data.message || `Resend error: ${response.status}`);
      }

      return {
        success: true,
        messageId: data.id,
        provider: 'resend',
        status: 'sent',
      };
    } catch (err: any) {
      logApiCall({
        provider: 'resend',
        endpoint: '/emails',
        requestCount: 1,
        durationMs: Date.now() - startTime,
        statusCode: 500,
        status: 'error',
        errorMessage: err.message,
      });

      return {
        success: false,
        provider: 'resend',
        status: 'failed',
        error: err.message,
      };
    }
  }
}
