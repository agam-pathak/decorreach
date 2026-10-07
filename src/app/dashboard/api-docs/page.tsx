'use client';

import React, { useState } from 'react';
import { BookOpen, Code, Copy, Check, ShieldCheck, ChevronRight } from 'lucide-react';

export default function ApiDocsPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const endpoints = [
    {
      method: 'POST',
      path: '/api/buyers/search',
      title: 'Orchestrated Buyer Discovery Search',
      description: 'Executes multi-provider business search (Google Places, Yelp, Foursquare), deduplication, enrichment, email verification, and match scoring.',
      auth: 'Bearer Token / Session Auth',
      requestBody: `{
  "productName": "Handmade Wooden Wall Decor",
  "productCategory": "Wall Decor",
  "productDescription": "Solid carved teak panels",
  "keywords": ["handmade", "rustic", "sustainable"],
  "country": "United States",
  "states": ["California", "Texas"],
  "buyerTypes": ["Home Decor Store", "Interior Design Studio"],
  "minimumMatchScore": 70,
  "hasWebsite": true
}`,
      responseBody: `{
  "searchId": "search_1728255900",
  "total": 36,
  "qualifiedCount": 28,
  "verifiedEmailCount": 24,
  "providersUsed": ["google_places", "yelp", "apollo", "hunter"],
  "executionTimeMs": 680,
  "buyers": [
    {
      "id": "buyer_1",
      "businessName": "Urban Nest Interiors",
      "matchScore": 94,
      "emailStatus": "verified",
      "buyerType": "Home Decor Store"
    }
  ]
}`,
      errors: ['400 Invalid query parameter schema', '429 Rate limit exceeded', '503 Provider unavailable'],
    },
    {
      method: 'GET',
      path: '/api/buyers',
      title: 'Query Discovered Buyer Repository',
      description: 'Retrieves buyers with state, buyerType, matchScore, and pipeline status filters.',
      auth: 'Session Auth',
      params: '?q=austin&state=Texas&minScore=80&limit=50',
      responseBody: `{
  "total": 24,
  "buyers": [...]
}`,
      errors: ['500 Internal error'],
    },
    {
      method: 'POST',
      path: '/api/buyers/:id/verify',
      title: 'On-Demand Email Verification',
      description: 'Calls Hunter / ZeroBounce SMTP handshake verifier to check deliverability before outreach.',
      auth: 'Session Auth',
      responseBody: `{
  "verification": {
    "email": "partnerships@urbannestinteriors.com",
    "status": "verified",
    "score": 98,
    "provider": "hunter",
    "mxFound": true,
    "smtpCheck": true
  }
}`,
      errors: ['404 Buyer not found', '400 Buyer has no email'],
    },
    {
      method: 'POST',
      path: '/api/buyers/analyze',
      title: 'AI Buyer Relevance & Pitch Generation',
      description: 'Passes seller product catalog and buyer business data to OpenAI/Gemini for structured JSON reasoning.',
      auth: 'Session Auth',
      requestBody: `{
  "buyerId": "buyer_1",
  "product": { "name": "Wooden Wall Art", "category": "Wall Decor" }
}`,
      responseBody: `{
  "matchScore": 92,
  "relevance": "excellent",
  "reasons": ["Sells in the same category", "Active California trade client base"],
  "recommendedPitch": "Emphasize handcrafted wood quality and fast domestic shipping."
}`,
      errors: ['404 Buyer not found'],
    },
    {
      method: 'POST',
      path: '/api/email/generate',
      title: 'AI Cold Outreach Personalizer',
      description: 'Generates non-hallucinatory contextual email copy referencing only verified buyer attributes.',
      auth: 'Session Auth',
      requestBody: `{
  "buyerId": "buyer_1",
  "sellerProduct": { "name": "Handmade Wall Art", "category": "Wall Decor" },
  "sellerProfile": { "sellerName": "Agam Pathak", "companyName": "Heritage Decor" },
  "customTone": "wholesale_direct"
}`,
      responseBody: `{
  "subject": "Wholesale Inquiry: Handcrafted Wall Decor for Urban Nest Interiors",
  "body": "Hi Urban Nest Interiors Team...",
  "confidenceScore": 0.94
}`,
      errors: ['400 Validation error'],
    },
    {
      method: 'POST',
      path: '/api/campaigns',
      title: 'Create Outreach Campaign',
      description: 'Creates a campaign batch, binds selected buyers, and updates their pipeline statuses.',
      auth: 'Session Auth',
      requestBody: `{
  "name": "Fall California Boutiques",
  "subject": "Wholesale Handcrafted Decor Line",
  "senderName": "Agam Pathak",
  "replyTo": "agam@decorreach.com",
  "buyerIds": ["buyer_1", "buyer_2"],
  "dailyLimit": 50
}`,
      responseBody: `{
  "id": "camp_1728256000",
  "status": "scheduled",
  "buyersCount": 2
}`,
      errors: ['400 Missing buyer IDs'],
    },
    {
      method: 'POST',
      path: '/api/campaigns/:id/send',
      title: 'Execute Outreach Campaign Dispatch',
      description: 'Dispatches or simulates campaign emails through transactional provider (Resend / SendGrid / Demo Mode).',
      auth: 'Session Auth',
      responseBody: `{
  "success": true,
  "mode": "DEMO_MODE_SIMULATION",
  "message": "DEMO MODE: Emails simulated successfully without contacting recipients."
}`,
      errors: ['404 Campaign not found'],
    },
    {
      method: 'POST',
      path: '/api/webhooks/email',
      title: 'Email Delivery Webhook Receiver',
      description: 'Ingests delivery, open, click, bounce, and unsubscribe webhook events from Resend/SendGrid and updates suppression list.',
      auth: 'Webhook HMAC Signature Verification',
      requestBody: `{
  "type": "opened",
  "campaignId": "camp_1",
  "buyerId": "buyer_1",
  "email": "buyer@example.com"
}`,
      responseBody: `{ "received": true, "event": "opened" }`,
      errors: ['400 Missing event type', '401 Invalid webhook signature'],
    },
    {
      method: 'GET',
      path: '/api/api-usage',
      title: 'API Health & Latency Telemetry',
      description: 'Returns provider connection statuses, request counts, error rates, and live request buffers.',
      auth: 'Admin / Session Auth',
      responseBody: `{
  "providers": [...],
  "recentLogs": [...],
  "systemMode": "DEMO_MOCK_FALLBACK"
}`,
      errors: ['500 Internal error'],
    },
  ];

  const copyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          Internal REST API Documentation
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Complete REST endpoint specifications, request schemas, response models, and webhook signatures
          powering the DecorReach multi-API discovery engine.
        </p>
      </div>

      <div className="space-y-6">
        {endpoints.map((ep, idx) => (
          <div
            key={idx}
            className="rounded-2xl glass-panel p-6 border border-slate-800/80 space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 font-mono">
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    ep.method === 'POST'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : ep.method === 'GET'
                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                      : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                  }`}
                >
                  {ep.method}
                </span>
                <span className="text-sm font-bold text-white">{ep.path}</span>
                {ep.params && <span className="text-xs text-slate-400">{ep.params}</span>}
              </div>

              <span className="text-[11px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Auth: {ep.auth}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-200">{ep.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{ep.description}</p>
            </div>

            {/* Code Examples */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-mono">
              {ep.requestBody && (
                <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3.5 relative">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-sans font-semibold">
                    <span>Request Body (JSON)</span>
                    <button
                      onClick={() => copyCode(ep.requestBody, idx * 2)}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedIndex === idx * 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <pre className="text-slate-300 text-[11px] overflow-x-auto whitespace-pre">
                    {ep.requestBody}
                  </pre>
                </div>
              )}

              <div className={`rounded-xl bg-slate-950/80 border border-slate-800/80 p-3.5 relative ${!ep.requestBody ? 'lg:col-span-2' : ''}`}>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-sans font-semibold">
                  <span>Response (200 OK)</span>
                  <button
                    onClick={() => copyCode(ep.responseBody, idx * 2 + 1)}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedIndex === idx * 2 + 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <pre className="text-emerald-300 text-[11px] overflow-x-auto whitespace-pre">
                  {ep.responseBody}
                </pre>
              </div>
            </div>

            {/* Error codes */}
            <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
              <span className="font-semibold text-slate-500">Possible Error Responses:</span>
              {ep.errors.map((err, eIdx) => (
                <span
                  key={eIdx}
                  className="px-2 py-0.5 rounded bg-slate-900 text-rose-300 border border-rose-950/50"
                >
                  {err}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
