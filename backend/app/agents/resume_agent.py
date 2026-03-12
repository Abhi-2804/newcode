"""Resume Analysis Agent — extracts skills, experience, and recommendations."""
from typing import Dict, Any
from .base_agent import BaseAgent

SYSTEM_PROMPT = """You are a professional resume analyst AI agent. 
Analyze the given resume text and return a JSON object with exactly these keys:
- "detected_skills": list of specific technical and soft skills found
- "missing_skills": list of 5-7 important in-demand skills relevant to the user's field but NOT in the resume
- "experience_summary": a 2-3 sentence professional summary of their work history  
- "recommended_skills": 3-5 high-impact skills the candidate should prioritize learning
- "learning_resources": list of specific platforms (e.g., Coursera, Udemy) or certifications

IMPORTANT: Return ONLY valid JSON. Ensure all fields are populated. Do not include markdown code fences."""


class ResumeAnalysisAgent(BaseAgent):
    def analyze(self, resume_text: str) -> Dict[str, Any]:
        """Analyze resume text and return structured insights."""
        response = self._call_llm(SYSTEM_PROMPT, f"Analyze this resume:\n\n{resume_text}")
        return self._parse_json(response)
