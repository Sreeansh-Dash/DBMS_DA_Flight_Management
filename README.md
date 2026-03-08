# ✈️ SkyOps — Flight Management System

A full-stack **Flight Management System** built as a Database Management Systems (DBMS) project. It demonstrates advanced relational modeling concepts including **entity specialization (1:1 subtypes)**, **weak entities**, **M:N join tables with attributes**, **self-referencing relations**, and strict **constraint enforcement** (enums, NOT-NULL, date validation).

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, shadcn/ui |
| **Backend** | Next.js API Route Handlers |
| **ORM** | Prisma 6 |
| **Database** | PostgreSQL (Supabase) |
| **Validation** | Zod |

## 📊 Database Schema

The relational model implements **10 entities** with strict referential integrity:

```
┌──────────────┐       1:1        ┌──────────────────┐
│   Customer   │──────────────────│  FrequentFlyer   │
│  (CusID PK)  │                  │ (mileage, tier)  │
│              │──────────────────│                  │
│              │       1:1        ├──────────────────┤
│              │──────────────────│ RegularCustomer  │
│              │                  │ (freq, airline)  │
│              │       1:1        ├──────────────────┤
│              │──────────────────│    Passport      │
│              │                  │ (PNo PK, expiry) │
│              │       1:N        ├──────────────────┤
│              │──────────────────│    Booking       │
│              │                  │ (status, price)  │
└──────┬───────┘                  └──────────────────┘
       │ M:N
       │
┌──────┴───────┐       M:N        ┌──────────────────┐
│    Flight    │──────────────────│  FlightStaff     │
│  (FID PK)    │   (WorksOn +    │ (StaffID PK)     │
│              │    hours attr)   │                  │
└──────────────┘                  └───────┬──────────┘
                                          │ 1:N (Weak)
                                  ┌───────┴──────────┐
                                  │   Dependent      │
                                  │ (name, contact)  │
                                  └──────────────────┘
```

### Constraints Enforced

| Constraint | Implementation |
|---|---|
| **Flight Status** | Enum: `Arrived`, `Cancelled`, `Departed`, `Delayed` |
| **Booking Status** | Enum: `Paid`, `Cancelled`, `Changed` |
| **Passport Expiry** | Application-level: `expiryDate > today` |
| **NOT-NULL** | `fnumber`, `email`, `contact` (on Dependent) |
| **Unique** | Customer email, Staff email |
| **Weak Entity** | Dependent has composite PK (`staffId` + `name`) |

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** database (or use [Supabase](https://supabase.com) / [Neon](https://neon.tech) free tier)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/Sreeansh-Dash/DBMS_DA_Flight_Management.git
cd DBMS_DA_Flight_Management

# 2. Install dependencies
npm install

# 3. Configure environment
#    Create a .env file with your PostgreSQL connection string:
echo 'DATABASE_URL="postgresql://user:password@host:5432/dbname"' > .env

# 4. Push schema to database
npx prisma db push

# 5. Generate Prisma client
npx prisma generate

# 6. Seed the database with test data
npx prisma db seed

# 7. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma          # Database schema (10 models)
│   └── seed.ts                # Seed script with test data
├── src/
│   ├── app/
│   │   ├── api/               # REST API route handlers
│   │   │   ├── flights/       # Flight CRUD
│   │   │   ├── customers/     # Customer + Passport CRUD
│   │   │   ├── bookings/      # Booking CRUD
│   │   │   ├── staff/         # Staff + Dependents CRUD
│   │   │   └── works-on/      # Flight-Staff assignments
│   │   ├── flights/           # Flight Dashboard page
│   │   ├── customers/         # Customer Portal page
│   │   ├── bookings/          # Booking System page
│   │   ├── staff/             # Staff Management page
│   │   ├── layout.tsx         # Root layout with sidebar
│   │   └── page.tsx           # Dashboard home
│   ├── components/ui/         # shadcn/ui components
│   └── lib/
│       ├── prisma.ts          # Prisma client singleton
│       └── validations.ts     # Zod validation schemas
└── package.json
```

## 🖥️ Application Pages

| Page | Route | Features |
|---|---|---|
| **Dashboard** | `/` | Live stats, system overview, schema reference |
| **Flight Dashboard** | `/flights` | Flight table, colored status badges, inline status updates, add flight |
| **Customer Portal** | `/customers` | Registration with FF/Regular toggle, passport with date validation |
| **Booking System** | `/bookings` | Create bookings, select customer + flight, track payment status |
| **Staff Management** | `/staff` | Crew cards, tabbed flights/dependents, flight assignment with hours |

## 🗃️ Seed Data

The seed script populates the database with:
- **8 flights** (domestic + international routes)
- **6 customers** (3 Frequent Flyers, 3 Regular)
- **6 passports** with valid future expiry dates
- **4 staff** members with dependents
- **8 flight-staff assignments** with hours
- **7 flight-customer mappings**
- **6 bookings** (Paid, Changed, Cancelled)

## 🔧 Useful Commands

```bash
npm run dev              # Start dev server
npx prisma studio        # Open Prisma Studio (DB GUI)
npx prisma db seed       # Re-seed database
npx prisma db push       # Push schema changes
npx prisma generate      # Regenerate Prisma client
```

---

**Built for DBMS DA-2 Assignment** · Next.js · Prisma · PostgreSQL
