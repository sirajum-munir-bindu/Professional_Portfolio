# Alexander Wright | Staff Software Engineer & Cloud Architect Portfolio

A premium, interactive, performance-first developer portfolio and custom administration studio built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **PostgreSQL**.

Designed like a modern digital product engineering studio, featuring interactive architectural topology maps, real-world case study blueprints, verified production metrics, and an authenticated administrative content management system.

---

## 1. Architectural Highlights

- **React Server Components by Default**: Zero-bloat client footprint. The homepage first-load JavaScript is only **~120 kB**, well within strict Web Performance budgets.
- **Interactive Architecture Explorer**: Visual node-and-edge system diagram allowing visitors to deep-dive into distributed systems, failover protocols (`gRPC`, `Raft`, `ACID serializable transactions`), and service tiers.
- **Dynamic Case Study Engine**: Structured engineering blocks (Problem Statement, Architectural Blueprint, Tech Decisions, Key Features, Verified Production Outcomes, and Lessons Learned).
- **Custom Admin Studio**: Protected by JWT/Cookie session authentication, bcrypt password hashing, and server-side RBAC guards on all server actions and API routes.
- **Resilient Multi-Runtime Data Layer**: Seamlessly queries PostgreSQL via Prisma with pooled connections on Vercel/Neon; includes automatic graceful offline fallback so the application runs locally even before external databases are provisioned.
- **Security & Bot Protection**: Rate-limited admin authentication (5 attempts / 10 min), rate-limited contact submissions (3 inquiries / 15 min), bot honeypot fields, and strict security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`).

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 15 (App Router)** with React 19 |
| Language | **TypeScript 5.7+** (Strict mode) |
| Styling & Theme | **Tailwind CSS** (Refined dark theme: `#090a0f`, `#10121a`, cyber emerald `#10b981`) |
| Database & ORM | **PostgreSQL** + **Prisma ORM 6** |
| Authentication | **Jose (JWT)** + **Bcrypt.js** (HttpOnly, Secure Cookies) |
| Validation | **Zod 3.24** (Zero untrusted inputs allowed) |
| Visualization & UI | **HTML5 Canvas / SVG Topology Engine**, Lucide Icons |
| Automated Testing | **Vitest 3** (Unit & Integration tests) |
| Target Platform | **Vercel Edge & Serverless Functions** |

---

## 3. Local Installation & Development

### Prerequisites
- Node.js `v20.x` or `v22.x` LTS
- npm `v10+` or `v11+`
- (Optional) Local PostgreSQL instance or remote connection URL (Neon, Supabase, Vercel Postgres)

### Step 1: Clone & Install Dependencies
```bash
git clone <repository-url>
cd Professional_Portfolio
npm install
```

### Step 2: Environment Configuration
Copy the provided `.env.example` template to `.env`:
```bash
cp .env.example .env
```

Ensure the following variables are configured in `.env`:
```env
# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/portfolio_db?schema=public"

# Admin JWT session secret (generate with: openssl rand -base64 32)
AUTH_SECRET="your-secure-32-byte-hex-or-base64-secret"

# Initial admin bootstrap credentials
ADMIN_EMAIL="admin@portfolio.local"
ADMIN_PASSWORD="SecureAdminPassword123!"
ADMIN_NAME="Portfolio Architect"

# Site canonical URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Step 3: Database Migration & Seeding
If using a live PostgreSQL database:
```bash
# Push schema migrations to PostgreSQL
npm run db:push

# Seed with production-grade engineering projects & system architectures
npm run db:seed
```
*(Note: If you run without a live database, the resilient data layer automatically serves seeded mock blueprints and enables administrative testing in offline/fallback mode!)*

### Step 4: Secure Administrator Initialization
To create or update the administrator account in your database:
```bash
npm run admin:create admin@portfolio.local SecureAdminPassword123! "Alexander Wright"
```

### Step 5: Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public portfolio, or [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to access the Admin Studio.

---

## 4. Automated Testing & Verification

Run the automated test suite powered by Vitest:
```bash
npm test
```
The test suite validates:
- Rate limiter sliding window and reset triggers
- Zod schemas for contact inquiries, authentication, and projects
- Protection of unreleased draft projects from public visitors
- JWT token encryption, signature verification, and tamper detection
- Database CRUD mutations and architecture diagram binding

To execute a full production build:
```bash
npm run build
```

---

## 5. Deploying to Vercel

### Step 1: Create PostgreSQL Database (Neon / Supabase / Vercel Postgres)
1. In your Vercel Dashboard, navigate to the **Storage** tab and create a **Neon Serverless Postgres** or **Vercel Postgres** database.
2. Note the generated `DATABASE_URL` (connection pooled URL) and `DIRECT_URL`.

### Step 2: Configure Environment Variables in Vercel
In **Vercel Project Settings &rarr; Environment Variables**, add:
- `DATABASE_URL`: Your production connection-pooled PostgreSQL URL.
- `AUTH_SECRET`: A high-entropy 32-byte secret (`openssl rand -base64 32`).
- `ADMIN_EMAIL`: Your primary administrator login email.
- `ADMIN_PASSWORD`: A strong administrator password.
- `ADMIN_NAME`: Your display name.
- `NEXT_PUBLIC_SITE_URL`: Your custom production domain (e.g. `https://alexanderwright.dev`).

### Step 3: Run Database Migrations on Production
From your local terminal with production `DATABASE_URL` set, or via Vercel Build Step:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### Step 4: Deploy
Push your repository to GitHub / GitLab and import the project into Vercel.
Vercel will detect Next.js 15 automatically and run:
- Build command: `next build`
- Output directory: `.next`

---

## 6. Admin Studio Capabilities

Accessible at `/admin/dashboard`:
- **Dashboard Overview**: Active operational metrics (Total projects, Published count, Drafts, Unread inquiries).
- **Project Manager (`/admin/projects`)**: Full CRUD operations, toggle featured/published status, manage technology tags, and edit case study problem/solution/outcomes.
- **Architecture Diagram Editor**: Add/remove nodes (Frontend, API Gateway, Auth, Ingest Queue, Kafka, Redis, Database replicas) and define inter-service protocol edges (`gRPC`, `HTTPS/REST`, `SQL Connection`).
- **Skills Matrix (`/admin/skills`)**: Group capabilities into categories with practical production evidence notes.
- **Experience & Achievements (`/admin/experience`, `/admin/achievements`)**: Career milestones, certifications, and hackathon wins.
- **Media Storage (`/admin/media`)**: Secure asset manager validating file formats, SHA-256 keys, and size restrictions.
- **Inquiries Inbox (`/admin/messages`)**: Review, filter, and respond to inbound consulting and hiring requests.
- **Site Settings (`/admin/settings`)**: Update biography, accent branding tokens, availability badges, and SEO metadata.

---

## 7. License
Proprietary &copy; 2026. All rights reserved.
