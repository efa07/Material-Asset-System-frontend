# Enterprise Material & Asset Management System (MAMS)

An enterprise-grade, role-based material and asset management system built with Next.js, NestJS, and PostgreSQL. This system provides a comprehensive suite of tools for tracking the entire lifecycle of corporate assets—from procurement and registration to maintenance, transfer, and disposal.

## 🚀 Key Features

### 📦 Asset Lifecycle Management
- **Store & Shelf Registration:** Manage multiple storage facilities with hierarchical shelf organization.
- **Asset Inventory:** Register assets with detailed specifications, serial numbers, and categorical tracking.
- **Allocation & Assignments:** Streamlined workflows for assigning assets to employees and tracking due dates.
- **Transfers & Returns:** Protocol-driven processes for moving assets between users or stores.
- **Asset Disposal:** Formalized tracking of scrapped, sold, or retired assets.

### 🛠️ Maintenance & Performance
- **Maintenance Records:** Schedule and track preventive and corrective maintenance tasks.
- **Technician Dashboard:** Dedicated view for maintenance personnel to update task status.
- **Performance Logs:** Monitor asset health and utilization metrics over time.

### 🔐 Security & Governance
- **Role-Based Access Control (RBAC):** Distinct dashboards and permissions for Admin, Store Manager, Asset Manager, Technician, Employee, and Auditor.
- **Keycloak Integration:** Enterprise-ready authentication and identity management.
- **Audit Logging:** Detailed tracking of all system actions for compliance and accountability.
- **Workflow Engine:** Approval-based system for asset requests, transfers, and disposals.

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) & [TanStack Query](https://tanstack.com/query/latest)
- **UI Components:** [Shadcn/ui](https://ui.shadcn.com/) & [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend
- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma v6](https://www.prisma.io/)
- **Documentation:** [Swagger/OpenAPI](https://swagger.io/)
- **Security:** Helmet, CORS, and Role Guards

## 📂 Project Structure

```text
Material-Asset-System/
├── client/                 # Next.js Frontend
│   ├── app/                # App Router (Pages & Layouts)
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks (React Query)
│   ├── store/              # Zustand state stores
│   └── lib/                # Shared utilities and mock data
├── server/                 # NestJS Backend
│   ├── src/                # Source code
│   │   ├── assets/         # Asset management module
│   │   ├── maintenance/    # Maintenance tracking module
│   │   ├── workflows/      # Approval engine
│   │   └── ...             # Other feature modules
│   └── prisma/             # Schema and Migrations
└── ...
```

## 👣 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Keycloak (Optional, for full auth flow)

### Setup Backend
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mams"
   ```
4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run start:dev
   ```

### Setup Frontend
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📜 Business Use Cases (BUCs)
This project implements the following core business requirements:
1. **Store Registration:** Management of storage facilities.
2. **Shelf Registration:** Organization of storage units within stores.
3. **Category Management:** Hierarchical asset classification.
4. **Item Registration:** Unique tracking of asset units.
5. **Asset Assignment:** User-to-asset allocation.
6. **User Card Maintenance:** Digital tracking of employee holdings.
7. **Asset Maintenance:** Preventive and corrective scheduling.
8. **Performance Tracking:** Asset health and metric logging.
9. **Asset Transfer:** Managed relocation of materials.
10. **Asset Return:** De-allocation and condition assessment.
11. **Asset Disposal:** End-of-life management.
12. **Role Management:** Fine-grained access control.
13. **Workflow Management:** Notification and approval triggers.

## 📄 License
This project is [MIT] (LICENSE).