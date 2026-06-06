import { Router } from 'express';
import { generateLeads, getIndustries } from '../controllers/leads.controller';

export const apiRouter = Router();

apiRouter.post('/leads', generateLeads);
apiRouter.get('/industries', getIndustries);