// ─────────────────────────────────────────────────────────────────
// Intelligence Orchestrator — Runs all intelligence modules in order
// Converts NormalizedBusiness → full Lead object
// ─────────────────────────────────────────────────────────────────

import { Lead, ServiceType, CityTier } from '../../types';
import { NormalizedBusiness } from '../normalizer.service';
import { getCategoryProfile } from './category.intel';
import { getLocationProfile } from './location.intel';
import { estimateMaturity } from './maturity.intel';
import { computeScore } from './scorer';
import { detectGaps } from './gaps';
import { generateRecommendation } from './recommendations';
import { generateOutreach } from './outreach';
import { generateSmartLinks } from './smartlinks';

export function runIntelligence(
  business: NormalizedBusiness,
  service: ServiceType
): Lead {
  // 1. Category profile
  const categoryProfile = getCategoryProfile(business.category);

  // 2. Location profile
  const locationProfile = getLocationProfile(business.city);

  // 3. Business maturity
  const maturityProfile = estimateMaturity(business);

  // 4. Score
  const score = computeScore(business, maturityProfile, locationProfile);

  // 5. Gaps
  const gaps = detectGaps(business);

  // 6. Recommendation
  const recommendation = generateRecommendation(
    business, service, gaps, categoryProfile, locationProfile
  );

  // 7. Outreach
  const outreachMessage = generateOutreach(business, service, gaps, categoryProfile);

  // 8. Smart links
  const smartLinks = generateSmartLinks(business);

  return {
    id: business.id,
    name: business.name,
    category: business.category,
    address: business.address,
    location: {
      lat: business.lat,
      lon: business.lon,
      city: business.city,
      country: business.country,
      tier: locationProfile.tier as CityTier,
    },
    contact: {
      website: business.website,
      phone: business.phone,
      email: business.email,
      smartLinks,
    },
    maturity: maturityProfile.maturity,
    score,
    gaps,
    recommendation,
    outreachMessage,
    enrichedAt: new Date().toISOString(),
  };
}