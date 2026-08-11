import { BusinessMaturity } from '../../types';
import { NormalizedBusiness } from '../normalizer.service';
export interface MaturityProfile {
    maturity: BusinessMaturity;
    maturityScore: number;
    signals: string[];
    interpretation: string;
}
export declare function estimateMaturity(business: NormalizedBusiness): MaturityProfile;
