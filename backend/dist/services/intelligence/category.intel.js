"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryProfile = void 0;
const types_1 = require("../../types");
const CATEGORY_PROFILES = {
    restaurant: {
        displayName: 'Restaurant',
        primaryNeeds: ['Online menu', 'Table booking', 'Google Business', 'Delivery integration'],
        webDevValue: '$2,000 – $6,000',
        seoValue: '$400 – $1,200/mo',
        aiValue: '$3,000 – $10,000',
        specificActions: {
            [types_1.ServiceType.WEB_DEVELOPMENT]: ['Build menu website', 'Add online reservation', 'Integrate food delivery', 'Mobile-first design'],
            [types_1.ServiceType.SEO]: ['Local SEO for "restaurant near me"', 'Google Business Profile', 'Food blog content', 'Review management'],
            [types_1.ServiceType.AI_AUTOMATION]: ['AI chatbot for reservations', 'Automated order confirmations', 'Customer feedback analysis'],
        },
    },
    dentist: {
        displayName: 'Dental Clinic',
        primaryNeeds: ['Appointment booking', 'Patient portal', 'Local SEO', 'Trust signals'],
        webDevValue: '$3,000 – $8,000',
        seoValue: '$600 – $2,000/mo',
        aiValue: '$4,000 – $12,000',
        specificActions: {
            [types_1.ServiceType.WEB_DEVELOPMENT]: ['Appointment booking system', 'Service pages per treatment', 'Before/after gallery', 'Patient testimonials'],
            [types_1.ServiceType.SEO]: ['Rank for "dentist in [city]"', 'Google Maps optimization', 'Health content marketing'],
            [types_1.ServiceType.AI_AUTOMATION]: ['Automated appointment reminders', 'AI follow-up for no-shows', 'Insurance form automation'],
        },
    },
    gym: {
        displayName: 'Gym / Fitness Centre',
        primaryNeeds: ['Membership portal', 'Class schedule', 'Lead capture', 'Social presence'],
        webDevValue: '$2,500 – $7,000',
        seoValue: '$500 – $1,500/mo',
        aiValue: '$3,500 – $9,000',
        specificActions: {
            [types_1.ServiceType.WEB_DEVELOPMENT]: ['Membership sign-up portal', 'Class timetable page', 'Trainer profiles', 'Lead capture forms'],
            [types_1.ServiceType.SEO]: ['Rank for "gym in [city]"', 'Fitness blog for organic traffic', 'Google Business optimization'],
            [types_1.ServiceType.AI_AUTOMATION]: ['AI fitness chatbot', 'Automated membership renewal', 'Churn prediction system'],
        },
    },
    hairdresser: {
        displayName: 'Hair Salon',
        primaryNeeds: ['Online booking', 'Portfolio gallery', 'Instagram integration', 'Loyalty system'],
        webDevValue: '$1,500 – $5,000',
        seoValue: '$300 – $1,000/mo',
        aiValue: '$2,000 – $6,000',
        specificActions: {
            [types_1.ServiceType.WEB_DEVELOPMENT]: ['Online appointment booking', 'Portfolio gallery', 'Service menu with pricing', 'Instagram feed integration'],
            [types_1.ServiceType.SEO]: ['Local beauty search ranking', 'Google Business photos', 'Review generation system'],
            [types_1.ServiceType.AI_AUTOMATION]: ['Automated booking confirmations', 'AI appointment reminders', 'Customer loyalty automation'],
        },
    },
    hotel: {
        displayName: 'Hotel',
        primaryNeeds: ['Booking engine', 'Room showcase', 'Review management', 'SEO'],
        webDevValue: '$5,000 – $15,000',
        seoValue: '$800 – $2,500/mo',
        aiValue: '$5,000 – $20,000',
        specificActions: {
            [types_1.ServiceType.WEB_DEVELOPMENT]: ['Direct booking engine', 'Room showcase pages', 'Virtual tour integration', 'Multi-language support'],
            [types_1.ServiceType.SEO]: ['Travel search ranking', 'TripAdvisor optimization', 'Local attraction content'],
            [types_1.ServiceType.AI_AUTOMATION]: ['AI concierge chatbot', 'Automated check-in emails', 'Dynamic pricing system'],
        },
    },
    cafe: {
        displayName: 'Café',
        primaryNeeds: ['Digital menu', 'Location visibility', 'Loyalty programme', 'Social media'],
        webDevValue: '$1,200 – $4,000',
        seoValue: '$300 – $800/mo',
        aiValue: '$2,000 – $5,000',
        specificActions: {
            [types_1.ServiceType.WEB_DEVELOPMENT]: ['Digital menu with QR code', 'Location landing page', 'Online pre-order system', 'Loyalty card portal'],
            [types_1.ServiceType.SEO]: ['Rank for "café near me"', 'Google Maps optimization', 'Coffee blog content'],
            [types_1.ServiceType.AI_AUTOMATION]: ['Automated loyalty rewards', 'AI order system', 'Customer preference tracking'],
        },
    },
    pharmacy: {
        displayName: 'Pharmacy',
        primaryNeeds: ['Product catalogue', 'Prescription portal', 'Local SEO', 'Trust signals'],
        webDevValue: '$2,500 – $7,000',
        seoValue: '$500 – $1,500/mo',
        aiValue: '$4,000 – $12,000',
        specificActions: {
            [types_1.ServiceType.WEB_DEVELOPMENT]: ['Product catalogue', 'Prescription refill form', 'Health services page', 'Store locator'],
            [types_1.ServiceType.SEO]: ['Local pharmacy search ranking', 'Health content hub', 'Google Business optimization'],
            [types_1.ServiceType.AI_AUTOMATION]: ['Prescription reminder automation', 'AI medication chatbot', 'Inventory alert system'],
        },
    },
    default: {
        displayName: 'Business',
        primaryNeeds: ['Professional website', 'Online presence', 'Lead generation', 'Local SEO'],
        webDevValue: '$1,500 – $8,000',
        seoValue: '$400 – $1,500/mo',
        aiValue: '$2,000 – $10,000',
        specificActions: {
            [types_1.ServiceType.WEB_DEVELOPMENT]: ['Professional website', 'Contact & lead capture', 'Service showcase', 'Mobile optimisation'],
            [types_1.ServiceType.SEO]: ['Local search ranking', 'Google Business Profile', 'Content strategy'],
            [types_1.ServiceType.AI_AUTOMATION]: ['Lead follow-up automation', 'AI customer support', 'Analytics dashboard'],
        },
    },
};
function getCategoryProfile(category) {
    const key = category.toLowerCase().replace(/\s+/g, '_');
    return (CATEGORY_PROFILES[key] ??
        CATEGORY_PROFILES[category.toLowerCase()] ??
        CATEGORY_PROFILES['default']);
}
exports.getCategoryProfile = getCategoryProfile;
//# sourceMappingURL=category.intel.js.map