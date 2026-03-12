from fastapi import APIRouter, Depends, HTTPException
from app.models.user import User
from app.utils.auth import get_current_user
from app.schemas.interview import InterviewRequest, EvaluateRequest
from app.agents.interview_agent import MockInterviewAgent

router = APIRouter(prefix="/api", tags=["interview"])


@router.post("/generate-interview")
def generate_interview(
    req: InterviewRequest,
    current_user: User = Depends(get_current_user),
):
    """Generate mock interview questions for a job role."""
    try:
        agent = MockInterviewAgent()
        return agent.generate_questions(req.job_role, req.num_questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate questions: {str(e)}")


@router.post("/evaluate-answer")
def evaluate_answer(
    req: EvaluateRequest,
    current_user: User = Depends(get_current_user),
):
    """Evaluate a candidate's interview answer."""
    try:
        agent = MockInterviewAgent()
        return agent.evaluate_answer(req.job_role, req.question, req.answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to evaluate answer: {str(e)}")
