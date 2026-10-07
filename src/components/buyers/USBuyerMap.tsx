'use client';

import React, { useState } from 'react';
import { Buyer } from '@/types/buyer';
import { MapPin, Sparkles, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';

interface USBuyerMapProps {
  buyers: Buyer[];
  onSelectBuyer: (buyer: Buyer) => void;
}

export function USBuyerMap({ buyers, onSelectBuyer }: USBuyerMapProps) {
  const [selectedPin, setSelectedPin] = useState<Buyer | null>(null);

  // Approximate coordinate mapping to SVG viewBox (0 0 950 580)
  // US mainland bounding box roughly lat: 24 to 50, lon: -125 to -66
  function getSvgCoords(lat?: number, lon?: number): { x: number; y: number } | null {
    if (!lat || !lon) return null;
    const minLon = -124.5;
    const maxLon = -67.0;
    const minLat = 24.5;
    const maxLat = 49.5;

    // Normalization with Mercator-like scaling
    const x = ((lon - minLon) / (maxLon - minLon)) * 880 + 35;
    const y = 540 - ((lat - minLat) / (maxLat - minLat)) * 480;

    return {
      x: Math.max(30, Math.min(920, x)),
      y: Math.max(40, Math.min(540, y)),
    };
  }

  return (
    <div className="relative w-full rounded-2xl glass-panel p-6 border border-slate-800 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            Discovered U.S. Buyer Geography
          </h3>
          <p className="text-sm text-slate-400">
            Interactive distribution of verified retailers and design studios across the United States.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            90%+ Excellent Match
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            80-89% Strong Match
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            Potential Match
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-[16/9] min-h-[420px] bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
        {/* Subtle Map Grid lines */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        {/* SVG Map Base (Simplified USA contour paths) */}
        <svg
          viewBox="0 0 950 580"
          className="w-full h-full select-none"
          style={{ filter: 'drop-shadow(0px 8px 24px rgba(0,0,0,0.5))' }}
        >
          {/* US Mainland Outline Silhouette */}
          <path
            d="M 120 70 
               Q 250 80 400 90 
               Q 550 75 720 95 
               L 880 130 
               L 910 190 
               L 850 250 
               L 840 330 
               L 860 410 
               L 800 480 
               L 770 510 
               L 730 460 
               L 660 440 
               L 540 460 
               L 480 520 
               L 430 460 
               L 360 430 
               L 260 440 
               L 150 430 
               L 90 320 
               L 70 180 
               Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            className="transition-all duration-300"
          />

          {/* Regional ambient glow circles */}
          <circle cx="170" cy="270" r="90" fill="#06b6d4" opacity="0.04" />
          <circle cx="480" cy="380" r="95" fill="#6366f1" opacity="0.04" />
          <circle cx="780" cy="210" r="100" fill="#38bdf8" opacity="0.05" />

          {/* Buyer Pin Markers */}
          {buyers.map((buyer) => {
            const coords = getSvgCoords(buyer.latitude, buyer.longitude);
            if (!coords) return null;

            const isHigh = buyer.matchScore >= 90;
            const isMedium = buyer.matchScore >= 80 && buyer.matchScore < 90;
            const pinColor = isHigh ? '#34d399' : isMedium ? '#38bdf8' : '#94a3b8';

            const isSelected = selectedPin?.id === buyer.id;

            return (
              <g
                key={buyer.id}
                transform={`translate(${coords.x}, ${coords.y})`}
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedPin(buyer);
                }}
              >
                {/* Ping ring for excellent matches */}
                {isHigh && (
                  <circle
                    r="12"
                    fill="none"
                    stroke={pinColor}
                    strokeWidth="1.5"
                    opacity="0.4"
                    className="animate-ping"
                  />
                )}
                {/* Outer halo */}
                <circle
                  r={isSelected ? 10 : 7}
                  fill={pinColor}
                  opacity={isSelected ? 0.9 : 0.8}
                  className="transition-all duration-200 group-hover:scale-125"
                />
                <circle
                  r={isSelected ? 5 : 3.5}
                  fill="#ffffff"
                  className="transition-all"
                />

                {/* Hover label */}
                <text
                  x="12"
                  y="4"
                  fill="#f8fafc"
                  fontSize="11"
                  fontWeight="600"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-md pointer-events-none"
                >
                  {buyer.businessName} ({buyer.matchScore}%)
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Buyer Floating Card */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 max-w-sm w-full bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 mb-1">
                  {selectedPin.buyerType}
                </span>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {selectedPin.businessName}
                  {selectedPin.emailStatus === 'verified' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </h4>
                <p className="text-xs text-slate-400">
                  {selectedPin.city}, {selectedPin.state}
                </p>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-emerald-400">
                  {selectedPin.matchScore}
                </span>
                <span className="text-[10px] text-slate-400 block">/100</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 mb-3">
              {selectedPin.description || 'Verified home decor business.'}
            </p>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => onSelectBuyer(selectedPin)}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                View Full Dossier
              </button>
              {selectedPin.website && (
                <a
                  href={selectedPin.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Visit Website"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => setSelectedPin(null)}
                className="text-xs text-slate-500 hover:text-slate-300 px-1.5 py-1"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
