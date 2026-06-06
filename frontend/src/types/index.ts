export enum Priority { HIGH = 'high', MEDIUM = 'medium', LOW = 'low' }
export enum ServiceType {
  WEB_DEVELOPMENT = 'Web Development',
  SEO = 'SEO',
  AI_AUTOMATION = 'AI Automation',
}
export enum BusinessMaturity { LOW = 'low', PARTIAL = 'partial', ESTABLISHED = 'established' }
export enum CityTier { TIER1 = 'tier1', TIER2 = 'tier2', TIER3 = 'tier3' }
export type GapType = 'no_website' | 'no_phone' | 'no_email' | 'no_social' | 'no_google_business';
export type GapSeverity = 'critical' | 'moderate' | 'minor';

export interface SmartLinks { googleSearchUrl: string; googleMapsUrl: string }
export interface Contact { website: string | null; phone: string | null; email: string | null; smartLinks: SmartLinks }
export interface ScoreBreakdown { websiteScore: number; contactScore: number; presenceScore: number; locationBonus: number; maturityBonus: number }
export interface LeadScore { value: number; priority: Priority; breakdown: ScoreBreakdown }
export interface DetectedGap { type: GapType; label: string; severity: GapSeverity; opportunityNote: string }
export interface Recommendation { service: ServiceType; reason: string; specificActions: string[]; potentialValue: string }
export interface LeadLocation { lat: number; lon: number; city: string; country: string; tier: CityTier }

export interface Lead {
  id: string; name: string; category: string; address: string;
  location: LeadLocation; contact: Contact; maturity: BusinessMaturity;
  score: LeadScore; gaps: DetectedGap[]; recommendation: Recommendation;
  outreachMessage: string; enrichedAt: string;
}

export interface ApiMeta {
  total: number; highPriority: number; mediumPriority: number; lowPriority: number;
  gapsDetected: number; averageScore: number; location: string; industry: string;
  service: ServiceType; generatedAt: string; cached: boolean; source: string;
}

export interface ApiResponse<T> { success: boolean; meta: ApiMeta; data: T; error?: string }
export interface LeadSearchParams { industry: string; location: string; service: ServiceType; limit: number }