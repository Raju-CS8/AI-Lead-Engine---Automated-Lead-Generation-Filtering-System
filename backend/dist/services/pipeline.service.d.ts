import { Lead, LeadSearchParams, ApiResponse } from '../types';
export declare function runLeadPipeline(params: LeadSearchParams): Promise<ApiResponse<Lead[]>>;
