# AI Agent Instructions – Material Asset Management System

You are working inside a **production‑grade full‑stack system** called **Material Asset Management System**. This is not a toy app. Treat it like an enterprise codebase: clean architecture, strict typing, and predictable patterns are mandatory.

Your job as an AI agent is to **extend, refactor, or debug** this system **without breaking existing flows**, while following the rules below.

---

## 1. Project Overview (Big Picture)

The system manages **material assets**, **users**, **roles**, **auditing**, and **secure access control**, designed for an enterprise environment.

### Tech Stack

#### Frontend (`client/`)
* **Framework**: Next.js 14+ (App Router)
* **Language**: TypeScript (strict mode)
* **Styling**: Tailwind CSS + shadcn/ui
* **State Management**: Zustand (`store/useAppStore.ts`)
* **Data Fetching**: TanStack React Query via custom hooks
* **HTTP Client**: Axios (`lib/api.ts`)

#### Backend (`server/`)
* **Framework**: NestJS (Standard Architecture)
* **Language**: TypeScript (strict, ES2023)
* **ORM**: Prisma (`prisma/schema.prisma`)
* **Database**: PostgreSQL
* **API Documentation**: OpenAPI/Swagger (Spec at `.github/api-spec.json`)

---

## 2. API & Data Schema (Crucial)

**The single source of truth for the API contract is `.github/api-spec.json`**.
* **ALWAYS** read `.github/api-spec.json` when implementing frontend API calls or understanding backend capabilities.
* **NEVER** guess endpoints or payload structures.
* If you modify the backend `*.controller.ts` or DTOs, you imply a change to this contract.

**Database Schema**:
* The `server/prisma/schema.prisma` file defines the database structure.
* When adding features, check this file first to understand relationships.

---

## 3. High‑Level Architecture Rules (DO NOT VIOLATE)

### Frontend Rules
* ❌ **NO `useEffect` for data fetching**. Use `useQuery` or `useMutation`.
* ✅ **ONLY** use custom hooks in `client/hooks/`. Create new ones if needed.
* ✅ API calls strictly go through `lib/api.ts` which uses the Axios instance.
* ❌ No global state in React Context. Use **Zustand** (`store/useAppStore.ts`) for app-wide state (auth, theme, notifications).
* ✅ Use `persist` middleware in Zustand only for user preferences (theme, sidebar), not sensitive data.
* ✅ Types in `client/types/` must mirror backend DTOs.

### Backend Rules
* ❌ No business logic in controllers. Controllers are for DTO validation and routing only.
* ✅ Logic lives in `*.service.ts`.
* ✅ Database access is **exclusively** via `PrismaService`.
* ❌ No raw SQL. Use Prisma's methods.
* ✅ **DTOs are mandatory** for all inputs. Validation decorators (`class-validator`) are required.
* ✅ All modules are imported in `app.module.ts`.

---

## 4. Folder Responsibilities

### Frontend (`client/`)
* `app/`: Next.js App Router pages. `(auth)` group for public auth pages. `dashboard/` for protected routes.
* `components/ui/`: shadcn/ui primitives. **Do not modify** unless theming.
* `components/<feature>/`: Feature-specific UI logic.
* `hooks/`: **All** data fetching logic (`useQueries.ts`, `useMutations.ts`).
* `store/`: Zustand stores. `headers` and `auth` logic often interact here.
* `lib/`: Utilities. `api.ts` (Axios setup), `auth.ts` (Helpers).

### Backend (`server/src/`)
* Each feature (e.g., `assets`, `users`) has its own module folder.
* `dto/`: Request/Response data transfer objects.
* `common/`: Shared guards, filters, interceptors.
* `prisma/`: Database connection service.

---

## 5. Development Workflow

### Builds & Execution
* **Frontend**: `cd client && npm run dev` (Port 3000)
* **Backend**: `cd server && npm run start:dev` (Port 3000/API). *Note: Ensure ports don't conflict, default Nest port is 3000, Next is 3000. Check `server/src/main.ts` or env vars.*

### Database
* **Migration**: `cd server && npx prisma migrate dev`
* **Studio**: `cd server && npx prisma studio` (to view data)

### Type Synchronization
If you change `schema.prisma` or Backend DTOs:
1. Run migration.
2. Update backend `*.entity.ts` or DTOs.
3. Update `.github/api-spec.json` (if automated) or manually ensure consistency.
4. **Update Frontend Types** in `client/types/` to match. The frontend **will break** if types drift.

---

## 6. Authentication & Authorization

* **Mechanism**: JWT-based.
* **Backend**: Guards in `common/guards`. Role checks using `@Roles()` decorator.
* **Frontend**: `store/auth.store.ts` (or `useAppStore.ts`) holds user state.
* **RBAC**: Server-side enforcement is primary. Client-side hiding is for UX only.

---

## 7. Implementation Guidelines

1. **When implementing a new feature**:
   * **Read** `schema.prisma` to model data.
   * **Read** `.github/api-spec.json` to stick to naming conventions (RESTful).
   * **Create** Backend: Module -> Controller -> Service -> DTOs.
   * **Create** Frontend: Type definition -> specialized React Query hook -> UI Component.

2. **When Refactoring**:
   * Check for breaking changes in the API contract.
   * Ensure `useAppStore` logic remains consistent.
   * Keep components pure where possible.

3. **Common Pitfalls**:
   * Importing server code in client (strict separation required).
   * forgetting `export class` in DTOs.
   * Not handling loading/error states in React Query hooks.

---

## 8. When You Are Unsure

* Check existing patterns in `server/src/users/` (Standard Backend Module) or `client/hooks/` (Standard Frontend Data Fetching).
* Ask/Check for the latest API spec if the frontend call fails.
* **Do not invent new architectural patterns.** Consistency is key.

