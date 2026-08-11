import { CityTier } from '../../types';
export interface LocationProfile {
    tier: CityTier;
    scoreBonus: number;
    competitionLevel: 'high' | 'medium' | 'low';
    opportunityNote: string;
}
export declare function getLocationProfile(city: string): LocationProfile;
