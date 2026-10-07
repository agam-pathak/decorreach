'use client';

import React, { useState } from 'react';
import { Buyer } from '@/types/buyer';
import {
  X,
  Sparkles,
  Send,
  RefreshCw,
  Mail,
  CheckCircle2,
  AlertCircle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmailComposerModalProps {
  buyer: Buyer;
  onClose: () => void;
  onCampaignCreated?: () => void;
}

export function EmailComposerModal({ buyer, onClose, onCampaignCreated }: EmailComposerModalProps) {
  const [tone, setTone] = useState<'wholesale_direct' | 'executive' | 'friendly'>('wholesale_direct');
  const [subject, setSubject] = useState(
    `Wholesale Partnership: Handcrafted Decor Line for ${buyer.businessName}`
  );
  const [body, setBody] = useState(
    `Hi ${buyer.businessName} Team,\n\nI came across ${buyer.businessName} and noticed your exceptional focus on curated home furnishings in ${buyer.city || 'your area'}.\n\nWe manufacture handcrafted wooden wall decor and artisanal home accents designed specifically for boutique retailers and interior design studios.\n\nOur collections feature sustainably sourced solid timbers, competitive wholesale margins, and reliable U.S. fulfillment.\n\nWould you be open to reviewing our Fall 2026 digital wholesale catalog and pricing sheet this week?\n\nBest regards,\nAgam Pathak\nHeritage Decor Exporters\nhttps://heritagedecor.com`
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('agam@decorreach.com');
  const [sendFeedback, setSendFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setSendFeedback(null);
    try {
      const res = await fetch('/api/email/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: buyer.id,
          sellerProduct: {
            name: 'Handcrafted Wooden Wall Decor',
            category: 'Wall Decor',
            description: 'Hand-carved solid teak and oak decorative wall art panels with organic minimalist motifs.',
          },
          sellerProfile: {
            sellerName: 'Agam Pathak',
            companyName: 'Heritage Decor Exporters',
            website: 'https://heritagedecor.com',
          },
          customTone: tone,
        }),
      });

      const data = await res.json();
      if (res.ok && data.subject && data.body) {
        setSubject(data.subject);
        setBody(data.body);
      }
    } catch {
      // Keep existing draft if network error
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendTest = async () => {
    setIsSending(true);
    setSendFeedback(null);
    try {
      const res = await fetch('/api/email/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: testEmailAddress,
          subject,
          body,
          senderName: 'Agam Pathak',
          replyTo: 'agam@decorreach.com',
        }),
      });
      const data = await res.json();
      setSendFeedback({
        success: true,
        message: data.message || 'Test email dispatched successfully.',
      });
    } catch {
      setSendFeedback({
        success: false,
        message: 'Failed to dispatch test email.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendCampaign = async () => {
    setIsSending(true);
    setSendFeedback(null);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Direct Outreach to ${buyer.businessName}`,
          subject,
          senderName: 'Agam Pathak',
          replyTo: 'agam@decorreach.com',
          personalizationEnabled: true,
          dailyLimit: 50,
          buyerIds: [buyer.id],
          customBody: body,
        }),
      });

      const campaign = await res.json();
      if (res.ok && campaign.id) {
        // Execute send simulation
        await fetch(`/api/campaigns/${campaign.id}/send`, { method: 'POST' });
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
        setSendFeedback({
          success: true,
          message: `DEMO MODE: Email simulated successfully for ${buyer.businessName} (${buyer.businessEmail || 'verified address'}). Outreach logged in CRM pipeline!`,
        });
        if (onCampaignCreated) onCampaignCreated();
      }
    } catch {
      setSendFeedback({
        success: false,
        message: 'Error sending campaign.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                AI Email Outreach
              </span>
              <span className="text-xs text-slate-400">Target: {buyer.businessName}</span>
            </div>
            <h3 className="text-lg font-bold text-white">Compose Personalized Cold Pitch</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tone & AI Actions bar */}
        <div className="py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Tone:</span>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="wholesale_direct">Wholesale Direct (High ROI)</option>
              <option value="executive">Executive & Polished</option>
              <option value="friendly">Artisan / Boutique Friendly</option>
            </select>
          </div>

          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 text-indigo-200 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Drafting with AI...' : 'Regenerate with AI'}
          </button>
        </div>

        {/* Email Form */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
          {/* TO field */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="font-semibold text-slate-400 w-16">TO:</span>
            <div className="flex items-center gap-2 flex-1">
              <span className="font-mono text-cyan-300">
                {buyer.businessEmail || `purchasing@${buyer.domain || 'business.com'}`}
              </span>
              {buyer.emailStatus === 'verified' && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-800 font-semibold">
                  Verified Contact
                </span>
              )}
            </div>
          </div>

          {/* SUBJECT */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-400 block">SUBJECT LINE:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-medium text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* BODY */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-400 block">MESSAGE BODY:</label>
            <textarea
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 font-sans text-xs leading-relaxed focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Variables helper */}
          <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Personalization tags:</span>
            <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">{'{{businessName}}'}</code>
            <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">{'{{city}}'}</code>
            <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">{'{{buyerType}}'}</code>
            <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">{'{{companyName}}'}</code>
          </div>

          {/* Feedback banner */}
          {sendFeedback && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                sendFeedback.success
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
              }`}
            >
              {sendFeedback.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{sendFeedback.message}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <input
              type="email"
              value={testEmailAddress}
              onChange={(e) => setTestEmailAddress(e.target.value)}
              placeholder="test@example.com"
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none w-44"
            />
            <button
              onClick={handleSendTest}
              disabled={isSending}
              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              Send Test
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-2 px-3 rounded-xl text-slate-400 hover:text-white text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendCampaign}
              disabled={isSending}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isSending ? 'Sending...' : 'Confirm & Send Email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
