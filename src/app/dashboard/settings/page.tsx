'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  Building,
  Mail,
  Sliders,
  CheckCircle2,
  Trash2,
  Plus,
  Key,
} from 'lucide-react';
import { SuppressionEntry } from '@/types/campaign';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    sellerName: 'Agam Pathak',
    companyName: 'Heritage Decor Exporters',
    website: 'https://heritagedecor.com',
    description: 'Specializing in solid teak and oak decorative wall art panels, hand-turned brass table accents, and carved mirrors for high-end boutique retail and interior design studios.',
    targetMarket: 'United States',
  });

  const [dailyLimit, setDailyLimit] = useState(50);
  const [optOutFooter, setOptOutFooter] = useState(true);
  const [duplicateSuppression, setDuplicateSuppression] = useState(true);
  const [requireVerification, setRequireVerification] = useState(true);

  const [suppressionList, setSuppressionList] = useState<SuppressionEntry[]>([]);
  const [newSuppressionEmail, setNewSuppressionEmail] = useState('');
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((d) => {
        if (d.sellerProfile) setProfile(d.sellerProfile);
        if (d.suppressionList) setSuppressionList(d.suppressionList);
      })
      .catch((e) => console.error(e));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedFeedback(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerProfile: profile }),
      });
      if (res.ok) {
        setSavedFeedback('Settings & seller profile updated successfully.');
        setTimeout(() => setSavedFeedback(null), 3000);
      }
    } catch {
      setSavedFeedback('Failed to update settings.');
    }
  };

  const handleAddSuppression = async () => {
    if (!newSuppressionEmail.trim()) return;
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newSuppressionEmail: newSuppressionEmail.trim() }),
      });
      setSuppressionList([
        ...suppressionList,
        {
          id: `sup_${Date.now()}`,
          userId: 'usr_demo',
          email: newSuppressionEmail.trim(),
          reason: 'manual',
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewSuppressionEmail('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          Platform Settings & Compliance
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage seller company profile, daily outreach throttle limits, suppression list, and external provider connections.
        </p>
      </div>

      {savedFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedFeedback}</span>
        </div>
      )}

      {/* Seller Profile Form */}
      <form onSubmit={handleSaveProfile} className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Building className="w-4 h-4" />
          1. Seller Company Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Seller Contact Name</label>
            <input
              type="text"
              value={profile.sellerName}
              onChange={(e) => setProfile({ ...profile, sellerName: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">Company / Brand Name</label>
            <input
              type="text"
              value={profile.companyName}
              onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-semibold text-slate-300 block mb-1">Website URL</label>
            <input
              type="url"
              value={profile.website}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-semibold text-slate-300 block mb-1">Company Description & Craftsmanship</label>
            <textarea
              rows={3}
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="py-2 px-5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md shadow-cyan-950 transition-colors cursor-pointer"
          >
            Save Profile Changes
          </button>
        </div>
      </form>

      {/* API Provider Status */}
      <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Key className="w-4 h-4" />
          2. External API Provider Status (Server-Secured)
        </h3>
        <p className="text-xs text-slate-400">
          Private API credentials remain encrypted server-side and are never transmitted to client code.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            { name: 'Google Places API', env: 'GOOGLE_MAPS_API_KEY', status: 'Connected / Mock Enabled' },
            { name: 'Yelp Fusion API', env: 'YELP_API_KEY', status: 'Connected / Mock Enabled' },
            { name: 'Foursquare Places API', env: 'FOURSQUARE_API_KEY', status: 'Connected / Mock Enabled' },
            { name: 'Hunter.io Email & Verify', env: 'HUNTER_API_KEY', status: 'Active (SMTP Handshake)' },
            { name: 'OpenAI GPT-4o Engine', env: 'OPENAI_API_KEY', status: 'Active Structured Inference' },
            { name: 'Resend Email Provider', env: 'RESEND_API_KEY', status: 'Safe Demo Mode Guard Active' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-200 block">{item.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">{item.env}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Email Safety & Suppression */}
      <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          3. Email Outreach Safety & CAN-SPAM Compliance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-slate-200 font-medium">Daily Outbound Sending Limit:</span>
              <span className="font-mono text-cyan-400 font-bold">{dailyLimit} / day</span>
            </label>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">
              Gradual domain warm-up cap to protect sender reputation.
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <label className="flex items-center gap-2 text-slate-200">
              <input
                type="checkbox"
                checked={optOutFooter}
                onChange={(e) => setOptOutFooter(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-500"
              />
              <span>Mandatory 1-Click Unsubscribe Footer</span>
            </label>

            <label className="flex items-center gap-2 text-slate-200">
              <input
                type="checkbox"
                checked={duplicateSuppression}
                onChange={(e) => setDuplicateSuppression(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-500"
              />
              <span>Suppress Past Recipients & Duplicate Leads</span>
            </label>

            <label className="flex items-center gap-2 text-slate-200">
              <input
                type="checkbox"
                checked={requireVerification}
                onChange={(e) => setRequireVerification(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-500"
              />
              <span>Require Prior Email Deliverability Verification</span>
            </label>
          </div>
        </div>

        {/* Suppression List Management */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Email Suppression & Opt-Out List ({suppressionList.length} addresses)
          </h4>

          <div className="flex items-center gap-2">
            <input
              type="email"
              value={newSuppressionEmail}
              onChange={(e) => setNewSuppressionEmail(e.target.value)}
              placeholder="Add address to suppression (e.g. buyer@optout.com)"
              className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 max-w-sm flex-1"
            />
            <button
              type="button"
              onClick={handleAddSuppression}
              className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add to Suppression
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 max-h-40 overflow-y-auto space-y-1.5">
            {suppressionList.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between text-xs p-2 rounded bg-slate-900/60 border border-slate-800/80 font-mono"
              >
                <span className="text-slate-300">{entry.email}</span>
                <span className="text-[10px] text-amber-400 capitalize px-2 py-0.5 rounded bg-amber-950/40 border border-amber-900">
                  {entry.reason}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
