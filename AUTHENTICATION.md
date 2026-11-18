# Authentication integration

Implements backend PLAN.md Phase 1 in the frontend (authentication is Phase 2 in the frontend roadmap).

## Screens

- `/login`: password login and expiring OTP/TOTP/recovery-code challenge. A challenge never becomes an application bearer token. Cancel and sign in again to request a new email login code.
- `/register`: account registration with explicit consent; registration does not sign in automatically.
- `/forgot-password`, `/reset-password`: email request and token-based reset.
- `/verify-email`, `/resend-verification`: verification and resend. Email-link query tokens are read into the form and removed from browser history by replacing the URL.
- `/profile`: edit personal details through `PATCH /users/me`.
- `/account/security`: current account, password change, session listing/revocation, revoke-all, OTP/TOTP setup, OTP resend, disable, and replacement recovery codes.

Dashboard and account routes require a session verified by `/auth/me`. Organization context is fetched separately; no selected organization does not prevent access to account security. Organization management belongs to phase 3.

## Storage and lifecycle

Access/refresh tokens are held in memory and mirrored to tab-scoped `sessionStorage` under `ems.auth.session`. Reloading restores the credentials and verifies the user through `/auth/me` before showing protected content. An expired access token uses the existing refresh flow; refreshed credentials are persisted, and logout or invalidation removes the saved session. Closing a tab normally ends its session, although browser session restoration can restore tab storage. Browser restarts and native keychain persistence are not guaranteed. If browser storage is unavailable, login still works in memory but cannot survive reloads.

This follows the backend's bearer-token contract: tokens in sessionStorage remain accessible to same-origin JavaScript; they are not HttpOnly cookies. The backend session cookie containing `lang` stores only the language preference and does not authenticate API requests. Passwords, 2FA challenges, QR setup secrets, and recovery codes are never persisted. QR secrets and recovery codes exist only in the mounted security view and can be explicitly hidden. Tokens are not saved to localStorage or URLs.

The client coordinates a single refresh and one retry. The current backend `/auth/refresh` returns only `access_token`; it does not rotate the refresh token despite the older backend plan checkbox. This integration follows that actual contract. Logout clears local credentials after successful server revocation; failed network logout is visible and can be retried.

Backend errors and field validation are displayed in forms. Login, reset and verification requests do not attach an existing account bearer or trigger automatic refresh. Server rate limiting, device information and timestamps remain backend responsibilities.

## Backend repair required with this frontend

The sibling backend changes preserve the enabled OTP secret, reject enablement without setup, resend without replacing secrets, and deliver email OTP during password login. Deploy those changes with the frontend. Existing OTP accounts whose secret was already erased by the old implementation cannot recover that secret: use a recovery code to sign in and arrange account recovery/reset of the two-factor method.

## Verification

`npm run build`, `npm run lint`, and `npm test`. Frontend tests use mocked HTTP responses in jsdom; backend tests exercise real ASGI routes with SQLite, fake Redis, and mocked email delivery. The phase 0–2 browser checks in PLAN.md exercise the live login denial path. Live SMTP delivery and packaged Tauri acceptance remain pending.
