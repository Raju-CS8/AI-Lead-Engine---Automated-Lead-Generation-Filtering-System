import axios from 'axios';
import { logger } from '../utils/logger';
import { NormalizedBusiness } from './normalizer.service';

export interface EnrichmentResult {
  website: string | null;
  websiteConfidence: 'confirmed' | 'found' | 'not_found';
  phone: string | null;
}

const BLOCKED_DOMAINS = [
  'facebook.com', 'instagram.com', 'twitter.com', 'x.com',
  'yelp.com', 'tripadvisor.com', 'zomato.com', 'swiggy.com',
  'wikipedia.org', 'linkedin.com', 'youtube.com',
  'justdial.com', 'indiamart.com', 'sulekha.com',
  'duckduckgo.com', 'google.com', 'bing.com', 'yahoo.com',
  'mapquest.com', 'foursquare.com', 'yellowpages.com',
  'openstreetmap.org', 'wikidata.org', 'trustpilot.com',
  'practo.com', 'lybrate.com', 'booking.com', 'airbnb.com',
  'quora.com', 'reddit.com', 'pinterest.com', 'magicbricks.com',
  '99acres.com', 'glassdoor.com', 'indeed.com', 'naukri.com',
];

// Major chains — instant result, no HTTP needed
const KNOWN_CHAINS: Record<string, string> = {
  'mcdonalds': 'https://www.mcdonalds.com',
  "mcdonald's": 'https://www.mcdonalds.com',
  'kfc': 'https://www.kfc.com',
  'pizza hut': 'https://www.pizzahut.com',
  'dominos': 'https://www.dominos.com',
  "domino's": 'https://www.dominos.com',
  'subway': 'https://www.subway.com',
  'burger king': 'https://www.burgerking.com',
  'starbucks': 'https://www.starbucks.com',
  'costa coffee': 'https://www.costacoffee.com',
  'cafe coffee day': 'https://www.cafecoffeeday.com',
  'barista': 'https://www.barista.co.in',
  'barbeque nation': 'https://www.barbequenation.com',
  'saravana bhavan': 'https://www.saravanabhavan.com',
  'hotel saravana bhavan': 'https://www.saravanabhavan.com',
  'anjappar': 'https://www.anjappar.com',
  'murugan idli shop': 'https://www.muruganidlishop.com',
  'sangeetha': 'https://www.sangeetharestaurants.com',
  'paradise biryani': 'https://www.paradisebiryani.com',
  'behrouz biryani': 'https://www.behrouzbiryani.com',
  'wow momo': 'https://www.wowmomo.com',
  'haldirams': 'https://www.haldirams.com',
  "haldiram's": 'https://www.haldirams.com',
  'marriott': 'https://www.marriott.com',
  'hilton': 'https://www.hilton.com',
  'taj hotel': 'https://www.tajhotels.com',
  'taj hotels': 'https://www.tajhotels.com',
  'oberoi': 'https://www.oberoihotels.com',
  'hyatt': 'https://www.hyatt.com',
  'radisson': 'https://www.radissonhotels.com',
  'holiday inn': 'https://www.ihg.com',
  'ibis': 'https://all.accor.com',
  'lemon tree': 'https://www.lemontreehotels.com',
  'apollo pharmacy': 'https://www.apollopharmacy.in',
  'medplus': 'https://www.medplusmart.com',
  "gold's gym": 'https://www.goldsgym.in',
  'anytime fitness': 'https://www.anytimefitness.com',
  'cult fit': 'https://www.cult.fit',
  'cult.fit': 'https://www.cult.fit',
  'reliance digital': 'https://www.reliancedigital.in',
  'reliance fresh': 'https://www.jiomart.com',
  'big bazaar': 'https://www.bigbazaar.com',
  'dmart': 'https://www.dmart.in',
  'shoppers stop': 'https://www.shoppersstop.com',
  'lifestyle': 'https://www.lifestylestores.com',
  'max fashion': 'https://www.maxfashion.in',
  'westside': 'https://www.westside.com',
  'tanishq': 'https://www.tanishq.co.in',
  'kalyan jewellers': 'https://www.kalyanjewellers.net',
  'malabar gold': 'https://www.malabargoldanddiamonds.com',
  'forest essentials': 'https://www.forestessentialsindia.com',
  'fabindia': 'https://www.fabindia.com',
  'jio mart': 'https://www.jiomart.com',
  'more supermarket': 'https://www.more.retail',
  'spencer': 'https://www.spencers.in',
  'wellness forever': 'https://www.wellnessforever.com',
  'netmeds': 'https://www.netmeds.com',
  'wellness': 'https://www.wellness.com',
};

function isValidBusinessUrl(url: string): boolean {
  if (!url || !url.startsWith('http')) return false;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return !BLOCKED_DOMAINS.some((d) => host.includes(d));
  } catch {
    return false;
  }
}

function checkKnownChain(name: string): string | null {
  const lower = name.toLowerCase().trim();
  for (const [chain, url] of Object.entries(KNOWN_CHAINS)) {
    if (lower === chain || lower.includes(chain) || chain.includes(lower)) {
      return url;
    }
  }
  return null;
}

async function isWebsiteAlive(url: string): Promise<boolean> {
  try {
    const res = await axios.head(url, {
      timeout: 3000,
      maxRedirects: 3,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      validateStatus: (s) => s < 500,
    });
    return res.status < 400;
  } catch {
    try {
      const res = await axios.get(url, {
        timeout: 3000,
        maxRedirects: 3,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        validateStatus: (s) => s < 500,
      });
      return res.status < 400;
    } catch {
      return false;
    }
  }
}

// Generate URL candidates from business name
function generateCandidates(name: string): string[] {
  const clean = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const noSpaces = clean.replace(/\s+/g, '');
  const dashed = clean.replace(/\s+/g, '-');

  // Remove common suffix words
  const stripped = clean
    .replace(/\b(hotel|restaurant|cafe|shop|store|centre|center|the|and|of|a|an)\b/g, '')
    .replace(/\s+/g, '')
    .trim();

  const firstWord = clean.split(/\s+/)[0] ?? '';
  const twoWords = clean.split(/\s+/).slice(0, 2).join('');

  const bases = [...new Set([noSpaces, dashed, stripped, twoWords, firstWord])]
    .filter(b => b.length >= 3);

  const tlds = ['.com', '.in', '.co.in', '.co', '.net', '.org', '.io'];
  const candidates: string[] = [];

  for (const base of bases.slice(0, 4)) {
    for (const tld of tlds) {
      candidates.push(`https://www.${base}${tld}`);
      candidates.push(`https://${base}${tld}`);
    }
  }

  return [...new Set(candidates)];
}

async function findByUrlPatterns(name: string): Promise<string | null> {
  const candidates = generateCandidates(name);

  // Check 3 at a time
  for (let i = 0; i < Math.min(candidates.length, 15); i += 3) {
    const batch = candidates.slice(i, i + 3);
    const results = await Promise.all(
      batch.map(async (url) => (await isWebsiteAlive(url) ? url : null))
    );
    const found = results.find(r => r !== null);
    if (found) return found;
  }

  return null;
}

// DuckDuckGo instant answer API
async function searchDDG(name: string, city: string): Promise<string | null> {
  try {
    const res = await axios.get('https://api.duckduckgo.com/', {
      params: {
        q: `${name} ${city}`,
        format: 'json',
        no_html: 1,
        skip_disambig: 1,
      },
      timeout: 5000,
      headers: { 'User-Agent': 'AILeadEngine/1.0' },
    });

    const url: string = res.data?.AbstractURL ?? '';
    if (url && isValidBusinessUrl(url)) {
      logger.debug('DDG found website', { name, url });
      return url;
    }

    // Check related topics
    const topics: Array<{ FirstURL?: string }> = res.data?.RelatedTopics ?? [];
    for (const t of topics.slice(0, 5)) {
      if (t.FirstURL && isValidBusinessUrl(t.FirstURL)) {
        return t.FirstURL;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function enrichBusiness(
  business: NormalizedBusiness
): Promise<EnrichmentResult> {

  // Step 1 — OSM has website → verify alive
  if (business.website) {
    const alive = await isWebsiteAlive(business.website);
    return {
      website: alive ? business.website : null,
      websiteConfidence: alive ? 'confirmed' : 'not_found',
      phone: business.phone,
    };
  }

  // Step 2 — Known chain check (instant)
  const chain = checkKnownChain(business.name);
  if (chain) {
    return { website: chain, websiteConfidence: 'confirmed', phone: business.phone };
  }

  // Step 3 — DuckDuckGo instant answer
  const ddg = await searchDDG(business.name, business.city);
  if (ddg) {
    return { website: ddg, websiteConfidence: 'found', phone: business.phone };
  }

  // Step 4 — URL pattern + HTTP ping
  const pattern = await findByUrlPatterns(business.name);
  if (pattern) {
    return { website: pattern, websiteConfidence: 'found', phone: business.phone };
  }

  // Step 5 — Confirmed no website
  return { website: null, websiteConfidence: 'not_found', phone: business.phone };
}