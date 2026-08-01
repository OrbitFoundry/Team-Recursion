# Placement Preparation Portal

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A full-stack **Placement Preparation Portal** built by **Team Recursion** with two user roles: **Student** and **Admin**.

### 👥 Team Recursion
- **Mallu** · **Bhumit** · **Ayush** · **Gaurav**

---

## ✨ Features

### Students
- 📊 **Personal Dashboard** — stat cards (applied, active, offers, rejected), success rate, status breakdown chart, recent applications
- 🏢 **Company Tracker** — full CRUD, search by company name, filter by status, sort by date (asc/desc), notes field
- 📚 **Resources** — add/view/delete preparation links (DSA, Aptitude, Resume, Interview Experience, Core Subjects)
- 🌙 **Dark Mode** — toggle stored in localStorage, applies globally

### Admins
- 📈 **Global Dashboard** — 4 global stat cards, bar chart + pie chart, top 5 companies, recent activity feed, resource moderation panel
- 🎓 **Students List** — all students with application count, offers, last activity; clickable to drill in
- 🏢 **All Applications** — cross-student company management with search, filter by status/student, edit status, delete
- 📚 **Resource Moderation** — view and remove any student's resources

### Security
- Passwords hashed with **bcrypt** (never stored plain)
- **JWT** with `userId`, `email`, `role` — stored in secure cookie
- **Role-based middleware**: `authenticate` + `adminOnly` on all `/api/admin/*` routes
- Students can only CRUD their **own** companies/resources (userId match enforced in DB query, not just frontend)
- Input validation on backend for all routes

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** — create `backend/.env`:

```bash
cd backend
copy env.example .env   # Windows
# cp env.example .env   # Mac/Linux
```

Required variables:

```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key-min-32-characters
FRONTEND_URL=http://localhost:3000
PORT=5000
```

**Frontend** — create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Create Admin Account (seed script)

> Admin signup is **not** publicly accessible. Use the seed script:

```bash
cd backend
npm run seed
```

This creates:
- **Admin**: `admin@placement.dev` / `Admin@12345`
- **Students**: `ayush@student.dev`, `bhumit@student.dev`, `gaurav@student.dev` — all with `Student@123`
- 10 sample company applications and 6 resources

### 4. Start Development

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

Visit **http://localhost:3000**

---

## 📁 Project Structure

```
├── frontend/
│   ├── app/
│   │   ├── dashboard/         # Student dashboard
│   │   ├── companies/         # Student application tracker
│   │   ├── resources/         # Student resources
│   │   ├── admin/
│   │   │   ├── dashboard/     # Admin global dashboard
│   │   │   ├── students/      # Students list + [id] detail
│   │   │   ├── companies/     # All applications management
│   │   │   └── resources/     # Resource moderation
│   │   ├── login/
│   │   ├── signup/
│   │   └── profile/
│   ├── components/
│   │   ├── AppLayout.tsx      # Shared sidebar/topbar + dark mode
│   │   └── ProtectedRoute.tsx # Auth + role-based route guard
│   ├── contexts/AuthContext.tsx
│   ├── lib/
│   │   ├── placement-api.ts   # All placement portal API calls
│   │   └── api-client.ts      # Axios base client
│   └── types/
│       ├── auth.ts
│       └── placement.ts       # Company, Resource, Dashboard types
│
└── backend/src/
    ├── models/
    │   ├── User.ts            # role: student | admin
    │   ├── Company.ts
    │   └── Resource.ts
    ├── routes/
    │   ├── auth.ts
    │   ├── companies.ts       # Student CRUD
    │   ├── resources.ts       # Student CRUD
    │   ├── dashboard.ts       # Student stats (aggregation)
    │   └── admin.ts           # All admin routes (aggregation)
    ├── middleware/
    │   └── auth.ts            # authenticate + adminOnly
    ├── services/authService.ts
    ├── validators/
    │   ├── companyValidator.ts
    │   └── resourceValidator.ts
    └── seeds/seed.ts          # Demo data + admin account
```

---

## 🔐 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Student self-registration |
| POST | `/api/auth/login` | Returns JWT with userId, email, role |
| GET | `/api/auth/me` | Current user profile |

### Student (JWT required)
| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/companies` | List/create own applications |
| PUT/DELETE | `/api/companies/:id` | Update/delete own application |
| GET/POST | `/api/resources` | List/create own resources |
| DELETE | `/api/resources/:id` | Delete own resource |
| GET | `/api/dashboard/stats` | Personal dashboard stats |

### Admin (JWT + admin role required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/students` | All students with counts |
| GET | `/api/admin/students/:id/companies` | One student's applications |
| GET | `/api/admin/companies` | All companies, all students |
| PUT/DELETE | `/api/admin/companies/:id` | Edit/delete any application |
| GET | `/api/admin/resources` | All resources |
| DELETE | `/api/admin/resources/:id` | Remove any resource |
| GET | `/api/admin/dashboard/stats` | Global aggregated stats |

---

## 📝 License

MIT License — see [LICENSE](LICENSE) file for details.
