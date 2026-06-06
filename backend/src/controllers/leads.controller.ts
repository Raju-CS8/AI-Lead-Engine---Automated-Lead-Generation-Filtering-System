import { Request, Response, NextFunction } from 'express';
import { LeadSearchParams, ServiceType } from '../types';
import { runLeadPipeline } from '../services/pipeline.service';
import { createError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

// ✅ Keep constants scoped locally (no export → avoids cross-file conflicts)
const VALID_SERVICES: ServiceType[] = Object.values(ServiceType);

const VALID_INDUSTRIES: string[] = [
  'restaurant', 'dental', 'gym', 'salon', 'clinic', 'hotel', 'cafe',
  'pharmacy', 'school', 'real estate', 'lawyer', 'accountant', 'plumber',
  'electrician', 'mechanic', 'bakery', 'spa', 'yoga', 'photography', 'hospital',
];

// ✅ Controller: Generate Leads
export const generateLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { industry, location, service, limit } = req.body as Partial<{
      industry: string;
      location: string;
      service: ServiceType;
      limit: number;
    }>;

    // 🔹 Validation
    if (!industry?.trim()) {
      return next(createError('industry is required', 400));
    }

    if (!location?.trim()) {
      return next(createError('location is required', 400));
    }

    if (!service || !VALID_SERVICES.includes(service)) {
      return next(
        createError(`service must be one of: ${VALID_SERVICES.join(', ')}`, 400)
      );
    }

    const parsedLimit = Number(limit ?? 10);

    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
      return next(createError('limit must be between 1 and 50', 400));
    }

    // 🔹 Params
    const params: LeadSearchParams = {
      industry: industry.trim().toLowerCase(),
      location: location.trim(),
      service,
      limit: parsedLimit,
    };

    logger.info('Lead request received', params);

    // 🔹 Pipeline call
    const result = await runLeadPipeline(params);

    res.status(200).json({
  success: true,
  data: result,
});
return;

  } catch (error) {
    logger.error('Error in generateLeads', error);
    return next(error);
  }
};

// ✅ Controller: Get Industries
export const getIndustries = (
  _req: Request,
  res: Response
): void => {
  res.status(200).json({
    success: true,
    data: VALID_INDUSTRIES,
  });
};