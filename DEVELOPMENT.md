# EMS frontend development

Copy `.env.example` to `.env`. `VITE_BACKEND_URL=http://127.0.0.1:8000` configures the Vite development proxy; `VITE_API_BASE_URL=/api/v1` keeps browser requests on the frontend origin. Restart `npm run dev` after changing the backend URL. For a LAN server change VITE_BACKEND_URL to its reachable address. This resolves the 5173/3000 CORS mismatch without widening backend grants or origins.

Production hosting must proxy /api/v1 and route browser deep links to index.html, or set an explicit VITE_API_BASE_URL and authorize that exact frontend origin on the backend. Vite variables are public build-time configuration: never include secrets. `.env` is ignored. Tauri packaging, production origins and CSP validation remain phase 11 work; no desktop release is claimed.

Access/refresh tokens stay in memory for both browser and Tauri. Reloading requires authentication again. The session provider fetches /auth/context after token issuance, clears stale context on token changes, and aborts obsolete bootstrap calls. Login and account screens belong to phase 2. No challenge token enters this transport. Backend permissions remain authoritative.

Transport uses a 30-second timeout, one coordinated refresh and at most one replay after 401. No background money queue or network write retries exist. Retain the financialIntent object after uncertain responses: it freezes the exact serialized payload and key, deduplicates concurrent submission, retains successful receipts, and rejects reuse after session changes. Do not reconstruct it on every render. Changed form values require a new reviewed intent. Tenant/shop switching must invalidate intents through the session lifecycle in phase 3.

Schema types in src/api/generated.ts come from the sibling backend application's OpenAPI schema, without opening a database or running lifespan jobs. The snapshot is src/api/openapi.json; regenerate with `python scripts/generate-contracts.py /path/to/openapi.json`. UUID formats are strings; integer references remain numbers. Backend Decimal schemas permit numeric inputs too: financial forms must use the shared string inputs and Decimal alias, preserving decimal strings without Number conversion. The untyped /auth/context response is reviewed directly against its router.

Run npm run build, npm run lint and npm test. Runtime fonts are bundled locally. Language changes in Configurator update translations, document direction, MUI theme and Emotion RTL cache without reload. Accounting and later feature acceptance remain open.
