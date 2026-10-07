'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  Send,
  BarChart3,
  CheckCircle2,
  Building2,
  ArrowRight,
  MapPin,
  Cpu,
  Layers,
  ChevronRight,
  ExternalLink,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  const supportedCategories = [
    { title: 'Home Decor Retailers', count: '14,200+ U.S. Stores', desc: 'Independent brick-and-mortar decor stores seeking distinctive inventory.' },
    { title: 'Interior Design Studios', count: '28,000+ Studios', desc: 'Practices specifying bespoke wall art, lighting, and artisanal furniture.' },
    { title: 'Furniture Stores', count: '9,800+ Showrooms', desc: 'Regional and high-end furniture retailers with dedicated decor departments.' },
    { title: 'Gift & Lifestyle Boutiques', count: '31,500+ Boutiques', desc: 'Curated lifestyle shops featuring handcrafted goods, candles, and tabletop.' },
    { title: 'Home Staging Companies', count: '6,400+ Stagers', desc: 'Real estate furnishing companies buying art, mirrors, and accents in volume.' },
    { title: 'Hospitality & Hotels', count: '4,100+ Properties', desc: 'Boutique hotels and upscale resorts sourcing commercial-grade artisan decor.' },
    { title: 'Wholesale Distributors', count: '1,800+ Importers', desc: 'B2B distribution houses connecting global exporters to retail store networks.' },
    { title: 'E-commerce Marketplaces', count: '5,200+ DTC Brands', desc: 'Digital retailers actively expanding dropship and wholesale collections.' },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <nav className="h-20 border-b border-slate-800/80 bg-[#080c14]/80 backdrop-blur-md sticky top-0 z-50 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-cyan-950/60 text-lg">
            D
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white block">DecorReach</span>
            <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase block">
              U.S. Buyer Discovery Platform
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">
            How It Works
          </a>
          <a href="#api-engine" className="hover:text-cyan-400 transition-colors">
            API Architecture
          </a>
          <a href="#scoring" className="hover:text-cyan-400 transition-colors">
            Buyer Match Score
          </a>
          <a href="#categories" className="hover:text-cyan-400 transition-colors">
            Target Categories
          </a>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 transition-colors"
          >
            Sign Up
          </Link>
          <Link
            href="/dashboard"
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-950/50 transition-all"
          >
            <Compass className="w-3.5 h-3.5" />
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-28 px-6 md:px-12 max-w-6xl mx-auto text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/15 to-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>API-Driven B2B Discovery Platform for U.S. Home Decor Sellers</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Turn Your Home Decor Products Into{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            New U.S. Buyer Opportunities.
          </span>
        </h1>

        <p className="text-slate-300 text-base md:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
          Discover relevant retailers, designers, distributors and businesses across the United States
          using API-powered buyer discovery and reach them with personalized outreach.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link
            href="/dashboard/find-buyers"
            className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-cyan-950/70 transition-all cursor-pointer"
          >
            Find Buyers
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#how-it-works"
            className="py-3.5 px-6 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-800 transition-colors"
          >
            See How It Works
          </a>
        </div>

        {/* Live Metrics Trust Bar */}
        <div className="mt-16 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-3xl font-extrabold text-white block">35,000+</span>
            <span className="text-xs text-slate-400 mt-1 block">U.S. Commercial Buyers Mapped</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-cyan-400 block">5+ APIs</span>
            <span className="text-xs text-slate-400 mt-1 block">Places, Data, Enrichment & LLM</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-emerald-400 block">0-100</span>
            <span className="text-xs text-slate-400 mt-1 block">Multi-Factor Match Score</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-indigo-400 block">100% CAN-SPAM</span>
            <span className="text-xs text-slate-400 mt-1 block">Compliant B2B Outreach Controls</span>
          </div>
        </div>
      </header>

      {/* Section 1: How It Works */}
      <section id="how-it-works" className="py-20 px-6 md:px-12 bg-slate-950/40 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 block mb-2">
              End-To-End Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              From Product Specs to Verified U.S. Buyer Conversations
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-2">
              A systematic multi-provider pipeline that collects, normalizes, scores, and initiates cold outreach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Enter Product & Market',
                desc: 'Specify your decor category (wall art, rugs, mirrors, wooden decor) and target U.S. states.',
              },
              {
                step: '02',
                title: 'Multi-API Discovery',
                desc: 'Backend calls Google Places, Yelp, and Foursquare to discover verified commercial businesses.',
              },
              {
                step: '03',
                title: 'Enrich & Score (0-100)',
                desc: 'Apollo and Hunter verify corporate emails; our scoring engine ranks buyers by relevance.',
              },
              {
                step: '04',
                title: 'AI Personalized Outreach',
                desc: 'AI drafts contextual cold emails referencing only verified business facts, never hallucinating.',
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="rounded-2xl glass-panel p-6 border border-slate-800/80 relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-cyan-400/80 font-mono block mb-3">{s.step}</span>
                  <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: API Architecture Engine */}
      <section id="api-engine" className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 block mb-2">
              API Web Development Internship Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Orchestrating Multiple External APIs Without Hard Coupling
            </h2>
            <p className="text-slate-300 text-sm mt-4 leading-relaxed">
              DecorReach was built from the ground up as a production API integration system. It utilizes
              provider adapter interfaces, allowing seamless swapping of discovery providers, enrichment
              services, and AI models without touching business logic.
            </p>

            <div className="space-y-3 mt-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Parallel calls to Google Places, Yelp Fusion, and Foursquare</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Entity resolution, Levenshtein distance, and geographic coordinate deduplication</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>SMTP handshake email deliverability validation (ZeroBounce / Hunter)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Strict JSON schema AI extraction (OpenAI GPT-4o / Gemini)</span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/dashboard/api-docs"
                className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:underline"
              >
                <span>Explore Full REST Endpoint Documentation</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Architecture Box */}
          <div className="rounded-2xl glass-panel-glow p-6 border border-cyan-500/20 bg-slate-950/80 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 font-sans">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" /> Multi-Provider Pipeline Architecture
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                Resilient Fallback
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 text-[11px]">
              <span className="text-cyan-400 font-bold block">1. Discovery Layer (Parallel Search)</span>
              <p className="text-slate-400">
                ├── Google Places API (Text search & geocodes)<br />
                ├── Yelp Fusion API (B2B categorization & reviews)<br />
                └── Foursquare Places API v3 (Commercial venue data)
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 text-[11px]">
              <span className="text-indigo-400 font-bold block">2. Normalization & Deduplication</span>
              <p className="text-slate-400">
                ├── Normalize legal suffixes (LLC, Inc, Corp)<br />
                ├── Domain root extraction (www.domain.com/shop → domain.com)<br />
                └── Geographic cluster distance (&lt;250m threshold)
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 text-[11px]">
              <span className="text-emerald-400 font-bold block">3. Enrichment & Delivery</span>
              <p className="text-slate-400">
                ├── Apollo / Clearbit (Company headcount & socials)<br />
                ├── Hunter / ZeroBounce (SMTP deliverability check)<br />
                └── Resend / SendGrid (Transactional outreach + webhooks)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Buyer Match Score Showcase */}
      <section id="scoring" className="py-20 px-6 md:px-12 bg-slate-950/40 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 block mb-2">
              Relevance Algorithm
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              100-Point Buyer Match Score
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-2">
              Every discovered business is evaluated across 8 weighted criteria to eliminate low-quality leads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl glass-panel p-6 border border-emerald-500/30 bg-emerald-950/10">
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl font-black text-emerald-400">94/100</span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Excellent Match
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Urban Nest Interiors</h3>
              <p className="text-xs text-slate-400 mt-1">Austin, Texas • Home Decor Store</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct catalog focus in handcrafted wall decor</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3 physical store locations in high-income retail districts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified procurement inbox ready for catalog send</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl glass-panel p-6 border border-cyan-500/30 bg-cyan-950/10">
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl font-black text-cyan-400">82/100</span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Strong Match
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Oak & Stone Living</h3>
              <p className="text-xs text-slate-400 mt-1">Los Angeles, CA • Furniture & Decor</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Complementary organic modern styling</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Active trade sourcing program for overseas craft</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Verified website domain and corporate phone</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl glass-panel p-6 border border-slate-800 bg-slate-900/40">
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl font-black text-amber-400">67/100</span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  Potential Match
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Modern Habitat Studio</h3>
              <p className="text-xs text-slate-400 mt-1">New York, NY • Interior Design Studio</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>High aesthetic alignment on luxury residential spaces</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lower order frequency than traditional retailers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Target Buyer Categories Grid */}
      <section id="categories" className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 block mb-2">
            Broad Coverage
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Supported U.S. Buyer Categories
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-2">
            Target independent retailers, hospitality design firms, and distributors looking for home decor manufacturers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportedCategories.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl glass-panel p-5 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-semibold text-cyan-400 block mb-1">
                  {c.count}
                </span>
                <h3 className="text-base font-bold text-white mb-1.5">{c.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Big SaaS CTA Section */}
      <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl glass-panel-glow p-10 md:p-14 border border-cyan-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-indigo-600/15 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Ready to Expand Your U.S. Wholesale Reach?
            </h2>
            <p className="text-slate-300 text-sm md:text-base mt-4 leading-relaxed">
              Find qualified boutique retailers, interior designers, and distributors in under 60 seconds
              using our multi-API buyer intelligence engine.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/dashboard/find-buyers"
                className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-cyan-950 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                Find My First Buyers
              </Link>
              <Link
                href="/dashboard"
                className="py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-semibold border border-slate-800 transition-colors"
              >
                Open Demo Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 px-6 md:px-12 border-t border-slate-800/80 bg-slate-950/80 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-600 flex items-center justify-center font-bold text-white text-xs">
            D
          </div>
          <span className="font-bold text-slate-300">DecorReach</span>
          <span>• Find the right U.S. buyers. Reach them faster.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/dashboard/api-docs" className="hover:text-cyan-400">
            API Documentation
          </Link>
          <Link href="/dashboard/api-usage" className="hover:text-cyan-400">
            Telemetry & Health
          </Link>
          <Link href="/dashboard/settings" className="hover:text-cyan-400">
            Compliance & Privacy
          </Link>
        </div>
      </footer>
    </div>
  );
}
