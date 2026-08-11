"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRecommendation = void 0;
const types_1 = require("../../types");
function generateRecommendation(business, service, gaps, categoryProfile, locationProfile) {
    const hasWebsiteGap = gaps.some((g) => g.type === 'no_website');
    const hasContactGap = gaps.some((g) => g.type === 'no_phone' || g.type === 'no_email');
    const reasonParts = [];
    if (hasWebsiteGap) {
        reasonParts.push(`${business.name} has no website`);
    }
    if (hasContactGap) {
        reasonParts.push('limited contact information');
    }
    if (locationProfile.competitionLevel === 'low') {
        reasonParts.push(`and operates in an underserved market (${business.city})`);
    }
    const baseReason = reasonParts.length > 0
        ? `${reasonParts.join(', ')} — making this a strong ${service} opportunity.`
        : `${business.name} can significantly improve their digital presence with ${service}.`;
    const potentialValueMap = {
        [types_1.ServiceType.WEB_DEVELOPMENT]: categoryProfile.webDevValue,
        [types_1.ServiceType.SEO]: categoryProfile.seoValue,
        [types_1.ServiceType.AI_AUTOMATION]: categoryProfile.aiValue,
    };
    return {
        service,
        reason: baseReason,
        specificActions: categoryProfile.specificActions[service],
        potentialValue: potentialValueMap[service],
    };
}
exports.generateRecommendation = generateRecommendation;
//# sourceMappingURL=recommendations.js.map