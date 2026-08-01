# Team Recursion - Production Authentication System

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A production-ready, full-stack authentication system built by **Team Recursion**.

### 👥 Team Recursion
- **Mallu**
- **Bhumit**
- **Ayush**
- **Gaurav**

---

## ✨ Features

### Authentication & Authorization
- ✅ User Registration with client-side & server-side validation
- ✅ User Login with stateless JWT bearer tokens
- ✅ User Profile Management (`PUT /api/auth/me`) with real-time UI synchronization
- ✅ Password Reset flow via secure email link
- ✅ Google OAuth integration
- ✅ Protected Routes with dynamic session recovery (`AuthContext`)
- ✅ Zero-Config Local Staging with automatic in-memory MongoDB fallback
- ✅ Toast Notifications & Password Strength Indicator
- ✅ Express Security Headers (Helmet) & Rate Limiting

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

**Backend** - Setup environment variables:

**Option 1 - Automated setup (Recommended):**
```bash
cd backend
npm run setup:env
# Then edit the created .env file with your values
```

**Option 2 - Manual setup:**
Create `backend/.env` file from `backend/env.example`:
```bash
cd backend
cp env.example .env  # On Windows: copy env.example .env
# Then edit .env with your values
```

**Required environment variables:**
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key-min-32-characters  # Generate: openssl rand -base64 32
FRONTEND_URL=http://localhost:3000
PORT=5000
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Start Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
├── frontend/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # Landing page
│   │   ├── login/        # Login page
│   │   ├── signup/       # Signup page
│   │   ├── home/         # Protected home
│   │   ├── profile/      # User profile
│   │   └── auth/         # OAuth callback
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts
│   ├── lib/              # Utilities & API
│   └── types/            # TypeScript types
│
└── backend/
    └── src/
        ├── models/       # Database models
        ├── routes/       # API routes
        ├── services/     # Business logic
        ├── middleware/   # Express middleware
        ├── config/       # Configuration
        └── validators/   # Input validation
```

## 📚 Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Complete setup instructions
- **[Auth Setup](docs/AUTH_SETUP.md)** - Authentication configuration

## 🔐 API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/auth/google` - Google OAuth

## 🎯 Application Flow

1. **Landing Page** (`/`) → Marketing/hero page
2. **Login/Signup** (`/login`, `/signup`) → Authentication
3. **Home** (`/home`) → Protected dashboard
4. **Profile** (`/profile`) → User settings

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.
