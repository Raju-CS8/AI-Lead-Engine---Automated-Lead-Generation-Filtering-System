import { ServiceType } from '../../types';
export interface CategoryProfile {
    displayName: string;
    primaryNeeds: string[];
    webDevValue: string;
    seoValue: string;
    aiValue: string;
    specificActions: Record<ServiceType, string[]>;
}
export declare function getCategoryProfile(category: string): CategoryProfile;
