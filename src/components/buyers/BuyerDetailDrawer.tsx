'use client';

import React, { useState } from 'react';
import { Buyer } from '@/types/buyer';
import {
  X,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Building,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Send,
  ShieldCheck,
  RefreshCw,
  Globe,
  Share2,
} from 'lucide-react';

interface BuyerDetailDrawerProps {
  buyer: Buyer | null;
  onClose: () => void;
  onAddToCampaign: (buyer: Buyer) => void;
  onOpenEmailComposer: (buyer: Buyer) => void;
  onVerifyEmail: (buyerId: string) => Promise<void>;
}

export function BuyerDetailDrawer({
  buyer,
  onClose,
  onAddToCampaign,
  onOpenEmailComposer,
  onVerifyEmail,
}: BuyerDetailDrawerProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  if (!buyer) return null;

  const isVerified = buyer.emailStatus === 'verified';
  const isExcellent = buyer.matchScore >= 88;
  const isStrong = buyer.matchScore >= 78 && buyer.matchScore < 88;

  const scoreBadgeColor = isExcellent
    ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    : isStrong
    ? 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10'
    : 'text-amber-400 border-amber-500/40 bg-amber-500/10';

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationFeedback(null);
    try {
      await onVerifyEmail(buyer.id);
      setVerificationFeedback('Email verified deliverable via SMTP handshake!');
    } catch {
      setVerificationFeedback('Verification failed or timeout.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto flex flex-col p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                {buyer.buyerType}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${scoreBadgeColor}`}>
                {buyer.matchScore}/100 Match
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{buyer.businessName}</h2>
            <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-slate-500" />
              {buyer.address || `${buyer.city}, ${buyer.state}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 py-6 space-y-6">
          {/* Match Score Reason Card */}
          <div className="rounded-xl glass-panel p-4 border border-cyan-500/20 bg-cyan-950/20">
            <div className="flex items-center gap-2 mb-2 text-cyan-400 font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Why this buyer matches your product:
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {buyer.matchReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>

            {buyer.aiPitch && (
              <div className="mt-3 pt-3 border-t border-cyan-900/50">
                <span className="text-[11px] font-semibold text-cyan-300 block mb-1">
                  AI Recommended Wholesale Pitch Angle:
                </span>
                <p className="text-xs text-slate-200 italic">&ldquo;{buyer.aiPitch}&rdquo;</p>
              </div>
            )}
          </div>

          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Company Overview</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {buyer.description ||
                `${buyer.businessName} operates in ${buyer.city}, ${buyer.state} specializing in ${buyer.category}.`}
            </p>
          </div>

          {/* Contact & Verification Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Details</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {/* Email item */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Business Email</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-xs text-slate-200 truncate mr-2">
                    {buyer.businessEmail || 'Email unlisted'}
                  </span>
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  ) : buyer.businessEmail ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-semibold bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">
                      Unverified
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Phone item */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Business Phone</span>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-xs text-slate-200">{buyer.phone || 'N/A'}</span>
                </div>
              </div>

              {/* Website */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Domain / Website</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-xs text-slate-200 truncate">{buyer.domain || 'N/A'}</span>
                  {buyer.website && (
                    <a
                      href={buyer.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Employee & scale */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Estimated Scale</span>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-200">
                    {buyer.employeeCount ? `${buyer.employeeCount} team members` : 'Independent Boutique'}
                  </span>
                </div>
              </div>
            </div>

            {/* Verification trigger */}
            {buyer.businessEmail && !isVerified && (
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-400 font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  {isVerifying ? 'Verifying with SMTP...' : 'Run Email Verification Check'}
                </button>
                {verificationFeedback && (
                  <span className="text-xs text-emerald-400">{verificationFeedback}</span>
                )}
              </div>
            )}
          </div>

          {/* Source Attribution */}
          <div className="flex items-center justify-between text-xs text-slate-400 p-3 rounded-lg bg-slate-950/40 border border-slate-800">
            <span>Provider Attribution & Cross-Verification:</span>
            <div className="flex items-center gap-1.5">
              {buyer.sourceProviders.map((src, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700"
                >
                  {src.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenEmailComposer(buyer)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            Generate AI Personalized Outreach
          </button>
          <button
            onClick={() => onAddToCampaign(buyer)}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4 text-slate-400" />
            Add to Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
