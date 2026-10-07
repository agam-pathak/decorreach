# DecorReach

> **"Find the right U.S. buyers. Reach them faster."**

DecorReach is a production-ready, full-stack B2B Buyer Discovery & AI Email Outreach SaaS platform tailored for manufacturers, exporters, and sellers of home decor products (wall art, mirrors, handcrafted wooden decor, lighting, rugs, ceramics, and furniture) targeting commercial buyers in the United States.

This project was built to demonstrate **advanced multi-API integration, data normalization, entity deduplication, relevance scoring, AI personalization, and telemetry monitoring** for an API Web Development internship.

---

## 1. System Architecture & Multi-API Flow

DecorReach decouples business logic from external third-party APIs using a modular **Provider Pattern** with automatic fallbacks and circuit breakers.

```text
                               Seller Search Request
                                        │
                                        ▼
                         Search Query Intelligence Engine
                           (Semantic Query Expansion)
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                          ▼                          ▼
     Google Places API           Yelp Fusion API          Foursquare Places API
   (Maps & Text Search)        (B2B Business Search)       (Commercial Places)
             │                          │                          │
             └──────────────────────────┼──────────────────────────┘
                                        ▼
                           Normalization Adapter Layer
                        (Unified RawBusiness DTO format)
                                        │
                                        ▼
                           Entity Deduplication Engine
                     (Normalized Name, Domain, Phone, Address,
                      Levenshtein Similarity & Coordinates)
                                        │
                                        ▼
                           Company Enrichment Adapter
                          (Apollo.io / Hunter / Clearbit)
                                        │
                                        ▼
                           Email Verification Adapter
                        (ZeroBounce / Hunter SMTP Check)
                                        │
                                        ▼
                           Buyer Match Scoring Engine
                         (0-100 Weighted Score Formula)
                                        │
                                        ▼
                         AI Cold Outreach Personalizer
                          (OpenAI GPT-4o / Gemini / Groq)
                                        │
                                        ▼
                           Email Delivery Provider
                        (Resend / SendGrid / Demo Mode)
                                        │
                                        ▼
                          Webhook Telemetry & CRM Sync
                         (Delivery, Opens, Replies, Opt-Outs)
```

---

## 2. Key Features

- **Multi-API Orchestration**: Parallel querying of Google Places, Yelp Fusion, and Foursquare with graceful failover.
- **Intelligent Deduplication**: Resolves duplicate listings across providers by stripping corporate suffixes (`LLC`, `Inc`, `Corp`), extracting root domains, comparing E.164 phone numbers, and performing geospatial cluster proximity checks (<250m).
- **100-Point Buyer Match Score**:
  - Category relevance (25 pts)
  - Product relevance & keyword overlap (20 pts)
  - Location relevance (15 pts)
  - Buyer type relevance (15 pts)
  - Business quality & multi-provider presence (10 pts)
  - Website presence (5 pts)
  - Contact availability (5 pts)
  - Email verification (5 pts)
- **Interactive U.S. Map & List Views**: Dual toggle between a responsive data table and an interactive SVG map of the United States with visual pin clusters and quick preview drawers.
- **AI Cold Outreach Generator**: Crafts non-hallucinatory, personalized cold outreach emails referencing only verified buyer attributes (no invented claims). Supports adjustable tones (`wholesale_direct`, `executive`, `friendly`).
- **Interactive Buyer CRM & Pipeline**: Discovered → Qualified → Contact Verified → In Campaign → Contacted → Opened → Replied → Customer.
- **Live API Telemetry Dashboard**: Real-time monitoring of provider requests, latencies, success rates, status codes, and outbound request audit logs.
- **CAN-SPAM & Safety Shield**: Daily sending limits, duplicate recipient suppression, automated unsubscribe footer generation, and suppression list enforcement.
- **Turnkey Mock Mode**: `USE_MOCK_PROVIDERS=true` allows full demonstration with 36+ realistic U.S. businesses across 16 states without paid API subscriptions or credit cards.

---

## 3. Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Lucide Icons, Framer Motion, Recharts, Canvas-Confetti
- **Backend**: Next.js Route Handlers, Server Actions, Zod Schema Validation
- **Database & Auth**: Supabase (PostgreSQL with RLS policies) + Hybrid local persistent storage fallback
- **Business Discovery APIs**: Google Places API, Yelp Fusion API, Foursquare Places API
- **Enrichment & Verification APIs**: Apollo.io API, Hunter.io API, ZeroBounce API
- **AI Intelligence APIs**: OpenAI (GPT-4o), Google Gemini, Groq
- **Email Delivery APIs**: Resend API, SendGrid API
- **Testing**: Native TS test suite with `tsx` (`npm test`)

---

## 4. Environment Variables (`.env.example`)

Create a `.env.local` file in the project root:

```env
# Mode Configuration
NODE_ENV=development
USE_MOCK_PROVIDERS=true
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (PostgreSQL & Auth)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Business Discovery Providers
GOOGLE_MAPS_API_KEY=
YELP_API_KEY=
FOURSQUARE_API_KEY=

# Business Data & Enrichment Providers
APOLLO_API_KEY=
HUNTER_API_KEY=

# Email Verification Providers
EMAIL_VERIFICATION_API_KEY=
ZEROBOUNCE_API_KEY=

# Email Delivery Providers
RESEND_API_KEY=
SENDGRID_API_KEY=

# AI Inference Providers
OPENAI_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
```

---

## 5. Getting Started Locally

### Prerequisites
- Node.js 18+ (tested on Node v22)
- npm 9+

### Installation & Launch

```bash
# 1. Clone repository & enter folder
cd decorreach

# 2. Install dependencies
npm install

# 3. Run automated test suite
npm test

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Database Setup (Supabase PostgreSQL)

When connecting to Supabase:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor**.
3. Run the complete migration schema located at `supabase/schema.sql`.
4. Copy your project URL, anon key, and service role key into `.env.local`.

> **Note**: If Supabase credentials are not provided, DecorReach automatically operates with a persistent local JSON store (`.decorreach_store.json`), allowing instant full-stack testing out-of-the-box!

---

## 7. Mock Mode & Demo Email Shield

When `USE_MOCK_PROVIDERS=true`:
- The application uses 36+ authentic U.S. home decor businesses across California, Texas, New York, Florida, Washington, and North Carolina.
- Real emails are **never dispatched** to external recipients.
- Outbound sends are simulated with celebratory animations and logged in campaign analytics as `DEMO_MODE_SIMULATION`.

---

## 8. REST Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/buyers/search` | Multi-provider discovery, deduplication, enrichment & scoring |
| `GET` | `/api/buyers` | Search and filter discovered U.S. buyer accounts |
| `GET` | `/api/buyers/:id` | Fetch detailed buyer dossier |
| `PATCH` | `/api/buyers/:id` | Update pipeline status, notes, or tags |
| `POST` | `/api/buyers/:id/verify` | On-demand SMTP email deliverability verification |
| `POST` | `/api/buyers/analyze` | AI buyer fit analysis & custom sales pitch generation |
| `POST` | `/api/email/generate` | AI non-hallucinatory personalized cold email drafting |
| `POST` | `/api/email/send-test` | Safe test email dispatch |
| `POST` | `/api/campaigns` | Create an outreach campaign batch |
| `POST` | `/api/campaigns/:id/send` | Execute campaign send sequence |
| `GET` | `/api/analytics` | Aggregated delivery, open, and response rate analytics |
| `GET` | `/api/api-usage` | Latency, provider health, and live request audit log |
| `POST` | `/api/webhooks/email` | Ingests delivery, open, click, bounce, and opt-out webhooks |

---

## 9. Security & Compliance

- **Server-Side Credential Storage**: Private API keys and service roles are strictly kept in Node.js server runtimes.
- **CAN-SPAM Compliance**: All generated outreach includes automated 1-click unsubscribe footers and physical mailing details.
- **Suppression Registry**: Opt-outs, bounces, and manual suppressions are immediately added to the suppression list to prevent future contact.
- **Rate Limiting & Throttle Guards**: Outbound campaign sending is limited by configurable daily caps to protect sender reputation.
