# AI Agent Instructions – Material & Asset Management System (MAMS)

These rules make AI agents productive and safe in this codebase. Keep changes minimal, typed, and consistent with existing patterns.

## Big Picture
- **Frontend:** Next.js App Router (client/), TypeScript strict, Tailwind + shadcn/ui.
- **Backend:** NestJS (server/), Prisma + PostgreSQL, Swagger docs at `/docs`.
- **Contract:** `.github/api-spec.json` is the single source of truth; never guess endpoints or DTOs.
- **DB Schema:** See `server/prisma/schema.prisma` for relationships before changing anything.

## Core Conventions
- **Data fetching:** Use `client/hooks/` (`useQueries.ts`, `useMutations.ts`). No `useEffect` for API calls.
- **HTTP client:** All calls go through `client/lib/api.ts` (Axios) which attaches NextAuth `accessToken` to `Authorization`.
- **State:** Use Zustand. Persist only UI prefs (`theme`, `sidebarCollapsed`) via `useAppStore` partialize. Do not persist auth tokens.
- **Types:** Mirror backend DTOs in `client/types/`. If DTOs change, update types and queries/mutations together.
- **Nest controllers:** Routing + DTO validation only. Business logic in `*.service.ts`. Use `PrismaService`; no raw SQL.

## Patterns Seen In Code
- **Query keys:** `assets`, `users`, `stores`, `shelves`, `categories`, `assignments`, `maintenance-tasks`, `transfer-requests`, `disposals`, `dashboard-*`. Mutations must `invalidateQueries` for these keys.
- **Data shaping examples:**
   - `useUsers()`: flatten `u.role.name` to kebab-case; compose display `name`.
   - `useAssets()`: normalize `code` and `currentValue` from various fields.
- **Auth usage:** Axios `baseURL` uses `NEXT_PUBLIC_API_URL` (default `http://localhost:5000/api/v1`). Backend default `PORT=5000` (`server/src/main.ts`).

## Build & Run
- **Backend (5000):**
   - Install: `cd server && npm install`
   - Migrate: `npx prisma migrate dev`
   - Seed (optional): `npm run seed`
   - Dev: `npm run start:dev` (Swagger at `http://localhost:5000/docs`)
- **Frontend (3000):**
   - Install: `cd client && npm install`
   - Dev: `npm run dev`
   - Set `NEXT_PUBLIC_API_URL` to point at backend `/api/v1`.

## Testing & Debugging (server)
- Unit: `npm run test`  • E2E: `npm run test:e2e`  • Coverage: `npm run test:cov`
- Format/Lint: `npm run format` • `npm run lint`

## Change Management
- Update `.github/api-spec.json` whenever DTOs/controllers change.
- Keep client/server in sync: update `client/types/`, hooks, and UI where the contract changes.
- Add DTOs with `class-validator` in `server/src/**/dto/` and wire them via controllers to the service.

## Where To Look First
- **Examples:** `client/hooks/useQueries.ts`, `client/hooks/useMutations.ts` for React Query patterns.
- **HTTP:** `client/lib/api.ts` for auth header and base URL.
- **State:** `client/store/useAppStore.ts` for persisted UI prefs; `client/store/auth.store.ts` for ephemeral auth.
- **API Surface:** Swagger at `/docs` and `.github/api-spec.json` for endpoints.

## Guardrails
- Don’t introduce Context for global state; use Zustand.
- Don’t add business logic in Nest controllers; put it in services.
- Don’t store sensitive tokens in persisted state.
- Don’t change query keys casually; they drive cache invalidation throughout the app.

