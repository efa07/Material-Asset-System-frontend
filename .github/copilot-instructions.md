# AI Agent Instructions – Material Asset Management System

You are working inside a **production‑grade full‑stack system** called **Material Asset Management System**. This is not a toy app. Treat it like an enterprise codebase: clean architecture, strict typing, and predictable patterns are mandatory.

Your job as an AI agent is to **extend, refactor, or debug** this system **without breaking existing flows**, while following the rules below.

---

## 1. Project Overview (Big Picture)

This system manages **material assets**, **users**, **roles**, **auditing**, and **secure access control**.

### Tech Stack

### Frontend (`client/`)

* **Framework**: Next.js 14+ (App Router)
* **Language**: TypeScript (strict mode)
* **Styling**: Tailwind CSS + shadcn/ui
* **State Management**: Zustand (`store/useAppStore.ts`)
* **Data Fetching**: TanStack React Query
* **HTTP Client**: Axios (`lib/api.ts`)

### Backend (`server/`)

* **Framework**: NestJS
* **Language**: TypeScript
* **ORM**: Prisma
* **Database**: PostgreSQL
* **Architecture**: Modular, domain‑driven (Controller → Service → Prisma)

---

## 2. High‑Level Architecture Rules (DO NOT VIOLATE)

### Frontend Rules

* ❌ **NO `useEffect` for data fetching**
* ✅ **ONLY** use TanStack Query (`useQuery`, `useMutation`)
* ❌ Do not call APIs directly in components
* ✅ API calls go through `lib/api.ts`
* ✅ Query hooks live in `hooks/` (global or feature‑specific)
* ❌ No global state in React Context
* ✅ Global state lives in **Zustand** only

### Backend Rules

* ❌ No business logic in controllers
* ✅ Controllers = request/response only
* ✅ Services contain all logic
* ✅ Prisma access only via `PrismaService`
* ❌ No raw SQL unless explicitly approved
* ✅ DTOs are mandatory for **every** request body

---

## 3. Folder Responsibilities (You Must Respect This)

### Frontend (`client/`)

```
client/
├── app/                # Next.js routes & layouts (App Router)
├── components/
│   ├── ui/             # shadcn/ui reusable primitives
│   └── <feature>/      # Feature‑specific components
├── hooks/              # React Query hooks ONLY
├── lib/api.ts          # Axios instance (baseURL, interceptors)
├── store/useAppStore.ts# Zustand global store
├── types/              # Frontend domain types
```

### Backend (`server/`)

```
server/
├── src/
│   ├── assets/
│   ├── users/
│   ├── audit/
│   ├── auth/
│   ├── prisma/
│   └── common/
├── prisma/schema.prisma
```

Each backend feature module contains:

* `*.controller.ts`
* `*.service.ts`
* `*.module.ts`
* `dto/`

---

## 4. Authentication & Authorization (Critical)

* Authentication is **centralized** (Keycloak / external IdP assumed)
* Backend **never trusts frontend roles blindly**
* Role‑Based Access Control (RBAC) is enforced **server‑side**
* Frontend uses roles **only for UI visibility**, not security

If you add endpoints:

* Add guards
* Add role checks
* Document expected roles

---

## 5. Data Flow (How Things Actually Work)

### Frontend

1. UI Component
2. Calls a **custom hook** (React Query)
3. Hook calls Axios (`lib/api.ts`)
4. Axios hits NestJS REST endpoint

### Backend

1. Controller validates DTO
2. Service executes logic
3. Prisma reads/writes PostgreSQL
4. Response returned to frontend

No shortcuts. Ever.

---

## 6. Prisma & Database Rules

* Prisma schema is the **single source of truth**
* Use `prisma migrate dev` for schema changes
* Keep relations explicit
* Avoid nullable fields unless required
* Use enums where applicable

If you change Prisma schema:

* Update backend DTOs
* Update frontend types

---

## 7. Type Safety (Non‑Negotiable)

* TypeScript `strict: true`
* ❌ No `any`
* ❌ No implicit `unknown`
* ✅ Explicit interfaces for:

  * API responses
  * DTOs
  * Zustand state

Frontend types live in:

```
client/types/index.ts
```

These **must stay in sync** with backend DTOs.

---

## 8. Coding Style Expectations

* Prefer **clarity over cleverness**
* Small, focused functions
* Descriptive naming
* Early returns > nested logic
* Comments only when logic is non‑obvious

This is a long‑term codebase. Act like future you will maintain it.

---

## 9. Common Mistakes to Avoid

🚫 Fetching data in components
🚫 Mixing UI and business logic
🚫 Skipping DTO validation
🚫 Writing fat controllers
🚫 Ignoring RBAC
🚫 Breaking existing API contracts

---

## 10. When You Are Unsure

If you are not 100% confident:

* Stop
* Ask for clarification
* Do NOT guess

Incorrect assumptions cost more than asking questions.

---

## Final Note

You are assisting a **serious engineering project**.

Act like a senior engineer, not an autocomplete bot.

Clean code. Predictable patterns. Zero drama.
