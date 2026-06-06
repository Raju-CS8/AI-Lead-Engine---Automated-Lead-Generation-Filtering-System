// ─────────────────────────────────────────────────────────────────
// Normalizer — Raw OSM element → Clean NormalizedBusiness
// Missing data is expected and preserved as null (used by intelligence)
// ─────────────────────────────────────────────────────────────────

import { v4 as uuidv4 } from 'uuid';
import { OSMElement, OSMTags } from '../types';

export interface NormalizedBusiness {
  id: string;
  osmId: number;
  name: string;
  category: string;
  address: string;
  lat: number;
  lon: number;
  city: string;
  country: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  openingHours: string | null;
  rawTags: OSMTags;
}

function extractCategory(tags: OSMTags): string {
  const categoryFields = [
    'amenity', 'shop', 'office', 'healthcare',
    'tourism', 'leisure', 'craft',
  ] as const;

  for (const field of categoryFields) {
    const val = tags[field];
    if (val) {
      return val
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
  }
  return 'Business';
}

function buildAddress(tags: OSMTags): string {
  const parts: string[] = [];
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:city']) parts.push(tags['addr:city']);
  if (tags['addr:country']) parts.push(tags['addr:country']);
  return parts.join(', ') || 'Address not available';
}

function extractCity(tags: OSMTags, fallbackLocation: string): string {
  return tags['addr:city'] ?? fallbackLocation;
}

function extractCountry(tags: OSMTags): string {
  return tags['addr:country'] ?? 'Unknown';
}

function normalizePhone(phone: string | undefined): string | null {
  if (!phone) return null;
  return phone.trim() || null;
}

function normalizeWebsite(website: string | undefined): string | null {
  if (!website) return null;
  const w = website.trim();
  if (!w) return null;
  if (!w.startsWith('http')) return `https://${w}`;
  return w;
}

export function normalizeElement(
  element: OSMElement,
  fallbackCity: string
): NormalizedBusiness | null {
  const tags = element.tags ?? {};
  const name = tags.name;
  if (!name) return null;

  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  if (!lat || !lon) return null;

  return {
    id: uuidv4(),
    osmId: element.id,
    name,
    category: extractCategory(tags),
    address: buildAddress(tags),
    lat,
    lon,
    city: extractCity(tags, fallbackCity),
    country: extractCountry(tags),
    website: normalizeWebsite(tags.website),
    phone: normalizePhone(tags.phone),
    email: tags.email?.trim() ?? null,
    openingHours: tags.opening_hours ?? null,
    rawTags: tags,
  };
}

export function normalizeAll(
  elements: OSMElement[],
  fallbackCity: string
): NormalizedBusiness[] {
  const results: NormalizedBusiness[] = [];
  for (const el of elements) {
    const normalized = normalizeElement(el, fallbackCity);
    if (normalized) results.push(normalized);
  }
  return results;
}