# ⚡ AGENTS.md — Team Recursion Primary Agent Directives & Guidelines

> **CRITICAL MANDATE FOR ANTIGRAVITY & AI AGENTS:**
> This document is the primary system directive. Every agent invocation MUST follow these guidelines strictly without exception.

---

## 👥 Team Recursion Core Engineers
- **Mallu**
- **Bhumit**
- **Ayush**
- **Gaurav**

---

## 🚨 Mandatory Operational Workflow Rules

Every AI agent operating in this repository **MUST** execute the following sequence for every task/prompt:

### 1. 📥 Pre-Prompt Mandatory Git Synchronization
- **BEFORE writing code or starting any task**, pull the latest remote changes:
  ```bash
  git pull origin main
  ```
- Ensures all team members (**Mallu, Bhumit, Ayush, Gaurav**) work on synchronized, up-to-date code.

### 2. ✂️ Coding Posture (`ponytail`)
- Apply the `ponytail` skill mindset: skip speculative work (YAGNI), prefer standard libraries and native web platform features over third-party dependencies.
- Write minimal, clean, robust code without sacrificing security, validation, or error logging.

### 3. 🎨 Design System Adherence (`DESIGN.md`)
- **Monochrome Editorial Frame**: Pure black (`#000000`) ink and pure white (`#ffffff`) canvas for body typography, CTAs, navigation, and page framing.
- **Saturated Pastel Story Blocks**: Viewport-spanning section containers with rounded corners (`rounded-2xl` / `rounded-3xl`) utilizing signature pastel grounds:
  - 🟩 **Lime** (`#dceeb1`): Systems, FAQ, and form sections
  - 🟪 **Lilac** (`#c5b0f4`): Hero callouts and promo banners
  - 🟨 **Cream** (`#f4ecd6`): Soft warm showcase areas
  - 🟩 **Mint** (`#c8e6cd`): Interactive feature panels & status badges
  - 🟥 **Pink / Coral** (`#efd4d4` / `#f3c9b6`): Highlighting story narratives
  - 🟦 **Navy** (`#1f1d3d`): Deep indigo dark mode story panels
- **Pill Shape Standard**: All text CTAs use full pill radius (`rounded-full`), while icon buttons use circular framing.
- **Typography Hierarchy**: `Inter` for body/headings and `JetBrains Mono` uppercase tracking for eyebrows, metadata, badges, and captions.

### 4. 🧪 Mandatory Pre-Commit Compilation & Integrity Verification
- **BEFORE executing any git commit**, verify that the application compiles with ZERO TypeScript errors or broken imports:
  ```bash
  cd frontend && npm run build
  ```
- Ensure no build regressions or runtime breaks are introduced.

### 5. 🔄 Multi-Developer Auto-Commit & Immediate Push Pipeline
- After completing work, stage (`git add .`) and commit using **Conventional Commits**:
  - `feat:` for new features or capabilities
  - `fix:` for bug fixes or state remediations
  - `docs:` for documentation updates (`README.md`, `AGENTS.md`, `DESIGN.md`, etc.)
  - `refactor:` for code restructurings without behavior changes
  - `style:` for UI/CSS styling enhancements
  - `test:` for test additions or updates
  - `chore:` for build scripts, skill additions, or maintenance
- **Immediate Push**: Immediately push to remote tracking branch so all team members stay synced:
  ```bash
  git push origin main
  ```

---

## 🧩 Installed Agent Skills (`.agents/skills/`)

| Skill | Path | Description |
| :--- | :--- | :--- |
| **`documentation-writer`** | `.agents/skills/documentation-writer/` | Diátaxis Documentation Expert. Technical writer specializing in structured software documentation. |
| **`find-skills`** | `.agents/skills/find-skills/` | Registry search tool to discover, inspect, and install new skills via `npx skills find <query>`. |
| **`graphify`** | `.agents/skills/graphify/` | Turns code, docs, and relationships into a persistent knowledge graph for deep architecture analysis. |
| **`grill-me`** | `.agents/skills/grill-me/` | Relentless interview mode for pressure-testing system design and architecture plans before implementation. |
| **`improve-codebase-architecture`** | `.agents/skills/improve-codebase-architecture/` | Scans codebase for deepening opportunities, surfaces architectural friction, and generates visual HTML reports. |
| **`multi-stage-dockerfile`** | `.agents/skills/multi-stage-dockerfile/` | Creates optimized multi-stage Dockerfiles for Node.js backend and Next.js frontend microservices. |
| **`nodejs-backend-patterns`** | `.agents/skills/nodejs-backend-patterns/` | Production Node.js & Express API design, middleware patterns, error handling, rate limiting, and security best practices. |
| **`ponytail`** | `.agents/skills/ponytail/` | **Always-on coding posture.** Forces the simplest, leanest solution (YAGNI, standard library first, native platform features). |
| **`prisma-mongodb-upgrade`** | `.agents/skills/prisma-mongodb-upgrade/` | Migration and architectural decision guide for MongoDB databases and Prisma ORM configurations. |
| **`tailwind-design-system`** | `.agents/skills/tailwind-design-system/` | Design tokens, scalable component libraries, and responsive UI layout patterns using Tailwind CSS v4. |
| **`ui-ux-pro-max`** | `.agents/skills/ui-ux-pro-max/` | UI/UX design database with 84 visual styles, 192 color palettes, 74 font pairings, animations, and accessibility guidelines. |

---

## 🏗️ Architecture Quick Reference

- **Backend Architecture**: Express layer separation (`routes` ➔ `validators` ➔ `middleware` ➔ `services` ➔ `models`). Environment validation on boot (`src/utils/env-validator.ts`), in-memory MongoDB fallback (`src/config/database.ts`).
- **Frontend Architecture**: Next.js 16 App Router with React 19 client components, `AuthContext` for JWT cookie session management, dynamic user recovery, dark mode support.
