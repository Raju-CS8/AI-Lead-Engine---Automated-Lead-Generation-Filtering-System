"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBusinesses = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../utils/logger");
const OVERPASS_ENDPOINTS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    'https://overpass.openstreetmap.ru/api/interpreter',
];
const INDUSTRY_TAGS = {
    restaurant: [{ k: 'amenity', v: 'restaurant' }, { k: 'amenity', v: 'fast_food' }, { k: 'amenity', v: 'food_court' }],
    dental: [{ k: 'amenity', v: 'dentist' }, { k: 'healthcare', v: 'dentist' }, { k: 'amenity', v: 'clinic' }],
    gym: [{ k: 'leisure', v: 'fitness_centre' }, { k: 'amenity', v: 'gym' }, { k: 'leisure', v: 'sports_centre' }],
    salon: [{ k: 'shop', v: 'hairdresser' }, { k: 'shop', v: 'beauty' }, { k: 'amenity', v: 'beauty_salon' }],
    clinic: [{ k: 'amenity', v: 'clinic' }, { k: 'amenity', v: 'doctors' }, { k: 'healthcare', v: 'centre' }],
    hotel: [{ k: 'tourism', v: 'hotel' }, { k: 'tourism', v: 'guest_house' }, { k: 'tourism', v: 'hostel' }, { k: 'building', v: 'hotel' }],
    cafe: [{ k: 'amenity', v: 'cafe' }, { k: 'amenity', v: 'coffee_shop' }],
    pharmacy: [{ k: 'amenity', v: 'pharmacy' }, { k: 'healthcare', v: 'pharmacy' }],
    school: [{ k: 'amenity', v: 'school' }, { k: 'amenity', v: 'college' }, { k: 'amenity', v: 'university' }],
    'real estate': [{ k: 'office', v: 'estate_agent' }, { k: 'office', v: 'real_estate' }, { k: 'shop', v: 'estate_agent' }],
    lawyer: [{ k: 'office', v: 'lawyer' }, { k: 'office', v: 'legal' }, { k: 'office', v: 'attorney' }],
    accountant: [{ k: 'office', v: 'accountant' }, { k: 'office', v: 'tax_advisor' }, { k: 'office', v: 'financial' }],
    plumber: [{ k: 'craft', v: 'plumber' }, { k: 'shop', v: 'plumber' }],
    electrician: [{ k: 'craft', v: 'electrician' }, { k: 'shop', v: 'electrical' }],
    mechanic: [{ k: 'shop', v: 'car_repair' }, { k: 'amenity', v: 'car_repair' }, { k: 'shop', v: 'vehicle' }],
    bakery: [{ k: 'shop', v: 'bakery' }, { k: 'amenity', v: 'bakery' }],
    spa: [{ k: 'leisure', v: 'spa' }, { k: 'shop', v: 'massage' }, { k: 'amenity', v: 'spa' }],
    yoga: [{ k: 'sport', v: 'yoga' }, { k: 'leisure', v: 'fitness_centre' }, { k: 'amenity', v: 'yoga' }],
    photography: [{ k: 'shop', v: 'photography' }, { k: 'craft', v: 'photographer' }],
    hospital: [{ k: 'amenity', v: 'hospital' }, { k: 'healthcare', v: 'hospital' }],
};
function buildQuery(industry, location, limit) {
    const tags = INDUSTRY_TAGS[industry.toLowerCase()] ?? [{ k: 'amenity', v: industry }];
    const timeout = 25;
    const unions = tags.flatMap(({ k, v }) => [
        `node["${k}"="${v}"](area.searchArea);`,
        `way["${k}"="${v}"](area.searchArea);`,
    ]).join('\n  ');
    return `[out:json][timeout:${timeout}];
area[name="${location}"]->.searchArea;
(
  ${unions}
);
out center ${limit};`;
}
async function tryEndpoint(query, endpoint) {
    const params = new URLSearchParams();
    params.append('data', query);
    const response = await axios_1.default.post(endpoint, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'User-Agent': 'AILeadEngine/1.0',
        },
        timeout: 25000,
    });
    return response.data?.elements ?? [];
}
async function fetchBusinesses(industry, location, limit) {
    const start = Date.now();
    const locationVariants = getLocationVariants(location);
    for (const cityName of locationVariants) {
        const query = buildQuery(industry, cityName, limit);
        logger_1.logger.info('Overpass query starting', { industry, location: cityName, limit });
        for (const endpoint of OVERPASS_ENDPOINTS) {
            try {
                const elements = await tryEndpoint(query, endpoint);
                const named = elements.filter((e) => e.tags?.name);
                if (named.length > 0) {
                    logger_1.logger.info('Overpass success', {
                        endpoint, location: cityName,
                        total: elements.length, named: named.length,
                        durationMs: Date.now() - start,
                    });
                    return named.slice(0, limit);
                }
            }
            catch (err) {
                logger_1.logger.warn('Overpass endpoint failed, trying next', {
                    endpoint,
                    error: err instanceof Error ? err.message : String(err),
                });
            }
        }
    }
    logger_1.logger.warn('All area queries failed, trying bbox fallback', { location });
    return await bboxFallback(industry, location, limit, start);
}
exports.fetchBusinesses = fetchBusinesses;
function getLocationVariants(location) {
    const lower = location.toLowerCase().trim();
    const variants = {
        'bangalore': ['Bengaluru', 'Bangalore'],
        'bengaluru': ['Bengaluru', 'Bangalore'],
        'bombay': ['Mumbai'],
        'mumbai': ['Mumbai'],
        'madras': ['Chennai'],
        'chennai': ['Chennai'],
        'calcutta': ['Kolkata'],
        'kolkata': ['Kolkata'],
        'delhi': ['Delhi', 'New Delhi'],
        'new delhi': ['New Delhi', 'Delhi'],
        'hyderabad': ['Hyderabad'],
        'pune': ['Pune'],
        'ahmedabad': ['Ahmedabad'],
        'jaipur': ['Jaipur'],
        'coimbatore': ['Coimbatore'],
        'madurai': ['Madurai'],
        'london': ['London'],
        'new york': ['New York City', 'New York'],
        'sydney': ['Sydney'],
        'melbourne': ['Melbourne'],
    };
    return variants[lower] ?? [location];
}
async function bboxFallback(industry, location, limit, start) {
    try {
        const nominatim = await axios_1.default.get('https://nominatim.openstreetmap.org/search', {
            params: { q: location, format: 'json', limit: 1 },
            headers: { 'User-Agent': 'AILeadEngine/1.0' },
            timeout: 8000,
        });
        const result = nominatim.data?.[0];
        if (!result?.boundingbox) {
            logger_1.logger.error('Nominatim found no location', { location });
            return [];
        }
        const [south, north, west, east] = result.boundingbox;
        const bbox = `${south},${west},${north},${east}`;
        const tags = INDUSTRY_TAGS[industry.toLowerCase()] ?? [{ k: 'amenity', v: industry }];
        const unions = tags.flatMap(({ k, v }) => [
            `node["${k}"="${v}"](${bbox});`,
            `way["${k}"="${v}"](${bbox});`,
        ]).join('\n  ');
        const bboxQuery = `[out:json][timeout:25];\n(\n  ${unions}\n);\nout center ${limit};`;
        for (const endpoint of OVERPASS_ENDPOINTS) {
            try {
                const elements = await tryEndpoint(bboxQuery, endpoint);
                const named = elements.filter((e) => e.tags?.name);
                logger_1.logger.info('Bbox fallback success', {
                    endpoint,
                    named: named.length,
                    durationMs: Date.now() - start,
                });
                return named.slice(0, limit);
            }
            catch (err) {
                logger_1.logger.warn('Bbox endpoint failed', {
                    endpoint,
                    error: err instanceof Error ? err.message : String(err),
                });
            }
        }
    }
    catch (err) {
        logger_1.logger.error('Bbox fallback failed', {
            error: err instanceof Error ? err.message : String(err),
        });
    }
    return [];
}
//# sourceMappingURL=overpass.service.js.map