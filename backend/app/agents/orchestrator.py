"""
Multi-agent orchestrator — chains agents for the full analysis pipeline.
"""
from app.agents.resume_agent import ResumeAnalysisAgent
from app.agents.skill_gap_agent import SkillGapAgent
from app.agents.career_agent import CareerAdvisorAgent
from app.agents.interview_agent import MockInterviewAgent


class AgentOrchestrator:
    """Coordinates multiple AI agents in a pipeline."""

    def __init__(self):
        self.resume_agent = ResumeAnalysisAgent()
        self.skill_gap_agent = SkillGapAgent()
        self.career_agent = CareerAdvisorAgent()
        self.interview_agent = MockInterviewAgent()

    def full_analysis(self, resume_text: str, target_role: str = "Software Engineer") -> dict:
        """
        Run the full multi-agent pipeline:
        1. Resume Analysis → 2. Skill Gap Detection → 3. Career Roadmap
        """
        # Step 1: Analyze resume
        resume_analysis = self.resume_agent.analyze(resume_text)

        # Step 2: Detect skill gaps
        detected_skills = resume_analysis.get("detected_skills", [])
        skill_gap = self.skill_gap_agent.detect_gaps(detected_skills, target_role)

        # Step 3: Career recommendations
        career_roadmap = self.career_agent.recommend(resume_text)

        return {
            "resume_analysis": resume_analysis,
            "skill_gap": skill_gap,
            "career_roadmap": career_roadmap,
        }
