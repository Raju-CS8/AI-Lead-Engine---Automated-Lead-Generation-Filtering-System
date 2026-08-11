"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndustries = exports.generateLeads = void 0;
const types_1 = require("../types");
const pipeline_service_1 = require("../services/pipeline.service");
const error_middleware_1 = require("../middleware/error.middleware");
const logger_1 = require("../utils/logger");
const VALID_SERVICES = Object.values(types_1.ServiceType);
const VALID_INDUSTRIES = [
    'restaurant', 'dental', 'gym', 'salon', 'clinic', 'hotel', 'cafe',
    'pharmacy', 'school', 'real estate', 'lawyer', 'accountant', 'plumber',
    'electrician', 'mechanic', 'bakery', 'spa', 'yoga', 'photography', 'hospital',
];
const generateLeads = async (req, res, next) => {
    try {
        const { industry, location, service, limit } = req.body;
        if (!industry?.trim()) {
            return next((0, error_middleware_1.createError)('industry is required', 400));
        }
        if (!location?.trim()) {
            return next((0, error_middleware_1.createError)('location is required', 400));
        }
        if (!service || !VALID_SERVICES.includes(service)) {
            return next((0, error_middleware_1.createError)(`service must be one of: ${VALID_SERVICES.join(', ')}`, 400));
        }
        const parsedLimit = Number(limit ?? 10);
        if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
            return next((0, error_middleware_1.createError)('limit must be between 1 and 50', 400));
        }
        const params = {
            industry: industry.trim().toLowerCase(),
            location: location.trim(),
            service,
            limit: parsedLimit,
        };
        logger_1.logger.info('Lead request received', params);
        const result = await (0, pipeline_service_1.runLeadPipeline)(params);
        res.status(200).json({
            success: true,
            data: result,
        });
        return;
    }
    catch (error) {
        logger_1.logger.error('Error in generateLeads', error);
        return next(error);
    }
};
exports.generateLeads = generateLeads;
const getIndustries = (_req, res) => {
    res.status(200).json({
        success: true,
        data: VALID_INDUSTRIES,
    });
};
exports.getIndustries = getIndustries;
//# sourceMappingURL=leads.controller.js.map