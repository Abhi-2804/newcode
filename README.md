# VidyaMitra — AI-Powered Learning & Career Guidance Platform

An agentic AI web application that analyzes resumes, detects skill gaps, simulates mock interviews, and generates personalized career roadmaps.

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React.js (Vite)                     |
| Backend   | Python FastAPI                      |
| AI/LLM    | LangChain + OpenAI API              |
| Database  | SQLite (SQLAlchemy ORM)             |
| Auth      | JWT (python-jose + passlib/bcrypt)  |

## Project Structure

```
vidyam/
├── backend/
│   ├── app/
│   │   ├── agents/          # AI agents (resume, skill gap, interview, career)
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

# Set your OpenAI API key in .env
# OPENAI_API_KEY=sk-your-key-here

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
docker-compose up --build
```

## Environment Variables

Create `backend/.env`:

```env
DATABASE_URL=sqlite:///./vidyamitra.db
OPENAI_API_KEY=sk-your-key-here
JWT_SECRET_KEY=your-secret-key
```

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
