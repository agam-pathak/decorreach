'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Users,
  Send,
  FileText,
  BarChart3,
  Cpu,
  BookOpen,
  Settings,
  Search,
  Bell,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Layers,
  CheckCircle2,
  Menu,
  X,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Layers },
    { name: 'Find Buyers', href: '/dashboard/find-buyers', icon: Compass, highlight: true },
    { name: 'My Buyers (CRM)', href: '/dashboard/buyers', icon: Users },
    { name: 'Campaigns', href: '/dashboard/campaigns', icon: Send },
    { name: 'Email Templates', href: '/dashboard/templates', icon: FileText },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'API Usage', href: '/dashboard/api-usage', icon: Cpu },
    { name: 'API Documentation', href: '/dashboard/api-docs', icon: BookOpen },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const notifications = [
    { id: 1, title: '36 New U.S. Buyers Discovered', time: '10m ago', unread: true },
    { id: 2, title: 'Hunter Verified 14 business emails', time: '1h ago', unread: true },
    { id: 3, title: 'West Coast Boutiques campaign delivered', time: '4h ago', unread: false },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-black text-white text-base">
            D
          </div>
          <span className="font-bold text-lg tracking-tight text-white">DecorReach</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0d1322] border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-cyan-950/50">
            D
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white block">DecorReach</span>
            <span className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase block">
              U.S. Buyer Engine
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.highlight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all group my-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-900/40'
                      : 'bg-cyan-950/30 border border-cyan-800/50 text-cyan-300 hover:bg-cyan-900/40'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                  <span>{item.name}</span>
                  <span className="ml-auto text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-400/30">
                    Live
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800/80 text-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Mock indicator */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono">Demo Mode (API Safe)</span>
          </div>

          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-xs text-white">
              AP
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-white truncate block">Agam Pathak</span>
              <span className="text-[10px] text-slate-400 truncate block">Heritage Decor</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 px-6 bg-[#080c14]/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between gap-4 sticky top-0 z-30">
          {/* Search bar */}
          <div className="flex items-center gap-2 max-w-md w-full">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search discovered buyers, cities, or categories..."
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Find CTA */}
            <Link
              href="/dashboard/find-buyers"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-950 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Discover Buyers
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    <span className="text-[10px] text-cyan-400">2 Unread</span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-lg text-xs ${
                          n.unread ? 'bg-slate-800/80 border border-slate-700/60' : 'bg-slate-950/40 text-slate-400'
                        }`}
                      >
                        <p className="font-medium text-slate-200">{n.title}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Home / Exit to Landing */}
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white px-2 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              Exit to Landing
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
