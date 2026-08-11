"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocationProfile = void 0;
const types_1 = require("../../types");
const TIER1_CITIES = new Set([
    'mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai',
    'kolkata', 'pune', 'ahmedabad',
    'new york', 'los angeles', 'chicago', 'houston', 'phoenix',
    'philadelphia', 'san antonio', 'san diego', 'dallas', 'san jose',
    'london', 'birmingham', 'manchester', 'leeds', 'glasgow',
    'dubai', 'singapore', 'sydney', 'melbourne', 'toronto',
    'paris', 'berlin', 'tokyo', 'beijing', 'shanghai',
]);
const TIER2_CITIES = new Set([
    'coimbatore', 'madurai', 'surat', 'lucknow', 'kanpur', 'nagpur',
    'indore', 'thane', 'bhopal', 'visakhapatnam', 'pimpri', 'patna',
    'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad',
    'meerut', 'rajkot', 'kalyan', 'vasai', 'varanasi', 'srinagar',
    'jamshedpur', 'dhanbad', 'amritsar', 'allahabad', 'ranchi', 'jabalpur',
    'austin', 'jacksonville', 'fort worth', 'columbus', 'charlotte',
    'indianapolis', 'san francisco', 'seattle', 'denver', 'nashville',
    'oklahoma city', 'el paso', 'boston', 'portland', 'las vegas',
    'bristol', 'sheffield', 'edinburgh', 'liverpool', 'nottingham',
    'cardiff', 'leicester', 'coventry',
]);
function getLocationProfile(city) {
    const normalized = city.toLowerCase().trim();
    if (TIER1_CITIES.has(normalized)) {
        return {
            tier: types_1.CityTier.TIER1,
            scoreBonus: 0,
            competitionLevel: 'high',
            opportunityNote: `${city} is a major metro — competition is high but volume is massive.`,
        };
    }
    if (TIER2_CITIES.has(normalized)) {
        return {
            tier: types_1.CityTier.TIER2,
            scoreBonus: 10,
            competitionLevel: 'medium',
            opportunityNote: `${city} is a growing city — moderate competition with strong digital adoption growth.`,
        };
    }
    return {
        tier: types_1.CityTier.TIER3,
        scoreBonus: 20,
        competitionLevel: 'low',
        opportunityNote: `${city} is an underserved market — very low competition, high opportunity for early movers.`,
    };
}
exports.getLocationProfile = getLocationProfile;
//# sourceMappingURL=location.intel.js.map