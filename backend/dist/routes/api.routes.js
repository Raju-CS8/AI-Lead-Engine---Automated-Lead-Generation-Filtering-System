"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const leads_controller_1 = require("../controllers/leads.controller");
exports.apiRouter = (0, express_1.Router)();
exports.apiRouter.post('/leads', leads_controller_1.generateLeads);
exports.apiRouter.get('/industries', leads_controller_1.getIndustries);
//# sourceMappingURL=api.routes.js.map