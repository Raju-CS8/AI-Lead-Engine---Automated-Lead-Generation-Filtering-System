"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectGaps = void 0;
function detectGaps(business) {
    const gaps = [];
    if (!business.website) {
        gaps.push({
            type: 'no_website',
            label: 'Website Not Listed in OSM',
            severity: 'critical',
            opportunityNote: `No website found in public data for ${business.name}. Verify via Google Search link — if confirmed missing, this is a strong opportunity.`,
        });
    }
    if (!business.phone) {
        gaps.push({
            type: 'no_phone',
            label: 'Phone Not Listed',
            severity: 'moderate',
            opportunityNote: 'No phone number found in public data. Use Google Search link to verify.',
        });
    }
    if (!business.email) {
        gaps.push({
            type: 'no_email',
            label: 'No Email Found',
            severity: 'moderate',
            opportunityNote: 'No email found in public data.',
        });
    }
    if (!business.openingHours) {
        gaps.push({
            type: 'no_google_business',
            label: 'Incomplete Public Profile',
            severity: 'minor',
            opportunityNote: 'Missing opening hours in public data suggests incomplete online profile.',
        });
    }
    return gaps;
}
exports.detectGaps = detectGaps;
//# sourceMappingURL=gaps.js.map