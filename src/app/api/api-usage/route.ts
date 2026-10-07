import { NextResponse } from 'next/server';
import { getApiLogs, getProviderHealthStatus, getApiTelemetrySummary } from '@/lib/api/telemetry';

export async function GET() {
  try {
    const health = getProviderHealthStatus();
    const logs = getApiLogs(50);
    const summary = getApiTelemetrySummary();

    return NextResponse.json({
      providers: health,
      summary,
      recentLogs: logs,
      systemMode: process.env.USE_MOCK_PROVIDERS === 'true' ? 'DEMO_MOCK_FALLBACK' : 'LIVE_PRODUCTION',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
