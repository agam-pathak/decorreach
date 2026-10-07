'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  MailCheck,
  Send,
  MessageSquare,
  AlertTriangle,
  Users,
  Compass,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="p-12 text-center text-slate-500 text-xs">Loading analytics data...</div>;
  }

  const { summary, categoryPerformance, stateDistribution, outreachTimeline } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          Outreach & Buyer Intelligence Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Performance metrics, conversion funnels, and geographic penetration across U.S. markets.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="rounded-xl glass-panel p-4 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Emails Sent</span>
          <span className="text-2xl font-extrabold text-white block mt-1">{summary.emailsSent}</span>
          <span className="text-[10px] text-slate-500">Total outreach</span>
        </div>

        <div className="rounded-xl glass-panel p-4 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Delivery Rate</span>
          <span className="text-2xl font-extrabold text-emerald-400 block mt-1">
            {summary.deliveryRate}%
          </span>
          <span className="text-[10px] text-slate-500">{summary.emailsDelivered} delivered</span>
        </div>

        <div className="rounded-xl glass-panel p-4 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Open Rate</span>
          <span className="text-2xl font-extrabold text-cyan-400 block mt-1">{summary.openRate}%</span>
          <span className="text-[10px] text-slate-500">{summary.emailsOpened} unique opens</span>
        </div>

        <div className="rounded-xl glass-panel p-4 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Click Rate</span>
          <span className="text-2xl font-extrabold text-indigo-400 block mt-1">
            {summary.clickRate}%
          </span>
          <span className="text-[10px] text-slate-500">{summary.emailsClicked} lookbook views</span>
        </div>

        <div className="rounded-xl glass-panel p-4 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Reply Rate</span>
          <span className="text-2xl font-extrabold text-purple-400 block mt-1">{summary.replyRate}%</span>
          <span className="text-[10px] text-slate-500">{summary.repliesReceived} responses</span>
        </div>

        <div className="rounded-xl glass-panel p-4 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Bounce Rate</span>
          <span className="text-2xl font-extrabold text-amber-400 block mt-1">{summary.bounceRate}%</span>
          <span className="text-[10px] text-slate-500">{summary.bounced} bounces</span>
        </div>
      </div>

      {/* Chart Row 1: Outreach Over Time */}
      <div className="rounded-2xl glass-panel p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Outreach & Engagement Volume (Last 7 Days)
            </h3>
            <p className="text-xs text-slate-400">Emails dispatched, opened, and positive replies.</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={outreachTimeline}>
              <defs>
                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc', fontSize: '11px' }}
              />
              <Area type="monotone" dataKey="sent" stroke="#06b6d4" fillOpacity={1} fill="url(#colorSent)" name="Sent" />
              <Area type="monotone" dataKey="opened" stroke="#6366f1" fillOpacity={1} fill="url(#colorOpened)" name="Opened" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Row 2: Buyer Category Performance & State Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Performance */}
        <div className="rounded-2xl glass-panel p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-1">Response Rate by Buyer Category</h3>
          <p className="text-xs text-slate-400 mb-4">Reply and engagement metrics per retail segment.</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#64748b" fontSize={10} tick={{ width: 80 }} interval={0} />
                <YAxis stroke="#64748b" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc', fontSize: '11px' }}
                />
                <Bar dataKey="replyRate" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Reply Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State Distribution */}
        <div className="rounded-2xl glass-panel p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-1">State-wise Buyer Penetration</h3>
          <p className="text-xs text-slate-400 mb-4">Volume of discovered businesses across top U.S. states.</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="state" type="category" stroke="#64748b" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} name="Discovered Buyers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
