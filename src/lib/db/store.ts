import fs from 'fs';
import path from 'path';
import { Buyer } from '@/types/buyer';
import { Campaign, CampaignBuyer, EmailTemplate, EmailEvent, SuppressionEntry } from '@/types/campaign';
import { MOCK_US_BUYERS_DATA } from '@/lib/api/providers/mock-providers';

export interface SavedSearch {
  id: string;
  name: string;
  productName: string;
  productCategory: string;
  states: string[];
  buyerTypes: string[];
  resultsCount: number;
  createdAt: string;
}

export interface AppStoreData {
  users: {
    id: string;
    email: string;
    name: string;
    companyName: string;
    createdAt: string;
  }[];
  sellerProfile: {
    companyName: string;
    website: string;
    description: string;
    productCategories: string[];
    targetMarket: string;
    sellerName: string;
  };
  buyers: Buyer[];
  searches: SavedSearch[];
  campaigns: Campaign[];
  campaignBuyers: CampaignBuyer[];
  templates: EmailTemplate[];
  events: EmailEvent[];
  suppressionList: SuppressionEntry[];
}

const DATA_FILE_PATH = path.join(process.cwd(), '.decorreach_store.json');

// Generate initial rich seed data
function getInitialSeedData(): AppStoreData {
  const defaultBuyers: Buyer[] = MOCK_US_BUYERS_DATA.map((b, idx) => {
    const scores = [94, 91, 88, 87, 85, 83, 81, 79, 76, 74, 92, 89];
    const score = scores[idx % scores.length];
    const statuses: Buyer['pipelineStatus'][] = [
      'qualified',
      'contact_verified',
      'added_to_campaign',
      'contacted',
      'replied',
      'customer',
      'discovered',
    ];
    const status = statuses[idx % statuses.length];

    return {
      id: `buyer_${idx + 1}`,
      businessName: b.name,
      normalizedName: b.name.toLowerCase().replace(/[^a-z0-9]/g, ' '),
      category: b.category || 'Home Decor Store',
      description: b.description,
      website: b.website,
      domain: b.domain,
      businessEmail: b.email,
      phone: b.phone,
      address: b.address,
      city: b.city,
      state: b.state,
      zipCode: b.zipCode,
      country: 'United States',
      latitude: b.latitude,
      longitude: b.longitude,
      industry: b.industry,
      buyerType: b.category?.includes('Studio') ? 'Interior Design Studio' : 'Home Decor Store',
      employeeCount: b.employeeCount,
      socialProfiles: b.socials,
      sourceProviders: [b.sourceProvider, 'mock_directory'],
      emailStatus: 'verified',
      matchScore: score,
      matchReasons: [
        `Direct commercial catalog alignment in ${b.category}`,
        `Verified retail showroom in ${b.city}, ${b.state}`,
        `Strong consumer demand for handcrafted home decor`,
      ],
      aiPitch: `Emphasize handcrafted wood quality, direct trade pricing, and low minimum order quantities for ${b.name}.`,
      pipelineStatus: status,
      notes: idx === 0 ? 'Followed up regarding Fall 2026 wholesale catalog. Expressed strong interest in wall mirrors.' : undefined,
      tags: idx % 2 === 0 ? ['High Potential', 'Wholesale Buyer'] : ['Interior Designer', 'Priority Lead'],
      createdAt: new Date(Date.now() - idx * 86400000 * 2).toISOString(),
    };
  });

  const templates: EmailTemplate[] = [
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
      name: 'Interior Designer & Studio Sourcing',
      subject: 'Trade Program & Custom Sourcing for {{businessName}}',
      body: `Hi {{businessName}} Team,\n\nI hope your current projects in {{city}} are thriving. I’m reaching out from {{companyName}}—we create artisanal statement decor and custom wooden installations for interior designers.\n\nWe offer a dedicated Trade Program with 35% designer discounts, custom dimension capabilities, and fast U.S. shipping.\n\nCould I send over a quick digital spec sheet for your upcoming residential or commercial projects?\n\nWarm regards,\n{{sellerName}}\n{{companyName}}`,
      variables: ['businessName', 'city', 'buyerType', 'sellerName', 'companyName'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const campaigns: Campaign[] = [
    {
      id: 'camp_1',
      userId: 'usr_demo',
      name: 'West Coast Boutiques Outreach',
      subject: 'Handcrafted Wall Decor Collection for {{businessName}}',
      templateId: 'tpl_1',
      status: 'completed',
      senderName: 'Agam Pathak',
      replyTo: 'agam@decorreach.com',
      personalizationEnabled: true,
      dailyLimit: 50,
      buyersCount: 24,
      sentCount: 24,
      deliveredCount: 23,
      openedCount: 16,
      clickedCount: 9,
      repliedCount: 5,
      bouncedCount: 1,
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'camp_2',
      userId: 'usr_demo',
      name: 'Texas Design Studios Q4 Sourcing',
      subject: 'Exclusive Trade Lookbook for {{businessName}}',
      templateId: 'tpl_2',
      status: 'sending',
      senderName: 'Agam Pathak',
      replyTo: 'agam@decorreach.com',
      personalizationEnabled: true,
      dailyLimit: 40,
      buyersCount: 18,
      sentCount: 12,
      deliveredCount: 12,
      openedCount: 8,
      clickedCount: 4,
      repliedCount: 2,
      bouncedCount: 0,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const searches: SavedSearch[] = [
    {
      id: 'search_past_1',
      name: 'Handmade Wall Decor (California & Texas)',
      productName: 'Handcrafted Wooden Wall Decor',
      productCategory: 'Wall Decor',
      states: ['California', 'Texas'],
      buyerTypes: ['Home Decor Store', 'Interior Designer'],
      resultsCount: 47,
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      id: 'search_past_2',
      name: 'Luxury Furniture & Accents (New York & Florida)',
      productName: 'Artisan Wooden Accents',
      productCategory: 'Furniture',
      states: ['New York', 'Florida'],
      buyerTypes: ['Furniture Store', 'Home Staging Company'],
      resultsCount: 83,
      createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
    },
  ];

  return {
    users: [
      {
        id: 'usr_demo',
        email: 'agam@decorreach.com',
        name: 'Agam Pathak',
        companyName: 'Heritage Decor Exporters',
        createdAt: new Date().toISOString(),
      },
    ],
    sellerProfile: {
      companyName: 'Heritage Decor Exporters',
      website: 'https://heritagedecor.com',
      description: 'Handcrafted wooden wall art, brass table decor, and sustainably carved mirrors for high-end retail and design studios.',
      productCategories: ['Wall Decor', 'Furniture', 'Table Decor', 'Handmade Crafts'],
      targetMarket: 'United States',
      sellerName: 'Agam Pathak',
    },
    buyers: defaultBuyers,
    searches,
    campaigns,
    campaignBuyers: [],
    templates,
    events: [],
    suppressionList: [
      {
        id: 'sup_1',
        userId: 'usr_demo',
        email: 'optout@oldretailer.com',
        reason: 'unsubscribed',
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      },
    ],
  };
}

class StoreManager {
  private memoryData: AppStoreData | null = null;

  private load(): AppStoreData {
    if (this.memoryData) return this.memoryData;

    try {
      if (fs.existsSync(DATA_FILE_PATH)) {
        const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
        this.memoryData = JSON.parse(fileContent);
        return this.memoryData!;
      }
    } catch (e) {
      console.warn('Failed reading store file, initializing fresh store:', e);
    }

    const initial = getInitialSeedData();
    this.memoryData = initial;
    this.save();
    return this.memoryData;
  }

  private save(): void {
    if (!this.memoryData) return;
    try {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(this.memoryData, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Failed writing store file to disk:', e);
    }
  }

  // Buyers
  getBuyers(): Buyer[] {
    const data = this.load();
    return data.buyers;
  }

  getBuyerById(id: string): Buyer | undefined {
    const data = this.load();
    return data.buyers.find((b) => b.id === id);
  }

  saveBuyers(newBuyers: Buyer[]): void {
    const data = this.load();
    const existingIds = new Set(data.buyers.map((b) => b.id));

    for (const b of newBuyers) {
      if (existingIds.has(b.id)) {
        const idx = data.buyers.findIndex((item) => item.id === b.id);
        data.buyers[idx] = b;
      } else {
        data.buyers.unshift(b);
      }
    }
    this.save();
  }

  updateBuyer(id: string, updates: Partial<Buyer>): Buyer | null {
    const data = this.load();
    const idx = data.buyers.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    data.buyers[idx] = { ...data.buyers[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return data.buyers[idx];
  }

  // Searches
  getSearches(): SavedSearch[] {
    const data = this.load();
    return data.searches;
  }

  saveSearch(search: SavedSearch): void {
    const data = this.load();
    data.searches.unshift(search);
    this.save();
  }

  // Campaigns
  getCampaigns(): Campaign[] {
    const data = this.load();
    return data.campaigns;
  }

  getCampaignById(id: string): Campaign | undefined {
    const data = this.load();
    return data.campaigns.find((c) => c.id === id);
  }

  createCampaign(campaign: Campaign): Campaign {
    const data = this.load();
    data.campaigns.unshift(campaign);
    this.save();
    return campaign;
  }

  updateCampaign(id: string, updates: Partial<Campaign>): Campaign | null {
    const data = this.load();
    const idx = data.campaigns.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    data.campaigns[idx] = { ...data.campaigns[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return data.campaigns[idx];
  }

  // Templates
  getTemplates(): EmailTemplate[] {
    const data = this.load();
    return data.templates;
  }

  saveTemplate(tpl: EmailTemplate): EmailTemplate {
    const data = this.load();
    data.templates.unshift(tpl);
    this.save();
    return tpl;
  }

  // Suppression
  getSuppressionList(): SuppressionEntry[] {
    const data = this.load();
    return data.suppressionList;
  }

  addToSuppression(entry: SuppressionEntry): void {
    const data = this.load();
    if (!data.suppressionList.some((s) => s.email.toLowerCase() === entry.email.toLowerCase())) {
      data.suppressionList.push(entry);
      this.save();
    }
  }

  isSuppressed(email: string): boolean {
    const data = this.load();
    return data.suppressionList.some((s) => s.email.toLowerCase() === email.toLowerCase());
  }

  // Seller Profile
  getSellerProfile() {
    const data = this.load();
    return data.sellerProfile;
  }

  updateSellerProfile(updates: Partial<AppStoreData['sellerProfile']>) {
    const data = this.load();
    data.sellerProfile = { ...data.sellerProfile, ...updates };
    this.save();
    return data.sellerProfile;
  }
}

export const appStore = new StoreManager();
