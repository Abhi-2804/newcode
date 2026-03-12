from pydantic import BaseModel


class ResumeAnalysis(BaseModel):
    detected_skills: list[str] = []
    missing_skills: list[str] = []
    experience_summary: str = ""
    recommended_skills: list[str] = []
    learning_resources: list[str] = []


class SkillGapReport(BaseModel):
    target_role: str = ""
    current_skills: list[str] = []
    missing_skills: list[str] = []
    recommendations: list[str] = []


class CareerRoadmap(BaseModel):
    current_profile: str = ""
    recommended_paths: list[dict] = []
    upskilling_plan: list[dict] = []
    transferable_skills: list[str] = []
