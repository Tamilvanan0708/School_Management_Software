# Deployment

## 1. Backend (API) — Railway / Fly.io / any Node host

```bash
git remote add origin <your-repo> && git push -u origin main
```

- Build: `cd backend && pnpm install --frozen-lockfile && npx prisma generate && npx nest build`
- Start: `npx prisma migrate deploy && node dist/main.js`
- Env vars: see `backend/.env.example`. Generate `JWT_SECRET`: `openssl rand -hex 48`.
- Expose port 4000. Postgres: use Supabase/Neon/Railway-Postgres → set `DATABASE_URL`.

### Seed a production DB

```bash
node -e "process.env.JUST_SEED=1" && cd backend && npx prisma db seed
# ⚠️ Immediately change ALL seeded demo user passwords afterwards.
```

## 2. Web portal — Vercel

- Import repo, framework auto-detected; set **Root directory** to `apps/web`… but because the app consumes workspace packages, prefer a project-level build:
  - Build command: `pnpm install && pnpm --filter @school/web build`
  - Output: Next's standalone or the default `.next` cache.
- Env: `NEXT_PUBLIC_API_URL=https://<api-host>/api/v1`
- Backend `ALLOWED_ORIGINS` must include the Vercel domain (comma-separated list).

## 3. Mobile — Expo EAS

```bash
cd apps/mobile
npm i -g eas-cli && eas login
eas build -p ios --profile production      # first build prompts bundle identifier
eas build -p android --profile production
eas update --channel production            # OTA JS updates (no store re-review)
```

- Set `EXPO_PUBLIC_API_URL` in `eas.json` `env` for each profile.
- Push notifications later: `expo-notifications` + FCM/APNs keys (deferred until store builds).

## 4. Razorpay (India payments)

1. Enable **Test Mode** at dashboard.razorpay.com → copy `Key ID` / `Key Secret` → backend env.
2. Add a **Webhook** → URL `https://<api-host>/api/v1/fees/webhook/razorpay`, secret any string → `RAZORPAY_WEBHOOK_SECRET`. Events: `payment.captured`, `order.paid`.
3. Payments stay in *mock order* mode (no keys) while developing; real orders activate automatically once both keys exist.

## 5. After first deploy

```bash
# create the real school + year + classes via the portal, then:
# - disable demo seed users / set strong passwords
# - point the school's parents/students to portal URL
```
