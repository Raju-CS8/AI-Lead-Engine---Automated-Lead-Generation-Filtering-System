"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateMaturity = void 0;
const types_1 = require("../../types");
function estimateMaturity(business) {
    const signals = [];
    let maturityScore = 0;
    if (business.website) {
        maturityScore += 40;
        signals.push('Has website');
    }
    else {
        signals.push('No website detected');
    }
    if (business.phone) {
        maturityScore += 25;
        signals.push('Phone number listed');
    }
    else {
        signals.push('No phone number found');
    }
    if (business.email) {
        maturityScore += 20;
        signals.push('Email address available');
    }
    else {
        signals.push('No email found');
    }
    if (business.openingHours) {
        maturityScore += 15;
        signals.push('Opening hours listed');
    }
    else {
        signals.push('No opening hours data');
    }
    let maturity;
    let interpretation;
    if (maturityScore >= 70) {
        maturity = types_1.BusinessMaturity.ESTABLISHED;
        interpretation = 'Business has solid digital foundations — focus on optimisation and automation.';
    }
    else if (maturityScore >= 30) {
        maturity = types_1.BusinessMaturity.PARTIAL;
        interpretation = 'Business has partial digital presence — significant gaps to address.';
    }
    else {
        maturity = types_1.BusinessMaturity.LOW;
        interpretation = 'Business has minimal digital presence — strong opportunity to build from scratch.';
    }
    return { maturity, maturityScore, signals, interpretation };
}
exports.estimateMaturity = estimateMaturity;
//# sourceMappingURL=maturity.intel.js.map