// ─────────────────────────────────────────────────────────────────
// Recommendations Engine — Maps gaps + category → specific pitch
// ─────────────────────────────────────────────────────────────────

import { Recommendation, ServiceType, DetectedGap } from '../../types';
import { CategoryProfile } from './category.intel';
import { LocationProfile } from './location.intel';
import { NormalizedBusiness } from '../normalizer.service';

export function generateRecommendation(
  business: NormalizedBusiness,
  service: ServiceType,
  gaps: DetectedGap[],
  categoryProfile: CategoryProfile,
  locationProfile: LocationProfile
): Recommendation {
  const hasWebsiteGap = gaps.some((g) => g.type === 'no_website');
  const hasContactGap = gaps.some((g) => g.type === 'no_phone' || g.type === 'no_email');

  const reasonParts: string[] = [];

  if (hasWebsiteGap) {
    reasonParts.push(`${business.name} has no website`);
  }
  if (hasContactGap) {
    reasonParts.push('limited contact information');
  }
  if (locationProfile.competitionLevel === 'low') {
    reasonParts.push(`and operates in an underserved market (${business.city})`);
  }

  const baseReason =
    reasonParts.length > 0
      ? `${reasonParts.join(', ')} — making this a strong ${service} opportunity.`
      : `${business.name} can significantly improve their digital presence with ${service}.`;

  const potentialValueMap: Record<ServiceType, string> = {
    [ServiceType.WEB_DEVELOPMENT]: categoryProfile.webDevValue,
    [ServiceType.SEO]: categoryProfile.seoValue,
    [ServiceType.AI_AUTOMATION]: categoryProfile.aiValue,
  };

  return {
    service,
    reason: baseReason,
    specificActions: categoryProfile.specificActions[service],
    potentialValue: potentialValueMap[service],
  };
}