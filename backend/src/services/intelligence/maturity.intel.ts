// ─────────────────────────────────────────────────────────────────
// Business Maturity Estimator
// Determines digital maturity from available data signals
// Lower maturity = higher opportunity = higher priority
// ─────────────────────────────────────────────────────────────────

import { BusinessMaturity } from '../../types';
import { NormalizedBusiness } from '../normalizer.service';

export interface MaturityProfile {
  maturity: BusinessMaturity;
  maturityScore: number;
  signals: string[];
  interpretation: string;
}

export function estimateMaturity(business: NormalizedBusiness): MaturityProfile {
  const signals: string[] = [];
  let maturityScore = 0;

  // Website
  if (business.website) {
    maturityScore += 40;
    signals.push('Has website');
  } else {
    signals.push('No website detected');
  }

  // Phone
  if (business.phone) {
    maturityScore += 25;
    signals.push('Phone number listed');
  } else {
    signals.push('No phone number found');
  }

  // Email
  if (business.email) {
    maturityScore += 20;
    signals.push('Email address available');
  } else {
    signals.push('No email found');
  }

  // Opening hours (indicates active Google Business)
  if (business.openingHours) {
    maturityScore += 15;
    signals.push('Opening hours listed');
  } else {
    signals.push('No opening hours data');
  }

  let maturity: BusinessMaturity;
  let interpretation: string;

  if (maturityScore >= 70) {
    maturity = BusinessMaturity.ESTABLISHED;
    interpretation = 'Business has solid digital foundations — focus on optimisation and automation.';
  } else if (maturityScore >= 30) {
    maturity = BusinessMaturity.PARTIAL;
    interpretation = 'Business has partial digital presence — significant gaps to address.';
  } else {
    maturity = BusinessMaturity.LOW;
    interpretation = 'Business has minimal digital presence — strong opportunity to build from scratch.';
  }

  return { maturity, maturityScore, signals, interpretation };
}