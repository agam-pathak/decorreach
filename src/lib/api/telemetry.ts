import { ApiUsageRecord, ProviderHealth } from '@/types/api';

// In-memory ring buffer of recent API logs (and persistent to DB when available)
const MAX_LOGS = 1000;
const globalLogs: ApiUsageRecord[] = [];

export function logApiCall(record: Omit<ApiUsageRecord, 'id' | 'timestamp'>): ApiUsageRecord {
  const fullRecord: ApiUsageRecord = {
    ...record,
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  globalLogs.unshift(fullRecord);
  if (globalLogs.length > MAX_LOGS) {
    globalLogs.pop();
  }

  return fullRecord;
}

export function getApiLogs(limit = 100): ApiUsageRecord[] {
  return globalLogs.slice(0, limit);
}

export function getApiTelemetrySummary() {
  const providers: Record<
    string,
    {
      total: number;
      success: number;
      failed: number;
      rateLimited: number;
      totalDurationMs: number;
      lastUsed?: string;
    }
  > = {};

  for (const log of globalLogs) {
    if (!providers[log.provider]) {
      providers[log.provider] = {
        total: 0,
        success: 0,
        failed: 0,
        rateLimited: 0,
        totalDurationMs: 0,
      };
    }
    const p = providers[log.provider];
    p.total += log.requestCount || 1;
    if (log.status === 'success' || log.status === 'cached') p.success += 1;
    if (log.status === 'error') p.failed += 1;
    if (log.status === 'rate_limited') p.rateLimited += 1;
    p.totalDurationMs += log.durationMs || 0;
    if (!p.lastUsed) p.lastUsed = log.timestamp;
  }

  return providers;
}

export function getProviderHealthStatus(): ProviderHealth[] {
  const useMock = process.env.USE_MOCK_PROVIDERS === 'true' || !process.env.GOOGLE_MAPS_API_KEY;
  const telemetry = getApiTelemetrySummary();

  const providersConfig = [
    {
      name: 'google_places',
      displayName: 'Google Places API',
      type: 'business' as const,
      requiresKey: 'GOOGLE_MAPS_API_KEY',
      hasKey: !!process.env.GOOGLE_MAPS_API_KEY,
    },
    {
      name: 'yelp',
      displayName: 'Yelp Fusion API',
      type: 'business' as const,
      requiresKey: 'YELP_API_KEY',
      hasKey: !!process.env.YELP_API_KEY,
    },
    {
      name: 'foursquare',
      displayName: 'Foursquare Places API',
      type: 'business' as const,
      requiresKey: 'FOURSQUARE_API_KEY',
      hasKey: !!process.env.FOURSQUARE_API_KEY,
    },
    {
      name: 'apollo',
      displayName: 'Apollo.io Enrichment API',
      type: 'enrichment' as const,
      requiresKey: 'APOLLO_API_KEY',
      hasKey: !!process.env.APOLLO_API_KEY,
    },
    {
      name: 'hunter',
      displayName: 'Hunter.io Email & Verify',
      type: 'verification' as const,
      requiresKey: 'HUNTER_API_KEY',
      hasKey: !!process.env.HUNTER_API_KEY,
    },
    {
      name: 'zerobounce',
      displayName: 'ZeroBounce Verification API',
      type: 'verification' as const,
      requiresKey: 'ZEROBOUNCE_API_KEY',
      hasKey: !!process.env.ZEROBOUNCE_API_KEY,
    },
    {
      name: 'openai',
      displayName: 'OpenAI GPT-4o Intelligence',
      type: 'ai' as const,
      requiresKey: 'OPENAI_API_KEY',
      hasKey: !!process.env.OPENAI_API_KEY,
    },
    {
      name: 'gemini',
      displayName: 'Google Gemini 1.5 Pro',
      type: 'ai' as const,
      requiresKey: 'GEMINI_API_KEY',
      hasKey: !!process.env.GEMINI_API_KEY,
    },
    {
      name: 'groq',
      displayName: 'Groq Llama 3 Fast Inference',
      type: 'ai' as const,
      requiresKey: 'GROQ_API_KEY',
      hasKey: !!process.env.GROQ_API_KEY,
    },
    {
      name: 'resend',
      displayName: 'Resend Transactional Email',
      type: 'email' as const,
      requiresKey: 'RESEND_API_KEY',
      hasKey: !!process.env.RESEND_API_KEY,
    },
    {
      name: 'sendgrid',
      displayName: 'SendGrid Email API',
      type: 'email' as const,
      requiresKey: 'SENDGRID_API_KEY',
      hasKey: !!process.env.SENDGRID_API_KEY,
    },
  ];

  return providersConfig.map((p) => {
    const stats = telemetry[p.name] || { total: 0, success: 0, failed: 0, totalDurationMs: 0 };
    const successRate = stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 100;
    const avgLatencyMs = stats.total > 0 ? Math.round(stats.totalDurationMs / stats.total) : 45;

    let status: 'connected' | 'configured' | 'mock_active' | 'error' = 'mock_active';
    if (p.hasKey) {
      status = stats.failed > stats.success && stats.total > 2 ? 'error' : 'connected';
    } else if (useMock) {
      status = 'mock_active';
    }

    return {
      name: p.name,
      displayName: p.displayName,
      type: p.type,
      status,
      requestCount: stats.total,
      successRate,
      avgLatencyMs,
      requiresKey: p.requiresKey,
      isMockFallback: !p.hasKey && useMock,
    };
  });
}
