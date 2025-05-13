# AI-Cruiter – AI-Powered Interview Automation Platform

[![Next.js](https://img.shields.io/badge/Built%20with-Next.js-000?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-38b2ac?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3fcf8e?logo=supabase)](https://supabase.com/)
[![VAPI.ai](https://img.shields.io/badge/Voice-AI%20Calls-yellowgreen)](https://vapi.ai/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Overview

**AI-Cruiter** is a full-fledged AI-powered SaaS platform that automates every step of the technical hiring process:

- AI-Generated Interview Questions
- Real-time AI Voice Interviews via VAPI.ai
- Automated Candidate Scoring, Feedback & Recommendations
- Role-based Dashboard for Recruiters and Admins
- Credit-based Billing System

> Built with ❤️ using Next.js, Supabase, TailwindCSS, and GPT-4

---

## 🖥️ Demo

**Live Project:** Not Deployed Yet

---

## 📸 Screenshots

| Dashboard | AI Interview | Feedback |
|----------|--------------|----------|
| ![Dashboard](https://via.placeholder.com/300x180?text=Dashboard) | ![AI Interview](https://via.placeholder.com/300x180?text=Interview) | ![Feedback](https://via.placeholder.com/300x180?text=Feedback) |

---

## ⚙️ Features

- **Google OAuth2** Login for Recruiters
- **AI Question Generation** using OpenAI GPT-3.5 / GPT-4
- **Voice-based Interview** over Web via VAPI.ai
- **Automated Feedback** including skills ratings, summary, and hire recommendation
- **Admin Panel** for API Keys and Settings
- **Billing System** with Credit Usage and Top-ups

---

## 🧠 Tech Stack

| Layer         | Technology                               |
|--------------|-------------------------------------------|
| Frontend     | Next.js, React, TailwindCSS, ShadCN UI    |
| Backend      | Supabase (Postgres, Auth)                 |
| AI           | OpenAI GPT-4 for Q&A and feedback         |
| Voice        | VAPI.ai – Voice API for Interviews        |
| Notifications| Sonner (toast)                            |

---

## 🔧 Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/ai-cruiter.git

# 2. Navigate to project directory
cd ai-cruiter

# 3. Install dependencies
npm install

# 4. Create .env.local and configure the following:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_OPENAI_API_KEY=
NEXT_PUBLIC_VAPI_API_KEY=
NEXT_PUBLIC_HOST_URL=http://localhost:3000

# 5. Start the development server
npm run dev
