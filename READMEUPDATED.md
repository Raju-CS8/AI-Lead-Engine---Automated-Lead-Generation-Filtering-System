# AI Lead Engine — Updated Project Documentation

## Project Overview

`AI Lead Engine` is a full-stack web application designed to find, enrich, score, and recommend small business leads based on industry, location, and service interest. The system combines a TypeScript-based backend API with a React + Vite frontend dashboard.

The project is built to help users discover businesses with lead potential and assess them using automated intelligence signals such as website presence, contact details, location tier, maturity, and gap analysis.

---

## Project Goal

The goal of this project is to create a lead generation and intelligence engine that:

- fetches local business data from OpenStreetMap / Overpass API,
- normalizes and enriches businesses with website and contact details,
- ranks leads using a custom scoring engine,
- detects marketing and digital presence gaps,
- generates recommendations and outreach messages,
- displays results in an interactive frontend dashboard.

This is a project to build a practical sales intelligence tool rather than a chat application.

---

## Is this a full-stack web project?

Yes — this repository has a full-stack structure:

- `backend/` contains the server-side API logic with Express and TypeScript.
- `frontend/` contains the client-side dashboard built with React, TypeScript, and Vite.

The two sides are intended to work together, so this is a full-stack web app.

---

## Current Status

### What is completed so far

- Backend API built with Express and TypeScript.
- API routes defined for:
  - `POST /api/leads` — generate enriched leads from search parameters.
  - `GET /api/industries` — return supported industries list.
- Backend pipeline includes:
  - business fetch from Overpass API,
  - normalization,
  - website enrichment using DuckDuckGo / URL heuristics,
  - lead scoring,
  - gap detection,
  - recommendations,
  - outreach message generation.
- Frontend dashboard implemented with:
  - protected routes,
  - lead search input panel,
  - insights summary,
  - lead grid display,
  - save/remove leads,
  - export to CSV/JSON,
  - local-storage-based session auth and saved leads.

### What is still unfinished / needs work

- Authentication is currently client-only using localStorage. There is no real backend login/signup user system.
- There is no chat or simultaneous chat feature implemented.
- Real deployment settings are missing.
- API base URL and environment variables need to be configured for local or production use.
- Error handling and validation could be strengthened further across frontend/backend.
- Tests are not included and should be added.
- Backend caching, rate limiting, and security are basic but may require improvement before production.
- Documentation, README, and developer onboarding still need polishing.

In short: the project is working as a prototype and can run locally, but it is not yet a finished production-ready system.

---

## Project Architecture

### Backend (`backend/`)

- `backend/src/server.ts` — Express server setup, middleware, CORS, helmet, error handling.
- `backend/src/routes/api.routes.ts` — API routes for lead generation and industries.
- `backend/src/controllers/leads.controller.ts` — request validation and pipeline invocation.
- `backend/src/services/pipeline.service.ts` — orchestrates business fetch, enrichment, scoring, caching.
- `backend/src/services/overpass.service.ts` — queries the Overpass API / OpenStreetMap.
- `backend/src/services/normalizer.service.ts` — normalizes raw OSM business data.
- `backend/src/services/webEnrichment.service.ts` — enriches businesses with website and phone data.
- `backend/src/services/intelligence/` — intelligence modules for scoring, gaps, recommendations, outreach, location, maturity, category analysis.
- `backend/src/utils/cache.ts` — simple in-memory caching helper.
- `backend/src/utils/logger.ts` — structured logging utility.
- `backend/src/middleware/` — rate limiter and error middleware.

### Frontend (`frontend/`)

- `frontend/src/App.tsx` — routing and protected pages.
- `frontend/src/hooks/useLeads.ts` — lead fetching, filtering, saved leads, and local storage.
- `frontend/src/services/api.service.ts` — REST client for `/api/leads` and `/api/industries`.
- `frontend/src/pages/` — dashboard, analytics, saved leads, login, signup, settings.
- `frontend/src/components/` — UI components for input panel, lead cards, sidebar, summary, etc.
- `frontend/src/store/AuthContext.tsx` — local auth state provider.
- `frontend/src/types/index.ts` — shared frontend data types.

---

## Technology Stack

### Backend stack

- Node.js `>=18`
- TypeScript
- Express
- Axios
- Helmet
- CORS
- express-rate-limit
- dotenv
- node-cache
- winston
- uuid

### Frontend stack

- React 19
- TypeScript
- Vite
- Material UI (MUI)
- React Router DOM
- Axios
- Recharts
- ESLint

### Data / intelligence stack

- Overpass API / OpenStreetMap for business discovery
- DuckDuckGo instant answer API for website enrichment
- Heuristic URL generation and website availability checks
- Custom lead scoring and gap detection logic

---

## How to Run Locally

### Backend

1. Open terminal in `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

The backend starts on the port defined by `env.PORT` in `backend/src/config/env.ts`.

### Frontend

1. Open terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend app:
   ```bash
   npm run dev
   ```

### Environment

- The frontend depends on `VITE_API_BASE_URL` to point to the backend API.
- Backend uses `.env` via `dotenv` to load ports and allowed origins.

---

## API Endpoints

### `POST /api/leads`

Body example:
```json
{
  "industry": "restaurant",
  "location": "Bengaluru, India",
  "service": "Web Development",
  "limit": 15
}
```

Returns a lead intelligence payload with:
- lead score
- gap list
- recommendations
- outreach message
- website and contact details

### `GET /api/industries`

Returns a list of supported industry strings such as `restaurant`, `hotel`, `gym`, `clinic`, and more.

---

## What to Work on Next

If you want to move this from prototype to a more complete product, here are the top next steps:

1. **Real authentication**
   - Implement backend user login/signup
   - Replace client-only auth with secure token-based auth
2. **Deploy the backend and frontend**
   - Add deployment scripts, Docker support, or cloud hosting config
3. **Stabilize backend error handling**
   - improve validation, retry logic, and API error responses
4. **Add tests**
   - unit tests for backend services and frontend hooks/pages
   - integration tests for API and UI flow
5. **Fix any UI/backend disconnects**
   - confirm `VITE_API_BASE_URL` is set correctly
   - check that the frontend and API responses match expected shapes
6. **Add real chat or collaboration features only if needed**
   - this project currently has no chat engine or simultaneous chat support
7. **Document environment variables and setup clearly**
   - add `.env.example`
   - add developer setup steps in the root README

---

## Important Notes

- The project is not a chat application. There is no chat service in the current codebase.
- The backend is currently a working prototype and can be started locally, but it is not production-ready.
- The frontend has many UI pages and lead workflow components, but the app still needs stronger auth, error handling, and testing.
- The root `package.json` exists, but the actual runnable apps are in `backend/` and `frontend/`.

---

## Summary

`AI Lead Engine` is a promising full-stack lead intelligence project. It is functional enough to generate and display enriched leads, but it is still in a development stage and needs more work for production deployment, authentication, and quality assurance.

If you want, I can also add a cleaned root `README.md`, `.env.example`, and a developer quickstart section next.
