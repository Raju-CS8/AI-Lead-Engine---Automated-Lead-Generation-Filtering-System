"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAll = exports.normalizeElement = void 0;
const uuid_1 = require("uuid");
function extractCategory(tags) {
    const categoryFields = [
        'amenity', 'shop', 'office', 'healthcare',
        'tourism', 'leisure', 'craft',
    ];
    for (const field of categoryFields) {
        const val = tags[field];
        if (val) {
            return val
                .split('_')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');
        }
    }
    return 'Business';
}
function buildAddress(tags) {
    const parts = [];
    if (tags['addr:housenumber'])
        parts.push(tags['addr:housenumber']);
    if (tags['addr:street'])
        parts.push(tags['addr:street']);
    if (tags['addr:city'])
        parts.push(tags['addr:city']);
    if (tags['addr:country'])
        parts.push(tags['addr:country']);
    return parts.join(', ') || 'Address not available';
}
function extractCity(tags, fallbackLocation) {
    return tags['addr:city'] ?? fallbackLocation;
}
function extractCountry(tags) {
    return tags['addr:country'] ?? 'Unknown';
}
function normalizePhone(phone) {
    if (!phone)
        return null;
    return phone.trim() || null;
}
function normalizeWebsite(website) {
    if (!website)
        return null;
    const w = website.trim();
    if (!w)
        return null;
    if (!w.startsWith('http'))
        return `https://${w}`;
    return w;
}
function normalizeElement(element, fallbackCity) {
    const tags = element.tags ?? {};
    const name = tags.name;
    if (!name)
        return null;
    const lat = element.lat ?? element.center?.lat;
    const lon = element.lon ?? element.center?.lon;
    if (!lat || !lon)
        return null;
    return {
        id: (0, uuid_1.v4)(),
        osmId: element.id,
        name,
        category: extractCategory(tags),
        address: buildAddress(tags),
        lat,
        lon,
        city: extractCity(tags, fallbackCity),
        country: extractCountry(tags),
        website: normalizeWebsite(tags.website),
        phone: normalizePhone(tags.phone),
        email: tags.email?.trim() ?? null,
        openingHours: tags.opening_hours ?? null,
        rawTags: tags,
    };
}
exports.normalizeElement = normalizeElement;
function normalizeAll(elements, fallbackCity) {
    const results = [];
    for (const el of elements) {
        const normalized = normalizeElement(el, fallbackCity);
        if (normalized)
            results.push(normalized);
    }
    return results;
}
exports.normalizeAll = normalizeAll;
//# sourceMappingURL=normalizer.service.js.map