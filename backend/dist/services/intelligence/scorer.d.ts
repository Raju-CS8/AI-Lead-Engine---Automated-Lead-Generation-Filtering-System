import { LeadScore } from '../../types';
import { NormalizedBusiness } from '../normalizer.service';
import { MaturityProfile } from './maturity.intel';
import { LocationProfile } from './location.intel';
export declare function computeScore(business: NormalizedBusiness, maturity: MaturityProfile, location: LocationProfile): LeadScore;
