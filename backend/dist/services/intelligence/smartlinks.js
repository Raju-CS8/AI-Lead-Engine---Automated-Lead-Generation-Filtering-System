"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSmartLinks = void 0;
function generateSmartLinks(business) {
    const searchQuery = encodeURIComponent(`${business.name} ${business.city} official website`);
    const mapsQuery = encodeURIComponent(`${business.name} ${business.address}`);
    return {
        googleSearchUrl: `https://www.google.com/search?q=${searchQuery}`,
        googleMapsUrl: `https://www.google.com/maps/search/${mapsQuery}`,
    };
}
exports.generateSmartLinks = generateSmartLinks;
//# sourceMappingURL=smartlinks.js.map