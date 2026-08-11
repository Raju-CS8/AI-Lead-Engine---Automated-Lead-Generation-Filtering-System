import { OSMElement, OSMTags } from '../types';
export interface NormalizedBusiness {
    id: string;
    osmId: number;
    name: string;
    category: string;
    address: string;
    lat: number;
    lon: number;
    city: string;
    country: string;
    website: string | null;
    phone: string | null;
    email: string | null;
    openingHours: string | null;
    rawTags: OSMTags;
}
export declare function normalizeElement(element: OSMElement, fallbackCity: string): NormalizedBusiness | null;
export declare function normalizeAll(elements: OSMElement[], fallbackCity: string): NormalizedBusiness[];
