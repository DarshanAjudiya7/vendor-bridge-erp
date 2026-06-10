# VendorBridge ERP 🌉

**VendorBridge** is a modern, fully dynamic, and comprehensive Enterprise Resource Planning (ERP) system designed to streamline procurement, vendor management, and contract awarding. 

Built with the latest web technologies, it provides role-based access for Procurement Officers, Managers, and Vendors to seamlessly interact, request quotes, submit bids, and generate purchase orders.

---

## 🌟 Key Features

* **Role-Based Workflows**: Tailored dashboards and access levels for `ADMIN`, `PROCUREMENT_OFFICER`, `MANAGER`, and `VENDOR`.
* **Vendor Management**: Centralized directory to onboard, track, and manage vendor performance and details.
* **RFQ (Request for Quotation) Engine**: Procurement teams can create detailed RFQs, specify item quantities, attach documents, and assign specific vendors.
* **Vendor Portal**: A dedicated portal where vendors can view assigned RFQs, download attachments, and securely submit their quotations.
* **Smart Comparison Matrix**: Side-by-side bidding comparison allowing procurement officers to evaluate quotes, accept the best bid, and automatically reject others.
* **Purchase Orders & Invoices**: Seamless one-click conversion of an awarded quote into a Purchase Order, along with integrated invoice tracking.
* **Real-time Analytics Dashboards**: Dynamic, data-driven dashboards displaying total spend, active RFQs, pending approvals, and vendor-specific metrics.

---

## 💻 Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Database:** [Neon (Serverless PostgreSQL)](https://neon.tech/)
* **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
* **Icons:** Google Material Symbols

---

## 🏗️ Architecture & Data Flow

VendorBridge operates on a secure Server-Side flow using Next.js Server Actions and Drizzle ORM to ensure maximum performance and security.

1. **Authentication:** Mock credentials are used for role mapping (Admin, Procurement, Manager, Vendor).
2. **Server Actions (`src/lib/actions/*`):** All CRUD operations bypass generic API routes, securely executing database queries directly on the server.
3. **Database Schema (`src/lib/db/schema.ts`):** 
   - `users`, `vendors`, `rfqs`, `rfqItems`, `vendorAssignments`, `quotations`, `purchaseOrders`, `invoices`, `notifications`, `activityLogs`.
4. **Dynamic Routing:** 
   - Procurement flows: `/portal/procurement/*`
   - Vendor flows: `/portal/vendor/*`
   - Admin/Manager dashboards: `/portal/admin/*`

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* A Neon PostgreSQL connection string.

### 1. Clone the repository
```bash
git clone https://github.com/DarshanAjudiya7/vendor-bridge-erp.git
cd vendor-bridge-erp
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your Neon Database URL and NextAuth config:
```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_key
```

### 4. Setup Database & Seeding
Push the Drizzle schema to your Neon database and seed the mock users:
```bash
npx drizzle-kit push
npx tsx -r dotenv/config src/lib/db/seed.ts dotenv_config_path=.env.local
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔑 Mock Login Credentials
Use the following credentials to test different roles within the system:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@vendorbridge.com` | `admin` |
| **Procurement**| `procurement@vendorbridge.com` | `procurement` |
| **Manager** | `manager@vendorbridge.com` | `manager` |
| **Vendor** | `vendor@vendorbridge.com` | `vendor` |

---

## 🛠️ Project Structure
```text
src/
├── app/
│   ├── api/          # API Routes (File Uploads)
│   ├── portal/       # Protected Application Views (Dashboards, RFQs)
│   ├── login/        # Authentication Pages
│   └── globals.css   # Tailwind & Base Styles
├── components/
│   ├── layout/       # Sidebar, Navbar
│   └── ...           # Reusable UI components
├── lib/
│   ├── actions/      # Drizzle Server Actions (rfq, vendor, quotation)
│   ├── db/           # Database Connection & Schemas
│   └── auth.ts       # NextAuth Configuration
```

---

## 👨‍💻 Developer Notes
- **Dynamic Params**: Implemented `React.use()` for Next.js 15+ compatibility with dynamic route params.
- **Relational Integrity**: Foreign key constraints ensure that RFQs, Quotations, and POs are strictly bound to valid Users and Vendors.
- **File Uploads**: Uses a server-side route `/api/upload` to store RFQ documents and Bidding files securely.

---
*Built with ❤️ for modern procurement.*
