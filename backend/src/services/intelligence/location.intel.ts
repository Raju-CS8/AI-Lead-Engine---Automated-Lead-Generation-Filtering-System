// ─────────────────────────────────────────────────────────────────
// Location Intelligence — City tier detection + scoring bonus
// Tier 2/3 cities = less competition = higher opportunity
// ─────────────────────────────────────────────────────────────────

import { CityTier } from '../../types';

const TIER1_CITIES = new Set([
  // India
  'mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai',
  'kolkata', 'pune', 'ahmedabad',
  // USA
  'new york', 'los angeles', 'chicago', 'houston', 'phoenix',
  'philadelphia', 'san antonio', 'san diego', 'dallas', 'san jose',
  // UK
  'london', 'birmingham', 'manchester', 'leeds', 'glasgow',
  // Global
  'dubai', 'singapore', 'sydney', 'melbourne', 'toronto',
  'paris', 'berlin', 'tokyo', 'beijing', 'shanghai',
]);

const TIER2_CITIES = new Set([
  // India
  'coimbatore', 'madurai', 'surat', 'lucknow', 'kanpur', 'nagpur',
  'indore', 'thane', 'bhopal', 'visakhapatnam', 'pimpri', 'patna',
  'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad',
  'meerut', 'rajkot', 'kalyan', 'vasai', 'varanasi', 'srinagar',
  'jamshedpur', 'dhanbad', 'amritsar', 'allahabad', 'ranchi', 'jabalpur',
  // USA
  'austin', 'jacksonville', 'fort worth', 'columbus', 'charlotte',
  'indianapolis', 'san francisco', 'seattle', 'denver', 'nashville',
  'oklahoma city', 'el paso', 'boston', 'portland', 'las vegas',
  // UK
  'bristol', 'sheffield', 'edinburgh', 'liverpool', 'nottingham',
  'cardiff', 'leicester', 'coventry',
]);

export interface LocationProfile {
  tier: CityTier;
  scoreBonus: number;
  competitionLevel: 'high' | 'medium' | 'low';
  opportunityNote: string;
}

export function getLocationProfile(city: string): LocationProfile {
  const normalized = city.toLowerCase().trim();

  if (TIER1_CITIES.has(normalized)) {
    return {
      tier: CityTier.TIER1,
      scoreBonus: 0,
      competitionLevel: 'high',
      opportunityNote: `${city} is a major metro — competition is high but volume is massive.`,
    };
  }

  if (TIER2_CITIES.has(normalized)) {
    return {
      tier: CityTier.TIER2,
      scoreBonus: 10,
      competitionLevel: 'medium',
      opportunityNote: `${city} is a growing city — moderate competition with strong digital adoption growth.`,
    };
  }

  return {
    tier: CityTier.TIER3,
    scoreBonus: 20,
    competitionLevel: 'low',
    opportunityNote: `${city} is an underserved market — very low competition, high opportunity for early movers.`,
  };
}