// ─────────────────────────────────────────────────────────────────
// Scoring Engine — 0–100 score based on opportunity signals
// Core principle: Missing data = higher score = higher priority
// ─────────────────────────────────────────────────────────────────

import { LeadScore, Priority, ScoreBreakdown } from '../../types';
import { NormalizedBusiness } from '../normalizer.service';
import { MaturityProfile } from './maturity.intel';
import { LocationProfile } from './location.intel';

export function computeScore(
  business: NormalizedBusiness,
  maturity: MaturityProfile,
  location: LocationProfile
): LeadScore {
  const breakdown: ScoreBreakdown = {
    websiteScore: 0,
    contactScore: 0,
    presenceScore: 0,
    locationBonus: location.scoreBonus,
    maturityBonus: 0,
  };

  // Website gap — biggest opportunity
  if (!business.website) breakdown.websiteScore = 40;

  // Contact gap
  if (!business.phone) breakdown.contactScore += 15;
  if (!business.email) breakdown.contactScore += 10;

  // Presence gap
  if (!business.openingHours) breakdown.presenceScore += 10;

  // Maturity bonus (inverse — lower maturity = higher bonus)
  breakdown.maturityBonus =
    maturity.maturity === 'low' ? 15 : maturity.maturity === 'partial' ? 8 : 0;

  // Base score
  const base = 10;
  const total = Math.min(
    100,
    base +
      breakdown.websiteScore +
      breakdown.contactScore +
      breakdown.presenceScore +
      breakdown.locationBonus +
      breakdown.maturityBonus
  );

  let priority: Priority;
  if (total >= 65) priority = Priority.HIGH;
  else if (total >= 35) priority = Priority.MEDIUM;
  else priority = Priority.LOW;

  return { value: total, priority, breakdown };
}