# Modern Full-Stack Professional Portfolio & CMS Platform

A production-ready, enterprise-grade personal portfolio and Content Management System (CMS) engineered with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Node.js / Express**, **Prisma ORM**, and **PostgreSQL**.

Built with a bespoke design identity featuring **Deep Royal Navy (`#00007B`)**, **Pure White (`#fff`)**, and vibrant **Jade Emerald (`#0F9A73`)** accents, fluid responsive layouts, accessible dialogs, and a secure **Admin Dashboard** allowing complete dynamic control over all portfolio content without editing code.

---

## 🌟 Key Features

### 🖥️ Public Portfolio Frontend
* **Hero Section:** High-impact introduction with profile portrait, real-time availability badge, professional title, location indicator, social links, and dual CTAs (*"View Featured Projects"* & *"Download Resume"*).
* **Live Tech Stack Bar:** Scrolling showcase of primary production technologies (React, Next.js, Node.js, TypeScript, PostgreSQL, Docker, AWS, Kubernetes).
* **Key Statistics:** Quantifiable impact counters (Years of Experience, Projects Delivered, Code Commits, Client Satisfaction).
* **About Section:** Narrative bio detailing engineering philosophy, clean code practices, and system design approach.
* **Interactive Skills Matrix:** Categorized technical competencies (Frontend, Backend, Database, Cloud & DevOps, Mobile, Architecture) with proficiency bars, category filtering, and featured badges.
* **Work Experience Timeline:** Chronological career journey highlighting roles, company logos, employment types (Full-Time, Contract, etc.), tech stacks, core responsibilities, and quantified achievements.
* **Featured Projects Showcase:** Filterable by domain (SaaS, Web Apps, Mobile, AI/ML, Cloud/API) with live demo links, source code repositories, and deep links to full case studies.
* **Comprehensive Project Detail Pages (`/projects/[slug]`):** SEO-optimized dedicated pages detailing the Problem Statement, Architecture & Solution, Key Features, Engineering Challenges & Solutions, Screenshots gallery, and Related Projects.
* **Services Offered (`/services` & `/services/[slug]`):** Client and freelance service catalog with feature breakdowns, technology pairings, and direct consultation CTA.
* **Recruiter & Career Opportunities (`/career`):** Dedicated section for hiring managers and talent partners highlighting active opportunities with **direct, official "Apply Now" links** (no fake application forms).
* **Education & Certifications:** Academic timeline (degrees, institutions, honors) and industry credentials (AWS, Google Cloud, CKA, Terraform) with verification URLs.
* **Professional Achievements:** Hackathons, patents, open-source recognitions, and client milestones.
* **Testimonials & Recommendations:** Social proof cards from engineering managers, CTOs, and peer engineers.
* **Resume / CV Hub (`/resume`):** In-browser resume viewer, version tracking, and instant PDF download.
* **Contact Section (`/contact`):** Validated interactive form with anti-spam honeypot, direct social channels, and PostgreSQL persistence.

### 🛡️ Secure Admin CMS Dashboard (`/admin`)
* **Role-Based Access Control:** Secure JWT authentication and session management.
* **Profile Management:** Update personal bio, titles, social channels, resume link, avatar, and contact info in real time.
* **Skills Management:** Create, edit, toggle visibility, and reorder skill rankings.
* **Experience & Education Management:** Full timeline editor with responsibilities, achievements, and institution details.
* **Project CMS:** Create rich project case studies with Markdown/full descriptions, challenges, solutions, and gallery images.
* **Career Opportunities Manager:** Publish open positions for recruiters with direct application URLs.
* **Services & Offerings Manager:** Edit custom deliverables, features, and technology tags.
* **Certifications & Achievements:** Manage credentials and awards with issuing organizations and verification links.
* **Testimonials Manager:** Curate client and colleague endorsements.
* **Message Center (`/admin/messages`):** Filter contact submissions, mark as read/unread, archive, and delete with confirmation dialogs.
* **Site Settings & SEO:** Manage site title, meta description, analytics IDs, keywords, and maintenance mode.
* **Asset Uploads:** Upload profile avatars, project screenshots, and PDF resumes directly to the server.

---

## 🏗️ Architecture & Technology Stack

```
fullstack-portfolio-platform/
├── backend/                  # Node.js + Express + TypeScript REST API
│   ├── prisma/               # Prisma Schema, Migrations & Database Seeder
│   ├── src/
│   │   ├── config/           # Database, Swagger, & Environment Config
│   │   ├── controllers/      # 13 REST Controllers (Auth, Projects, Skills, etc.)
│   │   ├── middleware/       # JWT Auth, Zod Validation, Rate Limiters, Multer
│   │   ├── routes/           # Express Route Definitions
│   │   ├── services/         # Dual-mode Database Service (Prisma + Memory fallback)
│   │   ├── utils/            # Initial Seed Data, JWT, ApiError & Response Helpers
│   │   ├── __tests__/        # Vitest Integration Test Suite (10 passing tests)
│   │   ├── app.ts            # Express App Configuration
│   │   └── server.ts         # HTTP Server Entry Point
│   └── Dockerfile            # Multi-stage production container
│
├── frontend/                 # Next.js 15 (App Router) + React 19 + TypeScript
│   ├── public/               # Static assets, robots.txt, sitemap.xml
│   ├── src/
│   │   ├── app/              # 31 App Router Pages & Layouts (Public + Admin)
│   │   │   ├── admin/        # 14 Admin Dashboard Management Pages
│   │   │   ├── projects/     # Project Gallery & [slug] Case Study Pages
│   │   │   ├── services/     # Service Catalog & [slug] Detail Pages
│   │   │   └── ...           # About, Skills, Career, Education, Contact, Resume
│   │   ├── components/
│   │   │   ├── home/         # 15 Homepage Section Components
│   │   │   ├── layout/       # Sticky Navbar, Footer, Admin Sidebar & Header
│   │   │   └── ui/           # Reusable Accessible Buttons, Modals, Cards, Badges
│   │   ├── lib/              # API Client (universal fetcher), Auth Token Storage
│   │   └── types/            # Strict TypeScript Interfaces
│   └── Dockerfile            # Multi-stage production container
│
├── docker-compose.yml        # Orchestration for PostgreSQL 16, Backend, and Frontend
└── README.md
```

| Layer | Technology | Key Capabilities |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15, React 19, TypeScript | App Router, Server Components & Client Boundaries, Dynamic Metadata |
| **Styling & UI** | Tailwind CSS, Lucide React | Navy/Cyan Palette, Dark/Light Themes, Mobile-First Responsiveness |
| **Backend API** | Node.js, Express, TypeScript | RESTful Architecture, Swagger OpenAPI 3.0, Zod Validation |
| **Authentication** | JWT & bcryptjs | Stateless token authentication, role validation (`ADMIN`) |
| **Database & ORM** | PostgreSQL 16, Prisma ORM | Normalized relational schema with dual-mode in-memory resilience |
| **Security** | Helmet, Express Rate Limit, Multer | Honeypot spam defense, brute-force mitigation, file MIME validation |
| **Containerization**| Docker & Docker Compose | Multi-stage slim images running under unprivileged system users |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** >= 18.x (Tested on Node v20 & v24)
* **npm** >= 9.x
* *(Optional)* **Docker & Docker Compose** for containerized execution.

---

### Option 1: Zero-Config Local Development

> **Dual-Mode Database Fallback:** The backend includes a built-in fallback layer. If a live PostgreSQL instance is detected, Prisma communicates directly with it. If PostgreSQL is not running, the backend seamlessly initializes an in-memory/JSON store populated with full developer profile data. You can start developing and testing immediately without configuring a database.

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd fullstack-portfolio-platform
   ```

2. **Start Backend Server:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   * The backend starts on `http://localhost:5000`.
   * Interactive Swagger API documentation: `http://localhost:5000/api-docs`.

3. **Start Frontend Application:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   * The portfolio opens on `http://localhost:3000`.
   * Access the Admin Dashboard at `http://localhost:3000/admin`.

---

### Option 2: Docker Compose (Full Stack with PostgreSQL)

To launch the complete isolated production environment with PostgreSQL 16:

```bash
# Build and run all services in detached mode
docker compose up --build -d

# Verify running containers
docker compose ps
```

* **Frontend:** `http://localhost:3000`
* **Backend REST API:** `http://localhost:5000`
* **Swagger API Docs:** `http://localhost:5000/api-docs`
* **PostgreSQL:** `localhost:5432`

To shut down the environment:
```bash
docker compose down
```

---

## 🔑 Default Admin Credentials

When the database is seeded or initialized in memory, the following admin user is automatically configured:

* **Email:** `admin@alexmorgan.dev`
* **Password:** `AdminPassword123!`
* **Admin Login Route:** `http://localhost:3000/admin/login`

*(You can modify these credentials or create additional administrators from the Admin Dashboard).*

---

## 🗄️ Database Migrations & Seeding (PostgreSQL)

When running against a PostgreSQL database:

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Apply Migrations
npx prisma migrate dev --name init

# Seed Realistic Initial Profile Data
npx ts-node prisma/seed.ts
```

---

## 🧪 Testing & Code Quality

The backend features an automated integration test suite powered by **Vitest** and **Supertest** covering:
- Public API endpoints and health checks
- JWT authentication and token validation
- Protected route authorization safeguards
- Contact form submission, input validation, and anti-spam honeypot defense

Run tests:
```bash
cd backend
npm test
```

Build verification (TypeScript compilation):
```bash
# Verify Backend
cd backend && npm run build

# Verify Frontend
cd frontend && npm run build
```

---

## 📖 API Documentation

Interactive OpenAPI 3.0 documentation is served natively at:
**`http://localhost:5000/api-docs`**

### Summary of REST Endpoints

| Category | Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| **Health** | `GET` | `/health` | Server uptime & status check | No |
| **Auth** | `POST` | `/api/auth/login` | Authenticate admin & receive JWT | No |
| **Auth** | `GET` | `/api/auth/me` | Fetch authenticated user details | Yes |
| **Profile** | `GET` | `/api/profile` | Retrieve public portfolio profile | No |
| **Profile** | `PUT` | `/api/profile` | Update profile information | Yes |
| **Skills** | `GET` | `/api/skills` | List all skills (supports `?category=`) | No |
| **Skills** | `POST` | `/api/skills` | Add new skill | Yes |
| **Skills** | `PUT` | `/api/skills/:id` | Update skill attributes | Yes |
| **Skills** | `DELETE`| `/api/skills/:id` | Remove skill | Yes |
| **Projects** | `GET` | `/api/projects` | List projects (supports `?category=`, `?featured=`) | No |
| **Projects** | `GET` | `/api/projects/:slug` | Retrieve single project case study | No |
| **Projects** | `POST` | `/api/projects` | Create new project | Yes |
| **Projects** | `PUT` | `/api/projects/:id` | Update project details | Yes |
| **Projects** | `DELETE`| `/api/projects/:id` | Delete project | Yes |
| **Experience**| `GET` | `/api/experience` | List career timeline | No |
| **Education** | `GET` | `/api/education` | List academic history | No |
| **Career** | `GET` | `/api/career` | List open positions & recruiter info | No |
| **Services** | `GET` | `/api/services` | List consulting services | No |
| **Contact** | `POST` | `/api/contact` | Submit contact form (with honeypot) | No |
| **Messages** | `GET` | `/api/contact/messages` | View incoming inquiries | Yes |
| **Messages** | `PATCH`| `/api/contact/messages/:id/read` | Mark message as read/unread | Yes |
| **Uploads** | `POST` | `/api/upload` | Upload avatar, screenshot, or PDF resume | Yes |

---

## 🔒 Security Best Practices Implemented

* **Strict Input Validation:** All API inputs are validated and sanitized via `Zod` schemas before controller processing.
* **Spam Prevention:** Contact form features an invisible honeypot trap (`website_url_check`) that silently rejects bots.
* **Rate Limiting:** IP-based rate limiting on sensitive routes (authentication login throttled to 5 attempts per 15 minutes; contact form limited to 5 submissions per hour).
* **HTTP Security Headers:** `Helmet` enabled with sensible Defaults for XSS, Clickjacking, and MIME-sniffing defense.
* **CORS Whitelisting:** Configurable origin restriction ensuring only authorized client origins can make state-changing requests.
* **Container Security:** Multi-stage Docker builds deploy runtime binaries as unprivileged `nodejs` and `nextjs` system users.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
