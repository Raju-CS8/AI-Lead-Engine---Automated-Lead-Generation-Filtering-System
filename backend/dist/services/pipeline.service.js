"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runLeadPipeline = void 0;
const types_1 = require("../types");
const overpass_service_1 = require("./overpass.service");
const normalizer_service_1 = require("./normalizer.service");
const webEnrichment_service_1 = require("./webEnrichment.service");
const intelligence_1 = require("./intelligence");
const cache_1 = require("../utils/cache");
const logger_1 = require("../utils/logger");
async function runLeadPipeline(params) {
    const { industry, location, service, limit } = params;
    const cacheKey = (0, cache_1.buildCacheKey)(industry, location, service);
    const cachedResponse = (0, cache_1.getFromCache)(cacheKey);
    if (cachedResponse) {
        cachedResponse.meta.cached = true;
        return cachedResponse;
    }
    const start = Date.now();
    logger_1.logger.info('Pipeline starting', params);
    const elements = await (0, overpass_service_1.fetchBusinesses)(industry, location, limit);
    if (!elements.length)
        return buildEmptyResponse(params);
    const businesses = (0, normalizer_service_1.normalizeAll)(elements, location);
    if (!businesses.length)
        return buildEmptyResponse(params);
    const leads = [];
    const batchSize = 10;
    for (let i = 0; i < businesses.length; i += batchSize) {
        const batch = businesses.slice(i, i + batchSize);
        await Promise.all(batch.map(async (business) => {
            try {
                const enrichmentPromise = (0, webEnrichment_service_1.enrichBusiness)(business);
                const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 5000));
                const enrichment = await Promise.race([enrichmentPromise, timeoutPromise]);
                const enrichedBusiness = enrichment
                    ? {
                        ...business,
                        website: enrichment.website,
                        phone: enrichment.phone ?? business.phone,
                    }
                    : business;
                const lead = (0, intelligence_1.runIntelligence)(enrichedBusiness, service);
                leads.push(lead);
            }
            catch (err) {
                logger_1.logger.warn('Failed to process business', {
                    name: business.name,
                    error: err instanceof Error ? err.message : String(err),
                });
                try {
                    const lead = (0, intelligence_1.runIntelligence)(business, service);
                    leads.push(lead);
                }
                catch { }
            }
        }));
    }
    leads.sort((a, b) => b.score.value - a.score.value);
    const meta = buildMeta(params, leads, false);
    const response = { success: true, meta, data: leads };
    (0, cache_1.setInCache)(cacheKey, response);
    logger_1.logger.info('Pipeline complete', {
        total: leads.length,
        highPriority: meta.highPriority,
        durationMs: Date.now() - start,
    });
    return response;
}
exports.runLeadPipeline = runLeadPipeline;
function buildMeta(params, leads, cached) {
    const high = leads.filter((l) => l.score.priority === types_1.Priority.HIGH).length;
    const med = leads.filter((l) => l.score.priority === types_1.Priority.MEDIUM).length;
    const low = leads.filter((l) => l.score.priority === types_1.Priority.LOW).length;
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
function buildEmptyResponse(params) {
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
//# sourceMappingURL=pipeline.service.js.map