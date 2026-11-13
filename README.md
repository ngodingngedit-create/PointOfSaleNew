# POS cashier PIN administration

This version moves cashier PIN authentication to server-only API handlers. Cashier PINs are accepted only as 4–6 digits, converted to per-PIN salted scrypt hashes, and stored in the existing Supabase project. Sanity remains the public cashier directory; the login code reads only profile fields and never reads or writes a PIN there. The browser receives no bearer token and keeps no authentication state in `localStorage`; signed sessions use an `HttpOnly`, `SameSite=Strict` cookie, verified by the server. Checkout and PIN-management APIs require the appropriate server-validated role.

## Before enabling sign-in

The secure API intentionally fails closed until the existing Supabase project has been configured. No schema has been applied to the live project and no production deployment has been made. Do not enable the Vercel deployment until the migration and server-only settings below are complete.

1. In the SQL editor for the existing project `qrqwdrhogdiqdbzbhbcl`, run `supabase/migrations/20261103000000_pos_pin_security.sql`. It creates RLS-protected credential and rate-limit tables. Only the service role can access them; the anon and authenticated roles receive no table access or RPC permission.
2. Set these **server-only** Vercel environment variables for the deployment:
   - `SUPABASE_URL=https://qrqwdrhogdiqdbzbhbcl.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` — the service-role key from this existing Supabase project; never use a `VITE_` prefix and never put it in a client build.
   - `POS_SESSION_SECRET` — at least 32 random bytes. Generate with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`.
   - `POS_ADMIN_USERNAME` — choose a private administrator username.
   - `POS_ADMIN_PASSWORD_HASH` — generate as shown below; the clear-text password is not stored in Vercel.
3. Generate a strong administrator password hash from a terminal in this project with `npm run admin:hash`. Use a unique password of at least 12 characters. Copy the printed `POS_ADMIN_PASSWORD_HASH=...` assignment into the Vercel server environment, then close the terminal. Do not put the password or hash in frontend variables or source control.
4. Configure the same variable names in a local ignored `.env.local` only if you need to test locally. `.env.example` contains placeholders; it is not a secrets file.
5. Set a cashier PIN from `/admin/login` after the server settings and migration are active. Existing cashier profiles without a credential cannot sign in. There is no fallback or default PIN.

Apply all Vercel settings to the production environment only after you have approved a deployment. If `SANITY_PROJECT_ID`, `SANITY_DATASET`, or `SANITY_API_VERSION` are already configured, keep their existing public Free-dataset settings unchanged. `SANITY_API_TOKEN` is not used for PIN authentication and must not be moved to any `VITE_` variable.

## Local checks

```bash
npm install
npm test
npm run build
```

PIN authentication uses Supabase RPC-backed 15-minute windows with limits by cashier/IP, cashier account, and IP; administrator sign-in is limited by admin account and IP. Reaching a threshold creates a 15-minute lockout. A missing project credential, SQL migration, password hash, or session secret yields a server error rather than enabling demo authentication.

## Existing checkout limitations not changed here

The uploaded project’s existing checkout flow still stores idempotency keys in a per-process memory map and the browser generates a new key for each checkout call. This does not reliably deduplicate a retry across serverless instances or after a timeout. Also, stock is read and checked before an unconditional Sanity decrement, so simultaneous checkouts can oversell. These transaction-integrity issues are outside the PIN/admin change and need a separate design before treating checkout as strongly idempotent or inventory-atomic.
