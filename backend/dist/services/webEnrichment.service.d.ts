import { NormalizedBusiness } from './normalizer.service';
export interface EnrichmentResult {
    website: string | null;
    websiteConfidence: 'confirmed' | 'found' | 'not_found';
    phone: string | null;
}
export declare function enrichBusiness(business: NormalizedBusiness): Promise<EnrichmentResult>;
