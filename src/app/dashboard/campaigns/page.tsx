'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  Plus,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  MailCheck,
  Eye,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Campaign } from '@/types/campaign';
import confetti from 'canvas-confetti';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      if (Array.isArray(data)) setCampaigns(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleLaunchCampaign = async (id: string) => {
    setDispatchingId(id);
    setFeedback(null);
    try {
      const res = await fetch(`/api/campaigns/${id}/send`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        setFeedback(data.message || 'Campaign sent successfully!');
        fetchCampaigns();
      }
    } catch {
      setFeedback('Failed to execute outreach campaign.');
    } finally {
      setDispatchingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Send className="w-6 h-6 text-cyan-400" />
            Outreach Campaigns
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Personalized wholesale email sequences sent to verified U.S. home decor buyers.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Campaigns Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">Loading campaigns...</div>
      ) : campaigns.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-panel border border-slate-800 space-y-3">
          <p className="text-slate-300 text-sm font-semibold">No active campaigns yet.</p>
          <p className="text-slate-500 text-xs">
            Head over to Find Buyers, select target accounts, and initiate a personalized campaign.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((c) => {
            const isCompleted = c.status === 'completed';
            const isSending = c.status === 'sending';

            const statusPill = isCompleted
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
              : isSending
              ? 'bg-cyan-950 text-cyan-400 border-cyan-800 animate-pulse'
              : 'bg-indigo-950 text-indigo-400 border-indigo-800';

            const openRate = c.deliveredCount && c.deliveredCount > 0
              ? Math.round(((c.openedCount || 0) / c.deliveredCount) * 100)
              : 0;

            const replyRate = c.deliveredCount && c.deliveredCount > 0
              ? Math.round(((c.repliedCount || 0) / c.deliveredCount) * 100)
              : 0;

            return (
              <div
                key={c.id}
                className="rounded-2xl glass-panel p-6 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${statusPill}`}>
                      {c.status}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Daily Limit: {c.dailyLimit}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">{c.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
                    Subject: &ldquo;{c.subject}&rdquo;
                  </p>

                  <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-3">
                    <span>Sender: {c.senderName}</span>
                    <span>•</span>
                    <span>Reply: {c.replyTo}</span>
                  </div>
                </div>

                {/* Metrics Matrix */}
                <div className="my-6 grid grid-cols-3 gap-2.5 pt-4 border-t border-slate-800/80 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <span className="text-base font-extrabold text-white block">{c.sentCount || 0}</span>
                    <span className="text-[10px] text-slate-400">Sent / {c.buyersCount || 0}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <span className="text-base font-extrabold text-cyan-400 block">{openRate}%</span>
                    <span className="text-[10px] text-slate-400">Open Rate ({c.openedCount || 0})</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <span className="text-base font-extrabold text-emerald-400 block">{replyRate}%</span>
                    <span className="text-[10px] text-slate-400">Reply Rate ({c.repliedCount || 0})</span>
                  </div>
                </div>

                {/* Action footer */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {c.personalizationEnabled ? 'AI Personalized Context' : 'Static Template'}
                  </span>

                  {!isCompleted ? (
                    <button
                      onClick={() => handleLaunchCampaign(c.id)}
                      disabled={dispatchingId === c.id}
                      className="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-950 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Play className="w-3 h-3" />
                      {dispatchingId === c.id ? 'Dispatching...' : 'Launch Sequence'}
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Fully Dispatched
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
