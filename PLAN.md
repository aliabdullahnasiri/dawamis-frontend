# EMS frontend implementation plan

The frontend adapts the cloned DawaMIS React/MUI/Tauri shell to the Exchange Management System for Afghan sarafi shops. The sibling `../ems-backend` is the API authority. Backend workflows exist; their presence does not mean frontend screens are implemented.

## Tracking and completion rules

Use `[x]` only for implemented and verified work, `[ ]` for remaining work. Each phase must deliver usable screens, loading/empty/error states, permission handling, responsive RTL layouts, and relevant integration tests. Do not mark accounting acceptance complete without owner/accountant review.

## Phase 0 — Baseline and EMS shell

- [x] Clone `git@github.com:aliabdullahnasiri/dawamis-frontend.git` into `ems-frontend`.
- [x] Inspect the existing React, TypeScript, Vite, MUI, React Router and Tauri structure.
- [x] Document backend contracts and the frontend implementation roadmap.
- [x] Run `npm ci`, `npm run build`, and `npm run lint`; document baseline failures before changing code.
- [x] Resolve React Router package/version consistency using actual imports and the lockfile.
- [x] Replace pharmacy branding, placeholder routes and permissions with EMS features and colon-delimited backend permission names.
- [x] Update package metadata, HTML title, assets and Tauri product/bundle identifiers consistently.
- [x] Replace the artificial startup delay with actual session/context bootstrap; remove unconditional context-menu blocking.
- [x] Keep reusable dashboard/sidebar/theme components and provide keyboard navigation, focus states and compact operator layouts.
- [x] Establish Dari, Pashto and English translations, RTL theme/Emotion styling, bundled fonts and locale persistence.

Acceptance: the EMS shell builds, exposes no pharmacy pages, and works in both RTL and LTR.

## Phase 1 — API client and shared UI contracts

- [x] Configure the API base URL; never put secrets in Vite environment variables.
- [x] Resolve the current Vite port 5173 versus backend CORS origin localhost:3000 mismatch through a documented dev proxy or coordinated origin configuration.
- [ ] Generate/review TypeScript contracts from the running backend `/openapi.json`; retain decimal amounts as strings and distinguish UUID paths from integer references.
- [x] Implement a shared transport, bearer authorization, single-flight refresh and bounded retry handling.
- [x] Parse standard response envelopes and sanitized validation field paths; handle binary file/CSV responses separately.
- [x] Add connection status, authentication expiry, forbidden, missing record, conflict, validation, rate-limit and server-error states.
- [x] Implement reusable decimal/currency inputs, search, paginated tables, date filters, permission gates, confirmation dialogs and receipt layouts.
- [x] Preserve a stable `Idempotency-Key` and exact payload across uncertain financial submissions; do not queue offline money writes.
- [ ] Add a frontend test runner and component/browser integration tests; no test script exists in the clone yet.

Acceptance: token refresh is coordinated, errors map to forms, and repeated uncertain submissions cannot create a new financial operation accidentally.

## Phase 2 — Authentication and account security

- [x] Implement registration, login, current-user bootstrap and logout.
- [x] Branch login into normal token issuance or expiring 2FA challenge verification; challenge tokens must not authorize ordinary APIs.
- [x] Implement email verification/resend and password forgot/reset/change flows.
- [ ] Implement profile editing, session listing, individual revocation and revoke-all.
- [x] Implement supported OTP/TOTP setup, verification, enable/disable and recovery-code flows from current OpenAPI schemas.
- [x] Keep credentials, OTPs, QR secrets and recovery codes out of logs, analytics and reusable query caches.
- [x] Decide and document token storage separately for browser and Tauri; existing localStorage utilities store UI preferences only.

Acceptance: login, challenge expiry/replay, refresh failure, logout and session revocation are tested against the backend.

## Phase 3 — Organization, shop and staff context

- [ ] Implement organization list/create/manage and membership administration.
- [ ] Select an organization through `POST /auth/organizations/{uuid}/select`; bootstrap effective permissions from `GET /auth/context`.
- [ ] Select a shop from authorized shops; include `shop_id` on relevant EMS requests.
- [ ] On context change cancel in-flight requests, discard old forms/retry operations, clear tenant data and refetch permissions/settings.
- [ ] Scope caches by authenticated identity, organization and shop; discard late responses from old contexts.
- [ ] Implement custom roles, permission assignment and member-role changes through organization-scoped APIs.
- [ ] Handle protected system roles, inactive memberships and owner-only actions explicitly.
- [ ] Build settings/shop management and private upload/download components.

Acceptance: switching tenants never displays or submits another tenant's cached financial data; backend denial always takes precedence over UI gates.

## Phase 4 — Financial setup and opening balances

- [ ] Build shop receipt/settings forms, currency configuration and cashbox administration.
- [ ] Display separate balances for every cashbox/currency and distinguish physical cash from AFN carrying value.
- [ ] Implement reviewed cash opening entries with explicit owner approval, reason and retry protection.
- [ ] Support configured precision, Persian/Arabic numeral entry, AFN/USD/PKR and explicit IRR versus IRT units.
- [ ] Expose authorized ledger history and cash movements with filters and pagination.
- [ ] Prevent edits to posted financial entries; provide the supported linked reversal workflow.

Acceptance: openings reconcile to backend balances without converting or summing unlike currencies.

## Phase 5 — Customers and agents

- [ ] Build contacts search/create/detail/edit/deactivate, customer/agent role flags and private identity attachments.
- [ ] Show customer and agent receivables/payables separately using plain labels: “owes us” and “we owe”.
- [ ] Add reviewed contact opening balances, statements, date/currency filters and supported exports.
- [ ] Show inactive contacts' retained history and protect identification/evidence display by permission.

Acceptance: original-currency statements match backend balances and customer/agent roles are never silently netted.

## Phase 6 — Exchange counter

- [ ] Implement manual buy/sell rate entry/history and a clear base/quote pair selector.
- [ ] State rate direction explicitly: quote units per one base unit; buy/sell is from the shop's perspective.
- [ ] Quote via `POST /exchanges/quote`; display received/paid currencies, rounding and required AFN valuations.
- [ ] Post with stable retry keys and show server-returned receipt/reference, not a locally fabricated receipt.
- [ ] Support walk-in cash trades, customer-linked credit/partial trades and explicit unpaid foreign valuation inputs.
- [ ] Implement searchable exchange history, immutable receipt reprints and owner-approved reversals.
- [ ] Explain linked-payment reversal dependencies and stale quotes/insufficient cash without losing entered data.

Acceptance: buy/sell, credit, concurrent cash changes, identical retries, reversal conflicts and Unicode receipts are tested.

## Phase 7 — Customer payments

- [ ] Show outstanding obligations and partial/final allocation controls, preserving each obligation's unit/direction.
- [ ] Implement receive/pay forms, allocation limits and exact validation against the backend.
- [ ] Implement different-currency settlement as the documented fully unpaid exchange bridge followed by payment; recover safely if only the first step succeeds.
- [ ] Add payment history, receipts and owner-approved reversals; refresh affected obligations/cash after successful writes.

Acceptance: a 10,000 AFN debt paid by 6,000 leaves 4,000; bridge settlements and reversed payments reconcile correctly.

## Phase 8 — Hawala and agent settlements

- [ ] Build incoming/outgoing drafts, full terms, sender/recipient/destination and fee recognition policy forms.
- [ ] Implement confirm, payout, cancel, partial/full refund and owner review using actual transition schemas/permissions.
- [ ] Clearly separate payout state, agent settlement state, refund due and earned fees.
- [ ] Record beneficiary/instruction verification and evidence references without suggesting an external transfer was sent automatically.
- [ ] Freeze editing after confirmation; retain lifecycle history and confirmation receipts.
- [ ] Implement agent obligations, receive/pay allocations, settlements, statements and permitted reversals.

Acceptance: duplicate payout/refund attempts, cancellation with live settlements, deferred fees and partial settlement are covered.

## Phase 9 — Expenses and business-day closing

- [ ] Build expense categories, current-Kabul-date expenses, evidence upload and permitted reversals.
- [ ] Implement same-currency cash transfers between distinct cashboxes; show no profit effect.
- [ ] Open a business day, collect counted cash per currency/cashbox and display expected/count/difference.
- [ ] Submit closing, handle owner review and approved discrepancy adjustment, then open the next actual business day.
- [ ] Respect closed-period rejection; reprint/export saved closing reports without reposting balances.
- [ ] Accommodate permission asymmetry: cashiers may post operations but cannot read report-protected lists/current-day endpoints by default. Request a backend contract decision if the UI needs more access; never broaden grants silently.

Acceptance: unexplained differences cannot be confirmed, balances carry once, and next-day opening follows confirmed closing.

## Phase 10 — Dashboard, reports and audit

- [ ] Build permission-aware dashboard, daily/cash/outstanding/profit/hawala reports and protected audit views.
- [ ] Use returned historical AFN book values and valuation disclosures; never estimate profit using today's rate.
- [ ] Implement day/start/cutoff/closing/cashier/currency/contact/cashbox filters according to each report's semantics.
- [ ] Show gross customer/agent directions, pending hawalas and refunds separately from earned profit.
- [ ] Download CSV using response headers and preserve the returned shop/filter/generation metadata.
- [ ] Explain that dashboard balances are cumulative while its profit/volume honor start; cash with start shows movement.
- [ ] Obtain owner/accountant review of displayed profit and representative reconciliation examples. Backend human accounting acceptance is still pending.

Acceptance: screen totals and exports match the same backend cutoff and filters, including reversal history.

## Phase 11 — Local operation, receipts and release acceptance

- [ ] Bundle runtime fonts/assets and avoid CDN dependencies for core operation on the shop LAN.
- [ ] Document backend address configuration, browser hosting/deep links, TLS/origins and operator restart steps.
- [ ] Verify Tauri navigation, approved API origins, CSP, private downloads, printing and platform packaging before claiming desktop support.
- [ ] Support printer-friendly Dari/Pashto receipts and statements, including long names, mixed text/numbers and reprints.
- [ ] Distinguish unavailable internet from unavailable local backend; financial submissions require the live backend.
- [ ] Verify cashier/accountant/owner roles, tenant switching, expired sessions, double clicks, request timeout recovery and inaccessible attachments.
- [ ] Run build/lint, component tests and end-to-end workflows against a disposable backend database.
- [ ] Reconcile opening → exchange → payment → hawala → settlement → expense → transfer → closing → report with reviewed books.
- [ ] Document known backend/UI gaps and release only after operator acceptance.

## Progress — 2026-11-16

Phase 0 shell and phase 1 transport/shared component implementation are present. EMS shell has no pharmacy navigation, fake user profile or startup timer. Configurator supports persisted English/Dari/Pashto, translated shell/common controls, bundled Arabic fonts, MUI direction and Emotion RTL processing. API URL is configured in .env/.env.example via a documented Vite proxy. In-memory token lifecycle bootstraps verified /auth/context, clears old context and rejects stale-session retry intents. No login screen is claimed before phase 2.

Contracts were generated from the sibling backend application's OpenAPI schema without lifespan/database access; snapshot and generator are included. Fetching /openapi.json from a running backend and API-backed real-browser acceptance remain unverified, so their combined checklist items remain open. Component integration tests run in jsdom, not a real browser. Financial/accounting acceptance remains outside these phases.

Verification: build/lint and transport/component tests. Tests cover exact financial retries/double clicks, single-flight refresh, failed-refresh invalidation, sanitized validation paths, binary responses, locale persistence/RTL, permission denial, Unicode money input, busy confirmation and session bootstrap/logout. Production desktop packaging/CSP and full financial feature screens remain later-phase work.

## Authentication integration — 2026-11-16

Backend Phase 1 authentication screens and API integration are implemented; see [AUTHENTICATION.md](AUTHENTICATION.md). Session management is implemented. The combined profile/session item above remains open because profile editing belongs to the user-system integration. Browser and Tauri tokens are memory-only. The sibling backend OTP lifecycle repair is required. Mocked frontend integration tests and backend ASGI tests cover the authentication flows; live browser/email and packaged desktop acceptance remain pending. The backend refresh endpoint issues a new access token without refresh-token rotation.
