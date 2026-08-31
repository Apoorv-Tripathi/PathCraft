# PathCraft — Adaptive AI Career Roadmap Platform

> **HCL Amplified Hackathon Project**  
> An intelligent, diagnostic-driven learning platform that assesses technical skill gaps, generates prerequisite-aware career roadmaps, and dynamically adapts based on diagnostic quizzes and real-time performance.

---

## 🌟 Overview

PathCraft solves the problem of rigid, static online learning paths. Instead of one-size-fits-all curricula, PathCraft:
1. **Extracts Learning Goals**: Supports both natural language prompt parsing and structured wizard onboarding.
2. **Diagnoses Competency Gaps**: Calibrates user proficiency against target role benchmarks (e.g., Backend Developer, Frontend Developer, Fullstack Engineer, DevOps Specialist).
3. **Generates Prerequisite-Aware Roadmaps**: Sequences learning modules logically so learners master prerequisites before advanced concepts.
4. **Dynamically Adapts (Remedial Gap Injection)**: When a learner scores low on diagnostic quizzes, PathCraft auto-injects targeted remedial modules (e.g. Async JavaScript & Event Loop) into their active path before advanced topics.
5. **Context-Aware AI Coach**: Provides instant guidance, explanation of recommendations, and concept breakdowns tailored to the learner's active module.

---

## 🎨 Aesthetic & Design System

PathCraft features a **Tasklyn-inspired UI/UX** designed for modern educational clarity:
- **Clean Shell Architecture**: Outer app canvas with a smooth floating rounded container (`Plus Jakarta Sans` typography).
- **Pastel Focus Shells**: Soft focus cards for active priorities (Pastel Blue), diagnostic calibration (Pastel Purple), and capstone deliverables (Pastel Peach).
- **Concentric Multi-Ring Readiness Gauge**: Interactive SVG circular chart tracking *Overall Readiness*, *Quiz Calibration*, and *Path Completion*.
- **Weekly Study Tracker**: Stylized dual-pillar bar charts illustrating Focus Labs vs. Documentation & Quizzes.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM (v6)
- **Styling**: Custom CSS Design Tokens (`theme.css`) + Bootstrap 5 + Bootstrap Icons
- **State Management**: Centralized React Context (`AppContext.jsx`) with resilient offline fallback

### **Backend**
- **Runtime & Server**: Node.js + Express
- **Database**: MongoDB Atlas via Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing
- **Security & Validation**: CORS, `express-validator`

---

## 📁 Project Structure

```text
HCL Amplified/
├── Backend/
│   ├── config/             # DB connection config
│   ├── src/
│   │   ├── controllers/    # Auth, Profile, Skill, Assessment, Roadmap, AI controllers
│   │   ├── middleware/     # JWT Auth middleware
│   │   ├── models/         # Mongoose Schemas (User, Skill, RoadmapNode, Assessment, Goal)
│   │   ├── routes/         # Express API routes
│   │   └── server.js       # Main Express entry point
│   ├── seed.js             # Initial database seed script
│   └── package.json
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/            # Centralized API service client (`client.js`)
│   │   ├── components/     # Reusable UI components (Navbar, Sidebar, RoadmapNode, ReadinessGauge, etc.)
│   │   ├── context/        # AppContext for user state & roadmap hydration
│   │   ├── pages/          # App pages (Dashboard, Roadmap, Assessment, AI Assistant, Profile, Auth, Onboarding)
│   │   ├── styles/         # Custom Design Tokens & CSS (`theme.css`)
│   │   ├── App.jsx         # App router & protected routes
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore              # Monorepo root gitignore
└── README.md               # Documentation & Deployment Guide
```

---

## 🚀 Local Development Setup

### **Prerequisites**
- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas URI)
- Git

### **1. Clone & Setup Backend**
```bash
cd Backend
npm install

# Create a .env file inside Backend/
cat <<EOT > .env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pathcraft
JWT_SECRET=your_jwt_secret_key_here
EOT

# (Optional) Seed database with initial skill benchmarks & roadmaps
node seed.js

# Start backend server
npm run dev
```
*Backend server will run at `http://localhost:5000`.*

### **2. Setup Frontend**
```bash
cd ../Frontend
npm install

# (Optional) Set API Base URL environment variable
cat <<EOT > .env
VITE_API_BASE_URL=http://localhost:5000/api
EOT

# Start frontend dev server
npm run dev
```
*Frontend application will run at `http://localhost:5173`.*

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user account | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | ❌ |
| `GET` | `/api/user/profile` | Get current user profile | `Bearer Token` |
| `PUT` | `/api/user/profile` | Update goal, timeline, hours, interests | `Bearer Token` |
| `GET` | `/api/roadmap` | Get active personalized roadmap | `Bearer Token` |
| `POST` | `/api/roadmap/toggle-adaptive` | Toggle remedial gap injection mode | `Bearer Token` |
| `POST` | `/api/assessment/submit` | Submit diagnostic quiz answers & recalculate readiness | `Bearer Token` |
| `POST` | `/api/ai/coach` | Query context-aware Gemini AI Coach | `Bearer Token` |

---

## 🌐 Deployment Instructions

### **Step 1: Push Code to GitHub**

Run the following commands in the project root directory (`HCL Amplified/`):

```bash
# 1. Initialize git repository
git init

# 2. Stage all files (respecting .gitignore)
git add .

# 3. Commit changes
git commit -m "feat: PathCraft - Adaptive AI Learning & Career Platform with Tasklyn UI"

# 4. Set main branch and link your remote GitHub repository
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 5. Push to GitHub
git push -u origin main
```

---

### **Step 2: Deploy Backend to Render / Railway**

#### **Option A: Render (Recommended for Express)**
1. Sign up/log in at [Render.com](https://render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Set the build parameters:
   - **Root Directory**: `Backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
5. Add Environment Variables under **Environment**:
   - `MONGODB_URI` = `mongodb+srv://<user>:<password>@cluster.mongodb.net/pathcraft`
   - `JWT_SECRET` = `your_secure_jwt_secret`
6. Click **Create Web Service**. Note down your deployed API URL (e.g. `https://pathcraft-backend.onrender.com`).

---

### **Step 3: Deploy Frontend to Vercel / Netlify**

#### **Option A: Vercel (Recommended for Vite/React)**
1. Sign up/log in at [Vercel.com](https://vercel.com/).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. Configure Project:
   - **Root Directory**: Select `Frontend`.
   - **Framework Preset**: `Vite`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `VITE_API_BASE_URL` = `https://pathcraft-backend.onrender.com/api` (your deployed Render API URL)
6. Click **Deploy**. Vercel will build and provide a live URL (e.g., `https://pathcraft.vercel.app`).

---

## 🏆 Hackathon Highlights
- **Prerequisite-Aware Sequence**: Guarantees foundational topics (JS Core, Node.js) are mastered before advanced infrastructure (Docker, Microservices).
- **Automated Remedial Gap Injection**: Low scores on diagnostic quizzes automatically adapt the live roadmap without manual intervention.
- **Conversational Goal Parsing**: Converts free-form goals (e.g. *"I want to become a backend dev in 2 months studying 20 hours a week"*) into structured target configurations.
- **Resilient Fallback Design**: Fully functional offline fallback ensures smooth performance during dev and pitch demonstrations even under fluctuating network conditions.

---

## 📄 License
Created for the **HCL Amplified Hackathon**. All rights reserved.
