'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, Copy, Check, Sparkles, X } from 'lucide-react';
import { EmailTemplate } from '@/types/campaign';

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Seed templates
    setTemplates([
      {
        id: 'tpl_1',
        userId: 'usr_demo',
        name: 'Boutique Wholesale Introduction',
        subject: 'Wholesale Inquiry: Handcrafted Decor Line for {{businessName}}',
        body: `Hi {{businessName}} Team,\n\nI came across {{businessName}} while researching high-end home retailers in {{city}} and was truly inspired by your curated aesthetic.\n\nAt {{companyName}}, we manufacture handcrafted wooden decor, wall art, and artisanal furnishings designed for discerning boutique buyers. Our pieces are sustainably crafted and offer attractive retail margins (2.4x - 2.8x).\n\nWould you be open to taking a look at our Fall wholesale lookbook?\n\nBest regards,\n{{sellerName}}\n{{companyName}}\n{{website}}`,
        variables: ['businessName', 'city', 'buyerType', 'sellerName', 'companyName', 'website'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'tpl_2',
        userId: 'usr_demo',
        name: 'Interior Designer & Studio Trade Program',
        subject: 'Trade Program & Custom Sourcing for {{businessName}}',
        body: `Hi {{businessName}} Team,\n\nI hope your current projects in {{city}} are thriving. I’m reaching out from {{companyName}}—we create artisanal statement decor and custom wooden installations for interior designers.\n\nWe offer a dedicated Trade Program with 35% designer discounts, custom dimension capabilities, and fast U.S. shipping.\n\nCould I send over a quick digital spec sheet for your upcoming residential or commercial projects?\n\nWarm regards,\n{{sellerName}}\n{{companyName}}`,
        variables: ['businessName', 'city', 'buyerType', 'sellerName', 'companyName'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'tpl_3',
        userId: 'usr_demo',
        name: 'Hospitality & Boutique Hotel Direct',
        subject: 'Custom Hardwood Decor Installations for {{businessName}}',
        body: `Hi {{businessName}} Procurement Team,\n\nI’m reaching out from {{companyName}} regarding your ongoing guest room and public space renovations in {{city}}.\n\nWe craft commercial-grade solid timber wall panels, mirrors, and sculptural lighting for boutique hospitality brands with full ASTM fire and durability compliance.\n\nI’d welcome the chance to share our hospitality project portfolio if you are currently specifying decorative elements.\n\nBest,\n{{sellerName}}\n{{companyName}}\n{{website}}`,
        variables: ['businessName', 'city', 'buyerType', 'sellerName', 'companyName', 'website'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const copyTemplate = (tpl: EmailTemplate) => {
    navigator.clipboard.writeText(`${tpl.subject}\n\n${tpl.body}`);
    setCopiedId(tpl.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-cyan-400" />
          Email Templates
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          High-converting B2B wholesale templates configured with dynamic entity variables.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-2xl glass-panel p-6 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <h3 className="text-base font-bold text-white mb-2">{tpl.name}</h3>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-cyan-300 mb-3 truncate">
                Subject: {tpl.subject}
              </div>
              <p className="text-xs text-slate-300 whitespace-pre-wrap line-clamp-6 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 font-sans">
                {tpl.body}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {tpl.variables.slice(0, 3).map((v) => (
                  <span
                    key={v}
                    className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono"
                  >
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>

              <button
                onClick={() => copyTemplate(tpl)}
                className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedId === tpl.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
