import { Lead, LeadSearchParams, ApiMeta, ApiResponse, Priority } from '../types';
import { fetchBusinesses } from './overpass.service';
import { normalizeAll } from './normalizer.service';
import { enrichBusiness } from './webEnrichment.service';
import { runIntelligence } from './intelligence';
import { buildCacheKey, setInCache } from '../utils/cache';
import { logger } from '../utils/logger';

export async function runLeadPipeline(
  params: LeadSearchParams
): Promise<ApiResponse<Lead[]>> {
  const { industry, location, service, limit } = params;
  const cacheKey = buildCacheKey(industry, location, service);
  const start = Date.now();

  logger.info('Pipeline starting', params);

  const elements = await fetchBusinesses(industry, location, limit);
  if (!elements.length) return buildEmptyResponse(params);

  const businesses = normalizeAll(elements, location);
  if (!businesses.length) return buildEmptyResponse(params);

  const leads: Lead[] = [];

  for (const business of businesses) {
    try {
      const enrichmentPromise = enrichBusiness(business);
      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 5000)
      );

      const enrichment = await Promise.race([enrichmentPromise, timeoutPromise]);

      const enrichedBusiness = enrichment
        ? {
            ...business,
            website: enrichment.website,
            phone: enrichment.phone ?? business.phone,
          }
        : business;

      const lead = runIntelligence(enrichedBusiness, service);
      leads.push(lead);
    } catch (err) {
      logger.warn('Failed to process business', {
        name: business.name,
        error: err instanceof Error ? err.message : String(err),
      });
      try {
        const lead = runIntelligence(business, service);
        leads.push(lead);
      } catch { /* skip */ }
    }
  }

  leads.sort((a, b) => b.score.value - a.score.value);

  const meta = buildMeta(params, leads, false);
  const response: ApiResponse<Lead[]> = { success: true, meta, data: leads };

  setInCache(cacheKey, response);

  logger.info('Pipeline complete', {
    total: leads.length,
    highPriority: meta.highPriority,
    durationMs: Date.now() - start,
  });

  return response;
}

function buildMeta(
  params: LeadSearchParams,
  leads: Lead[],
  cached: boolean
): ApiMeta {
  const high = leads.filter((l) => l.score.priority === Priority.HIGH).length;
  const med = leads.filter((l) => l.score.priority === Priority.MEDIUM).length;
  const low = leads.filter((l) => l.score.priority === Priority.LOW).length;
  const avg = leads.length
    ? Math.round(leads.reduce((s, l) => s + l.score.value, 0) / leads.length)
    : 0;

  return {
    total: leads.length,
    highPriority: high,
    mediumPriority: med,
    lowPriority: low,
    gapsDetected: leads.reduce((s, l) => s + l.gaps.length, 0),
    averageScore: avg,
    location: params.location,
    industry: params.industry,
    service: params.service,
    generatedAt: new Date().toISOString(),
    cached,
    source: 'overpass',
  };
}

function buildEmptyResponse(params: LeadSearchParams): ApiResponse<Lead[]> {
  return {
    success: true,
    meta: {
      total: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
      gapsDetected: 0,
      averageScore: 0,
      location: params.location,
      industry: params.industry,
      service: params.service,
      generatedAt: new Date().toISOString(),
      cached: false,
      source: 'overpass',
    },
    data: [],
  };
}