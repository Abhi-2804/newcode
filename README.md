# VidyaMitra — AI-Powered Learning & Career Guidance Platform

An agentic AI web application that analyzes resumes, detects skill gaps, simulates mock interviews, and generates personalized career roadmaps.

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React.js (Vite)                     |
| Backend   | Python FastAPI                      |
| AI/LLM    | LangChain + **Google Gemini 2.5 Flash** |
| Database  | SQLite (SQLAlchemy ORM)             |
| Auth      | JWT (python-jose + passlib/bcrypt)  |

## Project Structure

```
vidyam/
├── backend/
│   ├── app/
│   │   ├── agents/          # AI agents using Gemini 2.5 Flash
│   │   ├── models/          # SQLAlchemy models
│   │   ├── routers/         # FastAPI route handlers
│   │   ├── schemas/         # Pydantic request/response models
│   │   ├── utils/           # Auth, file parsing utilities
│   │   ├── config.py        # App settings
│   │   ├── database.py      # DB engine & session
│   │   └── main.py          # FastAPI entry point
│   ├── .env                 # Environment variables
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, ProtectedRoute
│   │   ├── pages/           # Login, Signup, Dashboard, Resume, Interview, Career
│   │   ├── services/        # Axios API client
│   │   ├── App.jsx          # Router setup
│   │   └── index.css        # Design system
│   └── package.json
└── docker-compose.yml
```

## Quick Start

### 1. Backend

```bash
cd backend
pip install -r requirements.txt

# Set your Gemini API key in .env
# GEMINI_API_KEY=AIzaSy...

uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at: http://localhost:5173

### 3. Docker (Optional)

```bash
# Ensure Docker Desktop is running
docker-compose up --build
```

## Environment Variables

Create `backend/.env`:

```env
DATABASE_URL=sqlite:///./vidyamitra.db
GEMINI_API_KEY=your-gemini-api-key
JWT_SECRET_KEY=your-secret-key-for-jwt
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=1440
```

> [!IMPORTANT]
> **JWT Fix**: The application has been updated to ensure the `sub` (subject) claim in JWT tokens is always a string, resolving potential "Subject must be a string" errors during authentication.

## AI Agents

| Agent                  | Purpose                                     |
|------------------------|---------------------------------------------|
| ResumeAnalysisAgent    | Extracts skills, experience, recommendations |
| SkillGapAgent          | Compares skills vs industry standards        |
| MockInterviewAgent     | Generates questions, evaluates answers       |
| CareerAdvisorAgent     | Suggests career paths + upskilling roadmap   |
| AgentOrchestrator      | Chains agents in a multi-agent pipeline      |

## API Endpoints

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| POST   | /api/signup           | Create new account       |
| POST   | /api/login            | Login & get JWT token    |
| POST   | /api/upload-resume    | Upload resume (PDF/DOCX) |
| POST   | /api/analyze-resume   | AI resume analysis       |
| POST   | /api/full-analysis    | Full multi-agent pipeline|
| POST   | /api/skill-gap        | Detect skill gaps        |
| POST   | /api/generate-interview | Generate interview Qs  |
| POST   | /api/evaluate-answer  | Evaluate interview answer|
| GET    | /api/career-roadmap   | Get career recommendations|
