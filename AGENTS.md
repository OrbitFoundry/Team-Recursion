# AGENTS.md — Team Recursion Agent Guidelines & Capabilities

Welcome to **Team Recursion**. This document details the AI agent workflow, installed agent skills, design tokens, and operational guidelines for building and maintaining our production-ready authentication and web platform.

---

## 👥 Team Recursion
- **Mallu**
- **Bhumit**
- **Ayush**
- **Gaurav**

---

## 🧩 Installed Agent Skills (`.agents/skills/`)

The following skills are installed in the workspace to extend AI agent capabilities:

| Skill | Path | Description |
| :--- | :--- | :--- |
| **`ponytail`** | `.agents/skills/ponytail/` | **Always-on coding posture.** Forces the simplest, leanest solution (YAGNI, standard library first, native platform features, zero unnecessary bloat). |
| **`graphify`** | `.agents/skills/graphify/` | Turns code, docs, and relationships into a persistent knowledge graph for deep architecture analysis and dependency tracing. |
| **`nodejs-backend-patterns`** | `.agents/skills/nodejs-backend-patterns/` | Production Node.js & Express API design, middleware patterns, error handling, rate limiting, and security best practices. |
| **`tailwind-design-system`** | `.agents/skills/tailwind-design-system/` | Design tokens, scalable component libraries, and responsive UI layout patterns using Tailwind CSS v4. |
| **`ui-ux-pro-max`** | `.agents/skills/ui-ux-pro-max/` | UI/UX design database with 84 visual styles, 192 color palettes, 74 font pairings, animations, and accessibility guidelines. |
| **`multi-stage-dockerfile`** | `.agents/skills/multi-stage-dockerfile/` | Creates optimized multi-stage Dockerfiles for Node.js backend and Next.js frontend microservices. |
| **`prisma-mongodb-upgrade`** | `.agents/skills/prisma-mongodb-upgrade/` | Migration and architectural decision guide for MongoDB databases and Prisma ORM configurations. |
| **`grill-me`** | `.agents/skills/grill-me/` | Relentless interview mode for pressure-testing system design and architecture plans before implementation. |
| **`find-skills`** | `.agents/skills/find-skills/` | Registry search tool to discover, inspect, and install new skills via `npx skills find <query>`. |

---

## 🎨 Design System & Specification (`DESIGN.md`)

Our visual identity and UI design tokens are documented in **[`DESIGN.md`](./DESIGN.md)**.

### Core Visual Philosophy
- **Monochrome Editorial Frame**: Pure black (`#000000`) ink and pure white (`#ffffff`) canvas carry body typography, CTAs, navigation, and page framing.
- **Saturated Pastel Story Blocks**: Viewport-spanning section containers with rounded corners (`rounded-2xl` / 24px) utilizing signature pastel grounds:
  - 🟩 **Lime** (`#dceeb1`): Systems, FAQ, and form sections
  - 🟪 **Lilac** (`#c5b0f4`): Hero callouts and promo banners
  - 🟨 **Cream** (`#f4ecd6`): Soft warm showcase areas
  - 🟩 **Mint** (`#c8e6cd`): Interactive feature panels
  - 🟥 **Pink / Coral** (`#efd4d4` / `#f3c9b6`): Highlighting story narratives
  - 🟦 **Navy** (`#1f1d3d`): Deep indigo dark mode story panels
- **Pill Shape Standard**: All text CTAs use full pill radius (`rounded-full` / 50px), while icon buttons use circular framing.
- **Typography Hierarchy**: `figmaSans` variable family with tight negative letter-spacing for headlines and `figmaMono` / `JetBrains Mono` uppercase tracking for eyebrows and captions.

---

## ⚡ Workflow & Best Practices for Agents

1. **Coding Posture (`ponytail`)**:
   - Skip speculative abstractions (YAGNI).
   - Prefer native Node.js / Web APIs over adding third-party dependencies.
   - Ship minimal, clean code without removing trust-boundary validations or error logging.

2. **Backend Architecture**:
   - Maintain strict layer separation in Express: `routes` ➔ `validators` ➔ `middleware` ➔ `services` ➔ `models`.
   - Keep environment variables validated on boot (`src/utils/env-validator.ts`).
   - Retain automated in-memory MongoDB fallback in development mode (`src/config/database.ts`).

3. **Frontend Architecture**:
   - Next.js 16 App Router with React 19 client components where interaction is needed.
   - Use `AuthContext` for stateless JWT cookie session management and dynamic user recovery.
   - Keep visual components atomic and styled per the tokens in `DESIGN.md`.

4. **Git & Commit Hygiene**:
   - Never commit sensitive `.env` files or credentials (checked against `.gitignore`).
   - Provide clean `.env.example` templates for both `backend/` and `frontend/`.
