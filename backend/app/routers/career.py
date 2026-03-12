from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.utils.auth import get_current_user
from app.agents.career_agent import CareerAdvisorAgent

router = APIRouter(prefix="/api", tags=["career"])


@router.get("/career-roadmap")
def get_career_roadmap(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generate a career roadmap based on the user's resume."""
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.desc())
        .first()
    )
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found. Please upload one first.")

    try:
        agent = CareerAdvisorAgent()
        result = agent.recommend(str(resume.extracted_text))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Career roadmap generation failed: {str(e)}")
