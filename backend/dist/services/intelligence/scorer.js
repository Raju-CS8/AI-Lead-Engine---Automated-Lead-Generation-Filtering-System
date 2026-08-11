"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeScore = void 0;
const types_1 = require("../../types");
function computeScore(business, maturity, location) {
    const breakdown = {
        websiteScore: 0,
        contactScore: 0,
        presenceScore: 0,
        locationBonus: location.scoreBonus,
        maturityBonus: 0,
    };
    if (!business.website)
        breakdown.websiteScore = 40;
    if (!business.phone)
        breakdown.contactScore += 15;
    if (!business.email)
        breakdown.contactScore += 10;
    if (!business.openingHours)
        breakdown.presenceScore += 10;
    breakdown.maturityBonus =
        maturity.maturity === 'low' ? 15 : maturity.maturity === 'partial' ? 8 : 0;
    const base = 10;
    const total = Math.min(100, base +
        breakdown.websiteScore +
        breakdown.contactScore +
        breakdown.presenceScore +
        breakdown.locationBonus +
        breakdown.maturityBonus);
    let priority;
    if (total >= 65)
        priority = types_1.Priority.HIGH;
    else if (total >= 35)
        priority = types_1.Priority.MEDIUM;
    else
        priority = types_1.Priority.LOW;
    return { value: total, priority, breakdown };
}
exports.computeScore = computeScore;
//# sourceMappingURL=scorer.js.map