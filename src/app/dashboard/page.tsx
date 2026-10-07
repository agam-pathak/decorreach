'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Users,
  Send,
  MailCheck,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Clock,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { Buyer } from '@/types/buyer';
import { BuyerDetailDrawer } from '@/components/buyers/BuyerDetailDrawer';
import { EmailComposerModal } from '@/components/campaigns/EmailComposerModal';

export default function DashboardPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [composerBuyer, setComposerBuyer] = useState<Buyer | null>(null);

  useEffect(() => {
    fetch('/api/buyers?limit=10')
      .then((res) => res.json())
      .then((data) => {
        if (data.buyers) setBuyers(data.buyers);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Businesses Discovered', value: '1,284', change: '+18% this week', icon: Users, color: 'text-cyan-400' },
    { label: 'Qualified Buyers', value: '342', change: '80%+ Match score', icon: Sparkles, color: 'text-indigo-400' },
    { label: 'Verified Contacts', value: '187', change: 'SMTP Verified', icon: ShieldCheck, color: 'text-emerald-400' },
    { label: 'Outreach Sent', value: '76', change: '94% Deliverability', icon: Send, color: 'text-sky-400' },
    { label: 'Emails Opened', value: '44', change: '58% Open Rate', icon: MailCheck, color: 'text-purple-400' },
    { label: 'Replies Received', value: '14', change: '18% Response Rate', icon: MessageSquare, color: 'text-amber-400' },
  ];

  const recentTimeline = [
    { text: '36 new buyers discovered in California & Texas', time: '12m ago', type: 'discovery' },
    { text: 'Hunter verified 14 retail business emails', time: '1h ago', type: 'verify' },
    { text: 'Oak & Stone Living opened wholesale catalog', time: '3h ago', type: 'open' },
    { text: 'Urban Nest Interiors replied: "Please share price sheet"', time: '5h ago', type: 'reply' },
    { text: 'West Coast Boutiques campaign completed (24 sent)', time: '8h ago', type: 'campaign' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl glass-panel-glow p-6 md:p-8 overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-cyan-500/10 via-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            AI Buyer Intelligence Engine Active
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Good morning, Agam
          </h1>
          <p className="text-slate-300 text-sm md:text-base mt-2 leading-relaxed">
            Your home decor buyer discovery pipeline is actively tracking 1,284 U.S. retail businesses,
            interior design studios, and regional distributors.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Link
              href="/dashboard/find-buyers"
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              Find New Buyers
            </Link>
            <Link
              href="/dashboard/campaigns"
              className="py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors"
            >
              View Active Campaigns
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="rounded-xl glass-panel p-4 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-slate-400 truncate">{s.label}</span>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white tracking-tight block">
                  {s.value}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">{s.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Two-Column Section: Top Opportunities & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: High Match Opportunities */}
        <div className="lg:col-span-2 rounded-2xl glass-panel p-6 border border-slate-800/80">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Recent Buyer Opportunities
              </h3>
              <p className="text-xs text-slate-400">
                Top verified U.S. retailers and studios scored for your home decor catalog.
              </p>
            </div>
            <Link
              href="/dashboard/buyers"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 text-xs">Loading buyer pipeline...</div>
          ) : (
            <div className="space-y-3">
              {buyers.slice(0, 5).map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all flex items-center justify-between gap-4 cursor-pointer"
                  onClick={() => setSelectedBuyer(b)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white truncate">{b.businessName}</span>
                      {b.emailStatus === 'verified' && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="truncate">{b.buyerType}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {b.city}, {b.state}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-base font-extrabold text-emerald-400 block leading-tight">
                        {b.matchScore}
                      </span>
                      <span className="text-[10px] text-slate-500">/100 Match</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setComposerBuyer(b);
                      }}
                      className="p-2 rounded-lg bg-cyan-950 text-cyan-400 hover:bg-cyan-900 border border-cyan-800/60 transition-colors"
                      title="AI Email Outreach"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Recent Activity Timeline */}
        <div className="rounded-2xl glass-panel p-6 border border-slate-800/80 flex flex-col">
          <div className="pb-4 border-b border-slate-800 mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Recent Pipeline Activity
            </h3>
            <p className="text-xs text-slate-400">Live multi-provider sync and outreach events.</p>
          </div>

          <div className="space-y-4 flex-1">
            {recentTimeline.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-slate-200 font-medium leading-relaxed">{item.text}</p>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{item.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4">
            <Link
              href="/dashboard/api-usage"
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center justify-between"
            >
              <span>View API Request Telemetry</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Buyer Detail Drawer */}
      {selectedBuyer && (
        <BuyerDetailDrawer
          buyer={selectedBuyer}
          onClose={() => setSelectedBuyer(null)}
          onAddToCampaign={(b) => {
            setSelectedBuyer(null);
            setComposerBuyer(b);
          }}
          onOpenEmailComposer={(b) => {
            setSelectedBuyer(null);
            setComposerBuyer(b);
          }}
          onVerifyEmail={async (id) => {
            await fetch(`/api/buyers/${id}/verify`, { method: 'POST' });
          }}
        />
      )}

      {/* AI Composer Modal */}
      {composerBuyer && (
        <EmailComposerModal
          buyer={composerBuyer}
          onClose={() => setComposerBuyer(null)}
          onCampaignCreated={() => {
            setComposerBuyer(null);
          }}
        />
      )}
    </div>
  );
}
