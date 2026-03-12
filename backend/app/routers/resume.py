import json
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.utils.auth import get_current_user
from app.utils.file_parser import extract_text
from app.agents.resume_agent import ResumeAnalysisAgent
from app.agents.skill_gap_agent import SkillGapAgent
from app.agents.orchestrator import AgentOrchestrator

router = APIRouter(prefix="/api", tags=["resume"])

ALLOWED_EXTENSIONS = {"pdf", "docx", "doc"}


@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload a resume file (PDF/DOCX) and extract its text."""
    filename = file.filename or ""
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are allowed")

    file_bytes = await file.read()
    try:
        extracted_text = extract_text(filename, file_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract text: {str(e)}")

    resume = Resume(
        user_id=current_user.id,
        filename=filename,
        extracted_text=extracted_text,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "id": resume.id,
        "filename": resume.filename,
        "extracted_text": extracted_text[:500],  # Preview
        "message": "Resume uploaded successfully",
    }


@router.post("/analyze-resume")
def analyze_resume(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Run AI analysis on the user's latest resume."""
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.desc())
        .first()
    )
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found. Please upload one first.")

    try:
        agent = ResumeAnalysisAgent()
        analysis = agent.analyze(str(resume.extracted_text))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    # Save analysis to DB
    resume.analysis_json = json.dumps(analysis)  # type: ignore
    db.commit()

    return analysis


@router.post("/full-analysis")
def full_analysis(
    target_role: str = "Software Engineer",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Run the full multi-agent pipeline on the user's resume."""
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.desc())
        .first()
    )
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found. Please upload one first.")

    try:
        orchestrator = AgentOrchestrator()
        result = orchestrator.full_analysis(str(resume.extracted_text), target_role)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis pipeline failed: {str(e)}")

    resume.analysis_json = json.dumps(result.get("resume_analysis", {}))  # type: ignore
    db.commit()

    return result


@router.post("/skill-gap")
def detect_skill_gap(
    target_role: str = "Software Engineer",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Detect skill gaps based on latest resume analysis."""
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.desc())
        .first()
    )
    if not resume or not str(resume.analysis_json):
        raise HTTPException(status_code=404, detail="No resume analysis found. Run analysis first.")

    try:
        analysis = json.loads(str(resume.analysis_json))
        skills = analysis.get("detected_skills", [])
        agent = SkillGapAgent()
        return agent.detect_gaps(skills, target_role)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skill gap detection failed: {str(e)}")
