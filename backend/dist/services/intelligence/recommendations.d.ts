import { Recommendation, ServiceType, DetectedGap } from '../../types';
import { CategoryProfile } from './category.intel';
import { LocationProfile } from './location.intel';
import { NormalizedBusiness } from '../normalizer.service';
export declare function generateRecommendation(business: NormalizedBusiness, service: ServiceType, gaps: DetectedGap[], categoryProfile: CategoryProfile, locationProfile: LocationProfile): Recommendation;
