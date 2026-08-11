import { ServiceType, DetectedGap } from '../../types';
import { NormalizedBusiness } from '../normalizer.service';
import { CategoryProfile } from './category.intel';
export declare function generateOutreach(business: NormalizedBusiness, service: ServiceType, gaps: DetectedGap[], categoryProfile: CategoryProfile): string;
