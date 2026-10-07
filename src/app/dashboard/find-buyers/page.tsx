'use client';

import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  SlidersHorizontal,
  MapPin,
  CheckCircle2,
  Filter,
  Download,
  Send,
  Eye,
  Building2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Search,
  Layers,
  Map as MapIcon,
  List as ListIcon,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { Buyer, BuyerSearchParams, BuyerSearchResponse } from '@/types/buyer';
import { USBuyerMap } from '@/components/buyers/USBuyerMap';
import { BuyerDetailDrawer } from '@/components/buyers/BuyerDetailDrawer';
import { EmailComposerModal } from '@/components/campaigns/EmailComposerModal';
import { expandSearchQuery } from '@/lib/api/query-intelligence';

export default function FindBuyersPage() {
  // Form State
  const [productName, setProductName] = useState('Handmade Wooden Wall Decor');
  const [productCategory, setProductCategory] = useState('Wall Decor');
  const [productDescription, setProductDescription] = useState(
    'Hand-carved solid teak & reclaimed oak decorative geometric wall art panels for modern and transitional residential and commercial spaces.'
  );
  const [keywords, setKeywords] = useState<string[]>([
    'handmade',
    'wooden',
    'rustic',
    'sustainable',
    'craftsmanship',
  ]);
  const [newKeywordInput, setNewKeywordInput] = useState('');

  const [selectedStates, setSelectedStates] = useState<string[]>(['California', 'Texas']);
  const [selectedBuyerTypes, setSelectedBuyerTypes] = useState<string[]>([
    'Home Decor Store',
    'Interior Design Studio',
    'Furniture Store',
  ]);
  const [minScore, setMinScore] = useState<number>(70);

  // Contact availability checkboxes
  const [hasWebsite, setHasWebsite] = useState(true);
  const [hasEmail, setHasEmail] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);
  const [hasSocial, setHasSocial] = useState(false);

  // Search Engine & Multi-Stage State
  const [isSearching, setIsSearching] = useState(false);
  const [searchStage, setSearchStage] = useState<number>(0);
  const [searchResults, setSearchResults] = useState<BuyerSearchResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // View Mode: List vs Map
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Selection & Modals
  const [selectedBuyerIds, setSelectedBuyerIds] = useState<Set<string>>(new Set());
  const [drawerBuyer, setDrawerBuyer] = useState<Buyer | null>(null);
  const [composerBuyer, setComposerBuyer] = useState<Buyer | null>(null);

  // Pre-set states
  const usStates = [
    'All States',
    'California',
    'Texas',
    'New York',
    'Florida',
    'Washington',
    'Illinois',
    'North Carolina',
    'Georgia',
    'Colorado',
    'Tennessee',
    'Massachusetts',
    'Arizona',
    'Oregon',
    'Louisiana',
    'South Carolina',
  ];

  const allBuyerTypes = [
    'Home Decor Store',
    'Interior Design Studio',
    'Furniture Store',
    'Retail Store',
    'Gift Shop',
    'Boutique Store',
    'Home Staging Company',
    'Wholesale Distributor',
    'Importer',
    'Hotel',
    'E-commerce Store',
  ];

  // Auto-expand query suggestions
  const queryExpansion = expandSearchQuery(productName, productCategory, productDescription);

  const toggleState = (st: string) => {
    if (st === 'All States') {
      setSelectedStates(['All States']);
      return;
    }
    const filtered = selectedStates.filter((s) => s !== 'All States');
    if (filtered.includes(st)) {
      setSelectedStates(filtered.filter((s) => s !== st));
    } else {
      setSelectedStates([...filtered, st]);
    }
  };

  const toggleBuyerType = (type: string) => {
    if (selectedBuyerTypes.includes(type)) {
      if (selectedBuyerTypes.length > 1) {
        setSelectedBuyerTypes(selectedBuyerTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedBuyerTypes([...selectedBuyerTypes, type]);
    }
  };

  const addKeyword = () => {
    if (newKeywordInput.trim() && !keywords.includes(newKeywordInput.trim().toLowerCase())) {
      setKeywords([...keywords, newKeywordInput.trim().toLowerCase()]);
      setNewKeywordInput('');
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchStage(1);
    setErrorMessage(null);

    // Multi-stage animation progression
    const timer1 = setTimeout(() => setSearchStage(2), 600);
    const timer2 = setTimeout(() => setSearchStage(3), 1300);
    const timer3 = setTimeout(() => setSearchStage(4), 1900);

    try {
      const payload: BuyerSearchParams = {
        productName,
        productCategory,
        productDescription,
        keywords,
        country: 'United States',
        states: selectedStates,
        buyerTypes: selectedBuyerTypes,
        minimumMatchScore: minScore,
        hasWebsite,
        hasEmail,
        hasPhone,
        hasAddress,
        hasSocial,
      };

      const res = await fetch('/api/buyers/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Search execution failed');
      }

      setSearchStage(5);
      setTimeout(() => {
        setSearchResults(data);
        setIsSearching(false);
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while contacting discovery providers.');
      setIsSearching(false);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    }
  };

  const toggleSelectBuyer = (id: string) => {
    const next = new Set(selectedBuyerIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedBuyerIds(next);
  };

  const selectAllVisible = () => {
    if (!searchResults) return;
    if (selectedBuyerIds.size === searchResults.buyers.length) {
      setSelectedBuyerIds(new Set());
    } else {
      setSelectedBuyerIds(new Set(searchResults.buyers.map((b) => b.id)));
    }
  };

  const exportCsv = () => {
    if (!searchResults || searchResults.buyers.length === 0) return;
    const headers = [
      'Business Name',
      'Category',
      'Buyer Type',
      'Website',
      'Email',
      'Phone',
      'City',
      'State',
      'Match Score',
      'Email Status',
      'Source',
    ];

    const rows = searchResults.buyers.map((b) => [
      `"${b.businessName.replace(/"/g, '""')}"`,
      `"${b.category || ''}"`,
      `"${b.buyerType}"`,
      `"${b.website || ''}"`,
      `"${b.businessEmail || ''}"`,
      `"${b.phone || ''}"`,
      `"${b.city || ''}"`,
      `"${b.state || ''}"`,
      b.matchScore,
      `"${b.emailStatus}"`,
      `"${b.sourceProviders.join('; ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DecorReach_Buyers_${productCategory}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/60">
            Multi-API Discovery Engine
          </span>
          <span className="text-xs text-slate-400">United States Market</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Find High-Intent U.S. Buyers
        </h1>
        <p className="text-slate-300 text-sm mt-1 max-w-3xl">
          Enter your home decor product specifications. The discovery engine will orchestrate Google Places,
          Yelp, Foursquare, Apollo, and Hunter APIs to identify, enrich, and rank verified commercial buyers.
        </p>
      </div>

      {/* Discovery Form Card */}
      <div className="rounded-2xl glass-panel p-6 md:p-8 border border-slate-800/80 space-y-6">
        {/* Section 1: Product Information */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            1. Product Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Handmade Wooden Wall Decor"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Product Category</label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Wall Decor">Wall Decor</option>
                <option value="Furniture">Furniture</option>
                <option value="Lighting">Lighting</option>
                <option value="Rugs">Rugs</option>
                <option value="Mirrors">Mirrors</option>
                <option value="Table Decor">Table Decor</option>
                <option value="Decorative Accessories">Decorative Accessories</option>
                <option value="Handmade Crafts">Handmade Crafts</option>
                <option value="Other">Other Home Accents</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">Product Description</label>
              <textarea
                rows={3}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Detail craftsmanship, materials, aesthetic, and target retail positioning..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 leading-relaxed"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Product Keywords</label>
              <div className="flex flex-wrap items-center gap-2">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 text-cyan-300 border border-slate-700 text-xs font-medium"
                  >
                    #{kw}
                    <button
                      type="button"
                      onClick={() => removeKeyword(kw)}
                      className="text-slate-400 hover:text-rose-400 ml-1 text-xs"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newKeywordInput}
                    onChange={(e) => setNewKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    placeholder="Add keyword + Enter"
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none w-36"
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* AI Query expansion recommendation */}
              {queryExpansion.suggestedKeywords.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                  <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>Suggested expansion concepts:</span>
                  {queryExpansion.suggestedKeywords.map((sk) => (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => {
                        if (!keywords.includes(sk)) setKeywords([...keywords, sk]);
                      }}
                      className="text-cyan-400 hover:underline"
                    >
                      +{sk}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Target Buyer Type & Location */}
        <div className="pt-4 border-t border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Compass className="w-4 h-4" />
            2. Target Buyer Segment & Geography
          </h3>

          {/* Buyer Types */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Buyer Category (Multiple Allowed)
            </label>
            <div className="flex flex-wrap gap-2">
              {allBuyerTypes.map((type) => {
                const isSelected = selectedBuyerTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleBuyerType(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950 border border-cyan-400/40'
                        : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* U.S. State Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Target U.S. States (Country: United States)
            </label>
            <div className="flex flex-wrap gap-2">
              {usStates.map((st) => {
                const isSelected = selectedStates.includes(st);
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => toggleState(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border border-indigo-400/40'
                        : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Buyer Quality & Filters */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Min Score Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">Minimum Buyer Match Score</label>
              <span className="text-sm font-extrabold text-emerald-400">{minScore}/100</span>
            </div>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>All Matches (0)</span>
              <span>Potential (65)</span>
              <span>Strong (80)</span>
              <span>Excellent (90+)</span>
            </div>
          </div>

          {/* Contact Availability Checkboxes */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Contact & Profile Availability
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasWebsite}
                  onChange={(e) => setHasWebsite(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-cyan-500"
                />
                Has Website Domain
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasEmail}
                  onChange={(e) => setHasEmail(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-cyan-500"
                />
                Has Business Email
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPhone}
                  onChange={(e) => setHasPhone(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-cyan-500"
                />
                Has Business Phone
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAddress}
                  onChange={(e) => setHasAddress(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-cyan-500"
                />
                Has Physical Showroom
              </label>
            </div>
          </div>
        </div>

        {/* Find Buyers Execution Button */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Engine will query: Google Places, Yelp Fusion, Foursquare Places, and Apollo/Hunter.
          </div>

          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="py-3 px-8 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center gap-2.5 shadow-xl shadow-cyan-950/60 transition-all cursor-pointer disabled:opacity-50"
          >
            <Compass className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
            {isSearching ? 'DISCOVERING BUYERS...' : 'FIND BUYERS'}
          </button>
        </div>
      </div>

      {/* Multi-Stage Animated Discovery Engine Progress UI */}
      {isSearching && (
        <div className="rounded-2xl glass-panel-glow p-6 border border-cyan-500/30 bg-slate-900/90 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              BuyerDiscoveryEngine Running...
            </h3>
            <span className="text-xs font-mono text-cyan-400">Phase {searchStage}/5</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2 transition-all duration-500"
              style={{ width: `${(searchStage / 5) * 100}%` }}
            />
          </div>

          {/* Stepper items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              {searchStage >= 1 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
              )}
              <span>Querying business directories (Google Places API)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              {searchStage >= 2 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
              )}
              <span>Searching location-based retailers (Yelp Fusion API)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              {searchStage >= 3 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
              )}
              <span>Deduplicating & merging business records (Entity Resolution)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              {searchStage >= 4 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
              )}
              <span>Enriching company profiles & verifying email deliverability</span>
            </div>
          </div>
        </div>
      )}

      {/* Error UX message if any */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-xs text-amber-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={handleSearch}
            className="px-3 py-1 rounded bg-amber-800 text-white font-medium hover:bg-amber-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results Section */}
      {searchResults && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Results Summary Bar */}
          <div className="rounded-2xl glass-panel p-6 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-white">{searchResults.total} Buyers Found</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {searchResults.qualifiedCount} Qualified (80%+ Match)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {searchResults.verifiedEmailCount} Verified Contacts
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>Data Providers Used:</span>
                {searchResults.providersUsed.map((p) => (
                  <span
                    key={p}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]"
                  >
                    {p.replace('_', ' ')}
                  </span>
                ))}
                <span>• Response: {searchResults.executionTimeMs}ms</span>
              </div>
            </div>

            {/* View Switcher & Actions */}
            <div className="flex items-center gap-3">
              {/* Batch selection outreach trigger */}
              {selectedBuyerIds.size > 0 && (
                <button
                  onClick={() => {
                    const firstId = Array.from(selectedBuyerIds)[0];
                    const b = searchResults.buyers.find((x) => x.id === firstId);
                    if (b) setComposerBuyer(b);
                  }}
                  className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950"
                >
                  <Send className="w-3.5 h-3.5" />
                  Reach {selectedBuyerIds.size} Selected
                </button>
              )}

              {/* CSV Export */}
              <button
                onClick={exportCsv}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Export qualified buyers to CSV"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>

              {/* View Switcher */}
              <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-slate-800 text-cyan-400 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ListIcon className="w-3.5 h-3.5" />
                  LIST
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    viewMode === 'map'
                      ? 'bg-slate-800 text-cyan-400 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  MAP
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Map View */}
          {viewMode === 'map' && (
            <USBuyerMap
              buyers={searchResults.buyers}
              onSelectBuyer={(b) => setDrawerBuyer(b)}
            />
          )}

          {/* Table / Card View */}
          {viewMode === 'list' && (
            <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="p-4 w-10">
                        <input
                          type="checkbox"
                          checked={
                            searchResults.buyers.length > 0 &&
                            selectedBuyerIds.size === searchResults.buyers.length
                          }
                          onChange={selectAllVisible}
                          className="rounded border-slate-800 bg-slate-900 text-cyan-500"
                        />
                      </th>
                      <th className="p-4">Business</th>
                      <th className="p-4">Buyer Type</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Contact & Domain</th>
                      <th className="p-4">Match Score</th>
                      <th className="p-4">Verification</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {searchResults.buyers.map((buyer) => {
                      const isSelected = selectedBuyerIds.has(buyer.id);
                      const isHigh = buyer.matchScore >= 88;
                      const isMedium = buyer.matchScore >= 78 && buyer.matchScore < 88;

                      return (
                        <tr
                          key={buyer.id}
                          className={`hover:bg-slate-900/50 transition-colors ${
                            isSelected ? 'bg-cyan-950/20' : ''
                          }`}
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectBuyer(buyer.id)}
                              className="rounded border-slate-800 bg-slate-900 text-cyan-500"
                            />
                          </td>
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
                            <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                              {buyer.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                              {buyer.buyerType}
                            </span>
                          </td>
                          <td className="p-4 text-slate-300 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-500" />
                              {buyer.city}, {buyer.state}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-mono text-[11px] text-slate-300 truncate max-w-[180px]">
                              {buyer.businessEmail || 'Unlisted'}
                            </div>
                            <span className="text-[10px] text-slate-500">{buyer.domain || 'N/A'}</span>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-extrabold text-sm ${
                                  isHigh
                                    ? 'text-emerald-400'
                                    : isMedium
                                    ? 'text-cyan-400'
                                    : 'text-amber-400'
                                }`}
                              >
                                {buyer.matchScore}%
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {isHigh ? 'Excellent' : isMedium ? 'Strong' : 'Potential'}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            {buyer.emailStatus === 'verified' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                                <ShieldCheck className="w-3 h-3" /> Verified
                              </span>
                            ) : buyer.businessEmail ? (
                              <span className="text-[10px] text-amber-400 font-semibold bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                                Unverified
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500">None</span>
                            )}
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setDrawerBuyer(buyer)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => setComposerBuyer(buyer)}
                                className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 hover:bg-cyan-900 border border-cyan-800/60 transition-colors cursor-pointer"
                                title="AI Email Outreach"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Buyer Details Drawer */}
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
          }}
        />
      )}

      {/* AI Composer Modal */}
      {composerBuyer && (
        <EmailComposerModal
          buyer={composerBuyer}
          onClose={() => setComposerBuyer(null)}
          onCampaignCreated={() => setComposerBuyer(null)}
        />
      )}
    </div>
  );
}
