# EMS frontend project context

Reviewed: 2026-11-15. This file describes the cloned starting point and the sibling backend contracts. It is not a claim that planned screens exist.

## Product and users

EMS manages an Afghan sarafi shop's currency exchanges, customer debts, hawala, agent settlements, cashboxes, expenses, daily closing and reports. Users can belong to multiple isolated organizations; each selected organization has authorized shops. The owner controls setup, staff and sensitive corrections; cashiers perform permitted daily work; accountants review balances and reports.

The normal flow is: select organization/shop → open day → record transactions → issue receipts → settle obligations → count cash → owner-confirm closing. Core operation uses a shared local backend/database over the shop LAN. An internet outage does not imply the local API is unavailable; a local API outage prevents financial posting.

## Repository baseline

Source clone: `git@github.com:aliabdullahnasiri/dawamis-frontend.git`. Its Git origin and history remain intact; no EMS remote has been configured or pushed. Backend: `../ems-backend`.

| Area | Existing implementation |
| --- | --- |
| UI | React 19, TypeScript 6, MUI 9, Emotion |
| Tooling | Vite 8, ESLint 10, npm lockfile |
| Routing | BrowserRouter; both react-router and react-router-dom are declared with different majors; review before integration |
| Desktop | Tauri 2 source/configuration; platform packaging not verified |
| Dates | dayjs and MUI date pickers |
| State | React contexts/reducers for layout and themes |
| Tests/API client | No test script, API client or working auth integration found in the inspected starter |

Versions above describe package.json declarations at clone time, not a dependency-installation validation. Use package-lock.json for resolved versions. No dependencies were installed during document preparation.

Current files:

- `src/main.tsx`: BrowserRouter and theme/layout providers.
- `src/App.tsx`: placeholder bootstrap, fixed loading delay, global context-menu suppression and route shell.
- `src/constants/routes.tsx`: placeholder pharmacy routes and dotted permission strings; these do not match EMS grants.
- `src/layouts/Dashboard.tsx`, `src/widgets/layout/`: reusable dashboard/navbar/sidebar/configurator.
- `src/theme/`, `src/context/`: MUI appearance preferences and context providers.
- `src/utils/storage.ts`: localStorage helpers for preferences, not a reviewed credential store.
- `src-tauri/tauri.conf.json`: pharmacy branding, desktop window settings and null CSP; requires EMS review.

Commands: `npm ci`, `npm run dev`, `npm run build`, `npm run lint`, `npm run preview`, `npm run tauri -- dev`. Tauri also requires the Rust/platform prerequisites for the target system. Current Vite/Tauri dev URL uses port 5173; the backend currently permits browser CORS origin `http://localhost:3000` only. Resolve this with a deliberate proxy/origin configuration. Do not assume FRONTEND_URL changes CORS automatically.

## Source of truth

Read backend routers, request/response schemas and tests when implementing a screen. The running `/openapi.json` gives machine-readable contracts; `/docs` provides interactive reference. Existing backend docs:

- `../ems-backend/docs/organization-context.md`: selected tenant, ownership, grants, retries and private files.
- `../ems-backend/docs/financial-foundation.md`: exact money, currencies, ledger, cost and openings.
- `../ems-backend/docs/contacts.md`: customers/agents, identity and statements.
- `../ems-backend/docs/exchanges.md`, `payments.md`: rates, trades, credit and allocations.
- `../ems-backend/docs/hawalas.md`: lifecycle, fees, payout/refund and agent settlement.
- `../ems-backend/docs/daily-operations.md`: expenses, transfer and business-day closing.
- `../ems-backend/docs/reports.md`: dashboard, filters, exports, valuation and pending acceptance.
- `../ems-backend/docs/errors.md`: sanitized application error envelopes.

Some backend prose retains historical phase wording. Mounted routes and current schemas/tests prevail. The backend has financial modules through reports; there are no medicine, inventory, supplier, purchase or pharmacy sales modules to integrate.

## Transport and authentication

API prefix: `/api/v1`. Most typed successful responses contain `success`, optional `message`, and `data`; null fields may be omitted. Some resource routes have their own explicit payloads; inspect schemas rather than assuming every response is identical. Downloads are binary/CSV, not JSON envelopes.

Use bearer access tokens. Login can return either access/refresh tokens or `requires_2fa`, `challenge_token`, and expiry. Complete the documented challenge flow before using ordinary authenticated endpoints. Refresh/session/logout requirements must follow their actual schemas and headers; do not invent cookie-based auth.

Use one shared refresh operation for simultaneous expired requests. Never refresh indefinitely or replay non-idempotent writes with a new operation key. Clear credentials, selected context and cached business data on logout or unrecoverable refresh failure. Handle revoked sessions, inactive users, missing organization and lost membership explicitly. Token persistence is a design decision to resolve before implementation; do not put passwords, OTPs or recovery codes into localStorage.

Errors use `type` and translated `message`. Validation errors may include `errors` with `loc`, `type`, `msg`; do not rely on raw Pydantic `detail` or echo input values. Handle 401/403/404/409/422/429 and connectivity failures distinctly. A 404 may intentionally hide another tenant's resource.

## Organization, shops and authorization

Select organization with `POST /auth/organizations/{organization_uuid}/select`. `GET /auth/context` returns verified identity/membership/context and effective grants. A supplied query/header organization ID cannot override the server-selected organization. Organization-management routes under `/organizations/{uuid}` have explicit URL scope.

Financial routes commonly require integer `shop_id`; public resource paths generally use UUIDs while payload references use integer IDs. Contacts may select shops through their specific request schemas. Do not interchange ID kinds or assume every route takes identical parameters.

Cache keys must include user identity, selected organization and shop. Switching context must cancel/ignore old requests, clear old business data, reset forms and retry state, and refetch grants. UI permission gates improve usability; the backend remains authoritative. Use colon-delimited grants such as `exchange:create`, `payment:read`, `report:read`, `audit:read`. Owner-only checks can apply in addition to permissions and explicit approval fields.

Default cashier grants exclude financial reports, rate/settings management, refunds, sensitive reversals and closing approval. Accountant grants include report/audit access but not all owner operations. Read effective grants rather than assuming a role name implies access. Some cashier write permissions lack corresponding list/current-day report access; coordinate a backend change if needed instead of assuming those screens are authorized.

## Financial invariants

- Money and rates are exact decimal strings, not JavaScript Number values. Avoid parseFloat, exponent serialization and float totals. Use string inputs and a reviewed decimal library if client arithmetic is needed.
- Every amount carries an explicit currency. Never add AFN/USD/PKR into one monetary total. IRR is rial; IRT is an explicit internal toman unit of ten rial.
- Currency precision is configured. Persian/Arabic numerals are supported by backend financial parsing; preserve unambiguous formatting and never silently round input.
- Exchange rate means quote units per base unit. Buy means the shop receives base and pays quote; sell means it pays base and receives quote. Display both legs before submission.
- Quotes reserve no cash. Posting can reject a previously valid quote after another cashier changes available funds.
- Generate one `Idempotency-Key` per intended financial operation. Keep the exact key/payload on timeout retry. A modified payload is a new intent; changed payload with reused key returns conflict. Do not retry a timed-out write with a fresh key blindly.
- Posted entries/receipts are immutable. Corrections use linked reversals with required reasons/approval and can be blocked by dependent payments, settlements, cash already spent or closed periods.
- Use returned receipt snapshots, not current contact/rate/settings values, for reprints. Refresh current outstanding balances separately from original retry receipts.
- Customer receivable means the customer owes the shop; payable means the shop owes the customer. Keep agent and customer roles/directions separate.
- Credit trades recognize backend accrual profit on the full agreed exchange, including unpaid portions. Do not relabel that as cash collected. Outstanding principal is not revenue.
- Cash cost uses stored weighted-average AFN carrying values per cashbox/currency; reviewed openings supply acquisition cost. Fees follow their recognition policy. Principal, equity and internal transfers are excluded from profit; reports do not mark holdings to current market rates.

## Feature/API map

| Screen area | Backend routes under /api/v1 |
| --- | --- |
| Account/security | `/auth/*`, `/users/*` as mounted; inspect OpenAPI for exact operations |
| Organizations/staff/RBAC | `/organizations`, organization-specific membership/roles/permissions routes; `/auth/context` and organization selection |
| Shop/setup | `/shops`, `/settings`, `/currencies`, `/cashboxes`, `/opening-balances` |
| Ledger/cash | `/ledger/entries`, `/cashboxes/{uuid}/movements`, supported opening reversal |
| Contacts | `/contacts`, contact detail/balances/statements/openings and private evidence routes |
| Exchange | `/rates`, `/exchanges/quote`, `/exchanges`, detail/receipt/reverse |
| Customer settlement | `/contacts/{uuid}/outstanding`, `/payments`, detail/receipt/reverse |
| Hawala | `/hawalas`, draft update/detail/receipt, confirm/pay/cancel/refund/reviews |
| Agent settlement | `/agent-settlements`, statement/reverse and contact agent-outstanding |
| Daily work | `/expense-categories`, `/expenses`, `/cash-transfers`, `/business-days/open`, `/business-days/current`, `/day-closings` and confirmation/export |
| Reporting | `/dashboard`, `/reports/daily`, `/reports/cash`, `/reports/outstanding`, `/reports/profit`, `/reports/hawala`, `/reports/audit` |
| Audit/files | `/audit-logs`, `/files` upload and `/files/{uuid}` private download |

List routes usually use offset/limit capped at 100; use each route's actual supported filters. Transaction lists commonly use inclusive Kabul date_from/date_to, while reports use timezone-aware start/cutoff, optional Kabul day and retained closing_id. Reports have original-currency detail, historical book values, implied conversion rate and valuation basis. Dashboard balances are cumulative; profit/volume honor start. Cash with start is movement rather than closing balance. Report data can be large; do not assume server pagination exists there.

Hawala draft creation/editing is not posting. Confirmation freezes terms; transfer APIs expose pending/paid/cancelled, while report event-derived status may say confirmed. Payout status and agent settlement status are independent. Cancellation can create a refund due without paying it. These are manual recorded workflows, not automatic agent messages, bank transfers or external identity verification.

Daily closing uses Asia/Kabul dates. Expenses reject backdating. Opening a later business day requires the preceding day to be confirmed closed; carrying balances forward must not create duplicate money. Owner confirmation rejects unexplained/unapproved discrepancies.

Private evidence uses authenticated upload/download, not public asset URLs. The backend accepts validated PDF/PNG/JPEG up to 5 MiB. Respect context-specific links and permissions; revoke temporary object URLs and avoid long-lived caching of identity documents.

## Implementation conventions and acceptance

Preserve the useful existing MUI shell; add a shared API/auth layer and feature modules with typed contracts rather than placing HTTP/accounting logic into layout widgets. Keep API state separate from appearance contexts. Provide accessible labels, keyboard flows, visible focus, safe destructive confirmation, RTL handling and printable mixed-script receipts. Keep accounting details out of operator flows unless needed to make a decision.

Bundle core runtime assets locally. Do not promise offline posting, sync queues, automatic FX feeds, payroll, bank integration or external beneficiary checks. Browser and Tauri origins, token storage, CSP, downloads and printing each require explicit verification.

Run build/lint plus appropriate component and API-backed browser tests after implementation. Use a disposable backend database for financial tests. Cover role restrictions, organization switching, double submit, uncertain request recovery, exact decimals, partial allocations, dependent reversals, closing boundaries and immutable receipts. No frontend acceptance tests were run while preparing these files. Backend owner/accountant review of financial examples remains pending and must not be represented as completed frontend acceptance.

Follow `PLAN.md` for staged delivery. Do not push the cloned DawaMIS origin or change its remote without an explicit request.
