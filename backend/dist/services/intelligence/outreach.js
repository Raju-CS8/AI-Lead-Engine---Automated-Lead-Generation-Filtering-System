"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOutreach = void 0;
const types_1 = require("../../types");
function generateOutreach(business, service, gaps, categoryProfile) {
    const name = business.name;
    const city = business.city;
    const primaryGap = gaps[0];
    const category = categoryProfile.displayName.toLowerCase();
    let opening;
    if (primaryGap?.type === 'no_website') {
        opening = `I was researching ${category} businesses in ${city} and came across ${name}. I noticed your online presence may have room for improvement.`;
    }
    else if (primaryGap?.type === 'no_phone') {
        opening = `I came across ${name} while researching ${category} businesses in ${city} and noticed your contact information online could be more complete.`;
    }
    else {
        opening = `I came across ${name} while researching ${category} businesses in ${city} and saw an opportunity I wanted to share.`;
    }
    const pitches = {
        [types_1.ServiceType.WEB_DEVELOPMENT]: `I specialise in building high-converting websites for ${category} businesses. Whether you're looking to build from scratch or significantly upgrade your current site, I'd love to help ${name} stand out digitally in ${city}.`,
        [types_1.ServiceType.SEO]: `I help local ${category} businesses rank higher on Google and attract more customers. With the right SEO strategy, ${name} could appear at the top of searches in ${city}.`,
        [types_1.ServiceType.AI_AUTOMATION]: `I help ${category} businesses like ${name} automate customer follow-ups, bookings, and communication using AI — saving hours every week and capturing leads 24/7.`,
    };
    const action = categoryProfile.specificActions[service][0] ?? 'improve your digital presence';
    return `Hi,

${opening}

${pitches[service]}

Specifically for a ${category} like yours, I'd focus on: ${action.toLowerCase()}.

Would you be open to a quick 15-minute call this week? I'd love to show you exactly what this could look like for ${name} — no commitment needed.

Best regards`;
}
exports.generateOutreach = generateOutreach;
//# sourceMappingURL=outreach.js.map