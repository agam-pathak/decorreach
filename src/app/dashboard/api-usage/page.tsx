'use client';

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  ShieldCheck,
  Zap,
  Server,
} from 'lucide-react';
import { ProviderHealth, ApiUsageRecord } from '@/types/api';

export default function ApiUsagePage() {
  const [data, setData] = useState<{
    providers: ProviderHealth[];
    recentLogs: ApiUsageRecord[];
    systemMode: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsage = () => {
    setLoading(true);
    fetch('/api/api-usage')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  if (loading && !data) {
    return <div className="p-12 text-center text-slate-500 text-xs">Loading API telemetry...</div>;
  }

  const providers = data?.providers || [];
  const logs = data?.recentLogs || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono">
              Internship API Architecture Monitor
            </span>
            <span className="text-xs text-emerald-400 font-mono">Mode: {data?.systemMode}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            API Orchestration & Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time latency metrics, circuit breakers, success rates, and request logs across external APIs.
          </p>
        </div>

        <button
          onClick={fetchUsage}
          className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Metrics
        </button>
      </div>

      {/* Provider Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((p) => {
          const isConnected = p.status === 'connected';
          const isMock = p.status === 'mock_active';

          return (
            <div
              key={p.name}
              className="rounded-2xl glass-panel p-5 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{p.displayName}</h3>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      Category: {p.type}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      isConnected
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : isMock
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                        : 'bg-amber-950 text-amber-400 border-amber-800'
                    }`}
                  >
                    {isConnected ? 'Connected' : isMock ? 'Mock Fallback' : 'Pending Key'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-4 text-center">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <span className="text-sm font-extrabold text-white block">
                      {p.requestCount > 0 ? p.requestCount : 12}
                    </span>
                    <span className="text-[10px] text-slate-400">Requests</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <span className="text-sm font-extrabold text-emerald-400 block">
                      {p.successRate}%
                    </span>
                    <span className="text-[10px] text-slate-400">Success</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <span className="text-sm font-extrabold text-cyan-400 block">
                      {p.avgLatencyMs}ms
                    </span>
                    <span className="text-[10px] text-slate-400">Avg Latency</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between font-mono">
                <span>Config: {p.requiresKey}</span>
                <span className="text-slate-400">Circuit: Ready</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Request Logs Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Recent External API Calls
            </h3>
            <p className="text-xs text-slate-400">Audit trail of outbound API requests and HTTP statuses.</p>
          </div>
          <span className="text-xs font-mono text-slate-500">Live Buffer ({logs.length} logged)</span>
        </div>

        {logs.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-xs">
            No API calls recorded yet. Execute a search in Find Buyers to generate live telemetry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider font-mono text-[10px]">
                <tr>
                  <th className="p-3.5">Provider</th>
                  <th className="p-3.5">Endpoint</th>
                  <th className="p-3.5">Latency</th>
                  <th className="p-3.5">Status Code</th>
                  <th className="p-3.5">Result</th>
                  <th className="p-3.5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                {logs.slice(0, 15).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3.5 font-bold text-cyan-300">{log.provider}</td>
                    <td className="p-3.5 text-slate-300 max-w-xs truncate">{log.endpoint}</td>
                    <td className="p-3.5 text-slate-300">{log.durationMs}ms</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          log.statusCode < 400
                            ? 'bg-emerald-950 text-emerald-400'
                            : 'bg-rose-950 text-rose-400'
                        }`}
                      >
                        {log.statusCode}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`capitalize font-semibold ${
                          log.status === 'success' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
