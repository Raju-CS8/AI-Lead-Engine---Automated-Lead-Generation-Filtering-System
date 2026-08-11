"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runIntelligence = void 0;
const category_intel_1 = require("./category.intel");
const location_intel_1 = require("./location.intel");
const maturity_intel_1 = require("./maturity.intel");
const scorer_1 = require("./scorer");
const gaps_1 = require("./gaps");
const recommendations_1 = require("./recommendations");
const outreach_1 = require("./outreach");
const smartlinks_1 = require("./smartlinks");
function runIntelligence(business, service) {
    const categoryProfile = (0, category_intel_1.getCategoryProfile)(business.category);
    const locationProfile = (0, location_intel_1.getLocationProfile)(business.city);
    const maturityProfile = (0, maturity_intel_1.estimateMaturity)(business);
    const score = (0, scorer_1.computeScore)(business, maturityProfile, locationProfile);
    const gaps = (0, gaps_1.detectGaps)(business);
    const recommendation = (0, recommendations_1.generateRecommendation)(business, service, gaps, categoryProfile, locationProfile);
    const outreachMessage = (0, outreach_1.generateOutreach)(business, service, gaps, categoryProfile);
    const smartLinks = (0, smartlinks_1.generateSmartLinks)(business);
    return {
        id: business.id,
        name: business.name,
        category: business.category,
        address: business.address,
        location: {
            lat: business.lat,
            lon: business.lon,
            city: business.city,
            country: business.country,
            tier: locationProfile.tier,
        },
        contact: {
            website: business.website,
            phone: business.phone,
            email: business.email,
            smartLinks,
        },
        maturity: maturityProfile.maturity,
        score,
        gaps,
        recommendation,
        outreachMessage,
        enrichedAt: new Date().toISOString(),
    };
}
exports.runIntelligence = runIntelligence;
//# sourceMappingURL=index.js.map