'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Send,
  ShieldCheck,
  CheckCircle,
  Tag,
  Edit3,
  MapPin,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Buyer, PipelineStatus } from '@/types/buyer';
import { BuyerDetailDrawer } from '@/components/buyers/BuyerDetailDrawer';
import { EmailComposerModal } from '@/components/campaigns/EmailComposerModal';

export default function MyBuyersPipelinePage() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerBuyer, setDrawerBuyer] = useState<Buyer | null>(null);
  const [composerBuyer, setComposerBuyer] = useState<Buyer | null>(null);

  const stages: { key: string; label: string }[] = [
    { key: 'all', label: 'All Buyers' },
    { key: 'discovered', label: 'Discovered' },
    { key: 'qualified', label: 'Qualified' },
    { key: 'contact_verified', label: 'Verified Contacts' },
    { key: 'added_to_campaign', label: 'In Campaign' },
    { key: 'contacted', label: 'Contacted' },
    { key: 'opened', label: 'Opened' },
    { key: 'replied', label: 'Replied' },
    { key: 'customer', label: 'Customer' },
  ];

  const fetchBuyers = async () => {
    try {
      const res = await fetch('/api/buyers?limit=100');
      const data = await res.json();
      if (data.buyers) setBuyers(data.buyers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const updateStatus = async (buyerId: string, newStatus: PipelineStatus) => {
    try {
      await fetch(`/api/buyers/${buyerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipelineStatus: newStatus }),
      });
      setBuyers((prev) =>
        prev.map((b) => (b.id === buyerId ? { ...b, pipelineStatus: newStatus } : b))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const filteredBuyers = buyers.filter((b) => {
    const matchesStage = activeStage === 'all' || b.pipelineStatus === activeStage;
    const matchesSearch =
      !searchQuery ||
      b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const exportCsv = () => {
    const headers = [
      'Business Name',
      'Pipeline Status',
      'Category',
      'Buyer Type',
      'Website',
      'Email',
      'Phone',
      'City',
      'State',
      'Match Score',
      'Notes',
    ];

    const rows = filteredBuyers.map((b) => [
      `"${b.businessName.replace(/"/g, '""')}"`,
      `"${b.pipelineStatus}"`,
      `"${b.category || ''}"`,
      `"${b.buyerType}"`,
      `"${b.website || ''}"`,
      `"${b.businessEmail || ''}"`,
      `"${b.phone || ''}"`,
      `"${b.city || ''}"`,
      `"${b.state || ''}"`,
      b.matchScore,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DecorReach_CRM_Pipeline_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            Buyer Pipeline & CRM
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage relationship stages, contact verification, notes, and outreach status for U.S. accounts.
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Export Pipeline CSV
        </button>
      </div>

      {/* Stage Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800">
        {stages.map((st) => {
          const count =
            st.key === 'all'
              ? buyers.length
              : buyers.filter((b) => b.pipelineStatus === st.key).length;
          const isActive = activeStage === st.key;

          return (
            <button
              key={st.key}
              onClick={() => setActiveStage(st.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{st.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-cyan-800 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search pipeline by name, city, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">Loading buyer pipeline...</div>
        ) : filteredBuyers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <p>No buyers in this pipeline stage yet.</p>
            <p className="text-slate-500">Run a search to discover qualified U.S. retailers.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Business</th>
                  <th className="p-4">Stage</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Match Score</th>
                  <th className="p-4">Notes & Tags</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredBuyers.map((buyer) => (
                  <tr key={buyer.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-medium text-white">
                      <div className="font-bold text-slate-100 flex items-center gap-1.5">
                        {buyer.businessName}
                        {buyer.website && (
                          <a
                            href={buyer.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-500 hover:text-cyan-400"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block">{buyer.buyerType}</span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <select
                        value={buyer.pipelineStatus}
                        onChange={(e) => updateStatus(buyer.id, e.target.value as any)}
                        className="bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1 text-xs text-cyan-300 font-medium focus:outline-none"
                      >
                        <option value="discovered">Discovered</option>
                        <option value="qualified">Qualified</option>
                        <option value="contact_verified">Contact Verified</option>
                        <option value="added_to_campaign">In Campaign</option>
                        <option value="contacted">Contacted</option>
                        <option value="opened">Opened</option>
                        <option value="replied">Replied</option>
                        <option value="customer">Customer</option>
                      </select>
                    </td>
                    <td className="p-4 text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {buyer.city}, {buyer.state}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-mono text-[11px] text-slate-300">
                        {buyer.businessEmail || 'Unlisted'}
                      </div>
                      {buyer.emailStatus === 'verified' && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-bold text-emerald-400">{buyer.matchScore}%</span>
                    </td>
                    <td className="p-4 max-w-xs truncate">
                      <span className="text-[11px] text-slate-300">
                        {buyer.notes || buyer.tags?.join(', ') || 'No notes added'}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDrawerBuyer(buyer)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => setComposerBuyer(buyer)}
                          className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 hover:bg-cyan-900 border border-cyan-800/60 transition-colors cursor-pointer"
                          title="Compose Outreach"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {drawerBuyer && (
        <BuyerDetailDrawer
          buyer={drawerBuyer}
          onClose={() => setDrawerBuyer(null)}
          onAddToCampaign={(b) => {
            setDrawerBuyer(null);
            setComposerBuyer(b);
          }}
          onOpenEmailComposer={(b) => {
            setDrawerBuyer(null);
            setComposerBuyer(b);
          }}
          onVerifyEmail={async (id) => {
            await fetch(`/api/buyers/${id}/verify`, { method: 'POST' });
            fetchBuyers();
          }}
        />
      )}

      {composerBuyer && (
        <EmailComposerModal
          buyer={composerBuyer}
          onClose={() => setComposerBuyer(null)}
          onCampaignCreated={() => {
            setComposerBuyer(null);
            fetchBuyers();
          }}
        />
      )}
    </div>
  );
}
