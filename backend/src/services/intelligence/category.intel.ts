// ─────────────────────────────────────────────────────────────────
// Category Intelligence — Maps business type → specific opportunity
// 20+ categories with dedicated logic
// ─────────────────────────────────────────────────────────────────

import { ServiceType } from '../../types';

export interface CategoryProfile {
  displayName: string;
  primaryNeeds: string[];
  webDevValue: string;
  seoValue: string;
  aiValue: string;
  specificActions: Record<ServiceType, string[]>;
}

const CATEGORY_PROFILES: Record<string, CategoryProfile> = {
  restaurant: {
    displayName: 'Restaurant',
    primaryNeeds: ['Online menu', 'Table booking', 'Google Business', 'Delivery integration'],
    webDevValue: '$2,000 – $6,000',
    seoValue: '$400 – $1,200/mo',
    aiValue: '$3,000 – $10,000',
    specificActions: {
      [ServiceType.WEB_DEVELOPMENT]: ['Build menu website', 'Add online reservation', 'Integrate food delivery', 'Mobile-first design'],
      [ServiceType.SEO]: ['Local SEO for "restaurant near me"', 'Google Business Profile', 'Food blog content', 'Review management'],
      [ServiceType.AI_AUTOMATION]: ['AI chatbot for reservations', 'Automated order confirmations', 'Customer feedback analysis'],
    },
  },
  dentist: {
    displayName: 'Dental Clinic',
    primaryNeeds: ['Appointment booking', 'Patient portal', 'Local SEO', 'Trust signals'],
    webDevValue: '$3,000 – $8,000',
    seoValue: '$600 – $2,000/mo',
    aiValue: '$4,000 – $12,000',
    specificActions: {
      [ServiceType.WEB_DEVELOPMENT]: ['Appointment booking system', 'Service pages per treatment', 'Before/after gallery', 'Patient testimonials'],
      [ServiceType.SEO]: ['Rank for "dentist in [city]"', 'Google Maps optimization', 'Health content marketing'],
      [ServiceType.AI_AUTOMATION]: ['Automated appointment reminders', 'AI follow-up for no-shows', 'Insurance form automation'],
    },
  },
  gym: {
    displayName: 'Gym / Fitness Centre',
    primaryNeeds: ['Membership portal', 'Class schedule', 'Lead capture', 'Social presence'],
    webDevValue: '$2,500 – $7,000',
    seoValue: '$500 – $1,500/mo',
    aiValue: '$3,500 – $9,000',
    specificActions: {
      [ServiceType.WEB_DEVELOPMENT]: ['Membership sign-up portal', 'Class timetable page', 'Trainer profiles', 'Lead capture forms'],
      [ServiceType.SEO]: ['Rank for "gym in [city]"', 'Fitness blog for organic traffic', 'Google Business optimization'],
      [ServiceType.AI_AUTOMATION]: ['AI fitness chatbot', 'Automated membership renewal', 'Churn prediction system'],
    },
  },
  hairdresser: {
    displayName: 'Hair Salon',
    primaryNeeds: ['Online booking', 'Portfolio gallery', 'Instagram integration', 'Loyalty system'],
    webDevValue: '$1,500 – $5,000',
    seoValue: '$300 – $1,000/mo',
    aiValue: '$2,000 – $6,000',
    specificActions: {
      [ServiceType.WEB_DEVELOPMENT]: ['Online appointment booking', 'Portfolio gallery', 'Service menu with pricing', 'Instagram feed integration'],
      [ServiceType.SEO]: ['Local beauty search ranking', 'Google Business photos', 'Review generation system'],
      [ServiceType.AI_AUTOMATION]: ['Automated booking confirmations', 'AI appointment reminders', 'Customer loyalty automation'],
    },
  },
  hotel: {
    displayName: 'Hotel',
    primaryNeeds: ['Booking engine', 'Room showcase', 'Review management', 'SEO'],
    webDevValue: '$5,000 – $15,000',
    seoValue: '$800 – $2,500/mo',
    aiValue: '$5,000 – $20,000',
    specificActions: {
      [ServiceType.WEB_DEVELOPMENT]: ['Direct booking engine', 'Room showcase pages', 'Virtual tour integration', 'Multi-language support'],
      [ServiceType.SEO]: ['Travel search ranking', 'TripAdvisor optimization', 'Local attraction content'],
      [ServiceType.AI_AUTOMATION]: ['AI concierge chatbot', 'Automated check-in emails', 'Dynamic pricing system'],
    },
  },
  cafe: {
    displayName: 'Café',
    primaryNeeds: ['Digital menu', 'Location visibility', 'Loyalty programme', 'Social media'],
    webDevValue: '$1,200 – $4,000',
    seoValue: '$300 – $800/mo',
    aiValue: '$2,000 – $5,000',
    specificActions: {
      [ServiceType.WEB_DEVELOPMENT]: ['Digital menu with QR code', 'Location landing page', 'Online pre-order system', 'Loyalty card portal'],
      [ServiceType.SEO]: ['Rank for "café near me"', 'Google Maps optimization', 'Coffee blog content'],
      [ServiceType.AI_AUTOMATION]: ['Automated loyalty rewards', 'AI order system', 'Customer preference tracking'],
    },
  },
  pharmacy: {
    displayName: 'Pharmacy',
    primaryNeeds: ['Product catalogue', 'Prescription portal', 'Local SEO', 'Trust signals'],
    webDevValue: '$2,500 – $7,000',
    seoValue: '$500 – $1,500/mo',
    aiValue: '$4,000 – $12,000',
    specificActions: {
      [ServiceType.WEB_DEVELOPMENT]: ['Product catalogue', 'Prescription refill form', 'Health services page', 'Store locator'],
      [ServiceType.SEO]: ['Local pharmacy search ranking', 'Health content hub', 'Google Business optimization'],
      [ServiceType.AI_AUTOMATION]: ['Prescription reminder automation', 'AI medication chatbot', 'Inventory alert system'],
    },
  },
  default: {
    displayName: 'Business',
    primaryNeeds: ['Professional website', 'Online presence', 'Lead generation', 'Local SEO'],
    webDevValue: '$1,500 – $8,000',
    seoValue: '$400 – $1,500/mo',
    aiValue: '$2,000 – $10,000',
    specificActions: {
      [ServiceType.WEB_DEVELOPMENT]: ['Professional website', 'Contact & lead capture', 'Service showcase', 'Mobile optimisation'],
      [ServiceType.SEO]: ['Local search ranking', 'Google Business Profile', 'Content strategy'],
      [ServiceType.AI_AUTOMATION]: ['Lead follow-up automation', 'AI customer support', 'Analytics dashboard'],
    },
  },
};

export function getCategoryProfile(category: string): CategoryProfile {
  const key = category.toLowerCase().replace(/\s+/g, '_');
  return (
    CATEGORY_PROFILES[key] ??
    CATEGORY_PROFILES[category.toLowerCase()] ??
    CATEGORY_PROFILES['default']!
  );
}