import { RawBusiness } from '@/types/api';
import { Buyer, EmailStatus } from '@/types/buyer';

export function normalizeBusinessName(name: string): string {
  if (!name) return '';
  let normalized = name.toLowerCase().trim();

  // Remove accents/diacritics
  normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Strip punctuation and special characters
  normalized = normalized.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ');

  // Strip common corporate entity suffixes
  const suffixes = [
    '\\bllc\\b',
    '\\binc\\b',
    '\\bincorporated\\b',
    '\\bcorp\\b',
    '\\bcorporation\\b',
    '\\bco\\b',
    '\\bcompany\\b',
    '\\bltd\\b',
    '\\blimited\\b',
    '\\bgroup\\b',
    '\\benterprises\\b',
    '\\bholdings\\b',
    '\\bthe\\b'
  ];

  for (const suffix of suffixes) {
    normalized = normalized.replace(new RegExp(suffix, 'gi'), ' ');
  }

  // Collapse multiple spaces
  normalized = normalized.replace(/\s+/g, ' ').trim();
  return normalized;
}

export function extractDomain(url?: string): string {
  if (!url) return '';
  try {
    let clean = url.trim().toLowerCase();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    const parsed = new URL(clean);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0].toLowerCase().trim();
  }
}

export function normalizePhoneNumber(phone?: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    return digits.substring(1);
  }
  return digits;
}

export function calculateLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function calculateStringSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  const dist = calculateLevenshteinDistance(a, b);
  return 1 - dist / maxLen;
}

export function calculateGeoDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export interface DeduplicationOptions {
  nameThreshold?: number; // default 0.82
  geoDistanceThresholdMeters?: number; // default 250m
}

export function areBusinessesDuplicates(
  b1: {
    name: string;
    normalizedName?: string;
    domain?: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
    city?: string;
  },
  b2: {
    name: string;
    normalizedName?: string;
    domain?: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
    city?: string;
  },
  options: DeduplicationOptions = {}
): boolean {
  const threshold = options.nameThreshold ?? 0.82;
  const geoLimit = options.geoDistanceThresholdMeters ?? 250;

  // 1. Strong Match: If domain is present on both and identical
  if (b1.domain && b2.domain && b1.domain.length > 3 && b1.domain === b2.domain) {
    return true;
  }

  // 2. Strong Match: If normalized phone number is present on both (at least 10 digits) and identical
  const phone1 = normalizePhoneNumber(b1.phone);
  const phone2 = normalizePhoneNumber(b2.phone);
  if (phone1 && phone2 && phone1.length >= 10 && phone1 === phone2) {
    return true;
  }

  // 3. Name similarity check
  const norm1 = b1.normalizedName || normalizeBusinessName(b1.name);
  const norm2 = b2.normalizedName || normalizeBusinessName(b2.name);

  const nameSim = calculateStringSimilarity(norm1, norm2);

  // If names are nearly identical and in the same city
  if (nameSim >= 0.88 && b1.city && b2.city && b1.city.toLowerCase() === b2.city.toLowerCase()) {
    return true;
  }

  // 4. Proximity Match: If locations exist, within 250m and name similarity >= 0.75
  if (
    b1.latitude &&
    b1.longitude &&
    b2.latitude &&
    b2.longitude &&
    b1.latitude !== 0 &&
    b2.latitude !== 0
  ) {
    const meters = calculateGeoDistanceMeters(b1.latitude, b1.longitude, b2.latitude, b2.longitude);
    if (meters <= geoLimit && nameSim >= 0.75) {
      return true;
    }
  }

  return false;
}

/**
 * Deduplicates raw businesses received from multiple external APIs
 * and merges their metadata into unified Buyer records.
 */
export function deduplicateBusinesses(rawBusinesses: RawBusiness[]): Buyer[] {
  const mergedBuyers: Buyer[] = [];

  for (const raw of rawBusinesses) {
    const normName = normalizeBusinessName(raw.name);
    const domain = extractDomain(raw.website);
    const normalizedPhone = normalizePhoneNumber(raw.phone);

    // Look for existing duplicate match
    let matchIndex = -1;
    for (let i = 0; i < mergedBuyers.length; i++) {
      const existing = mergedBuyers[i];
      if (
        areBusinessesDuplicates(
          {
            name: raw.name,
            normalizedName: normName,
            domain,
            phone: normalizedPhone,
            latitude: raw.latitude,
            longitude: raw.longitude,
            city: raw.city,
          },
          {
            name: existing.businessName,
            normalizedName: existing.normalizedName,
            domain: existing.domain,
            phone: existing.phone,
            latitude: existing.latitude,
            longitude: existing.longitude,
            city: existing.city,
          }
        )
      ) {
        matchIndex = i;
        break;
      }
    }

    if (matchIndex >= 0) {
      // Merge with existing buyer
      const existing = mergedBuyers[matchIndex];
      if (!existing.sourceProviders.includes(raw.sourceProvider)) {
        existing.sourceProviders.push(raw.sourceProvider);
      }
      // Fill missing fields
      if (!existing.website && raw.website) {
        existing.website = raw.website;
        existing.domain = domain;
      }
      if (!existing.phone && raw.phone) existing.phone = raw.phone;
      if (!existing.address && raw.address) existing.address = raw.address;
      if (!existing.city && raw.city) existing.city = raw.city;
      if (!existing.state && raw.state) existing.state = raw.state;
      if (!existing.zipCode && raw.zipCode) existing.zipCode = raw.zipCode;
      if (!existing.latitude && raw.latitude) existing.latitude = raw.latitude;
      if (!existing.longitude && raw.longitude) existing.longitude = raw.longitude;
    } else {
      // Add new unique buyer
      const id = `buyer_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const newBuyer: Buyer = {
        id,
        businessName: raw.name,
        normalizedName: normName,
        category: raw.category || 'Home Decor & Furnishings',
        description: '',
        website: raw.website,
        domain: domain || undefined,
        businessEmail: undefined,
        phone: raw.phone,
        address: raw.address,
        city: raw.city,
        state: raw.state,
        zipCode: raw.zipCode,
        country: raw.country || 'United States',
        latitude: raw.latitude,
        longitude: raw.longitude,
        buyerType: raw.category?.includes('Studio') || raw.category?.includes('Design') ? 'Interior Design Studio' : 'Home Decor Store',
        sourceProviders: [raw.sourceProvider],
        emailStatus: 'unverified' as EmailStatus,
        matchScore: 0,
        matchReasons: [],
        pipelineStatus: 'discovered',
        tags: ['New Lead', 'Discovered'],
        createdAt: new Date().toISOString(),
      };
      mergedBuyers.push(newBuyer);
    }
  }

  return mergedBuyers;
}
