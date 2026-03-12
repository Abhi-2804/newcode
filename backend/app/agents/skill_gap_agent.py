"""Skill Gap Detection Agent — compares user skills with industry needs."""
from typing import Dict, Any
from app.agents.base_agent import BaseAgent

SYSTEM_PROMPT = """You are a specialized skill gap detection AI agent.
Given a list of user skills and a target job role, perform a critical gap analysis.
Return a JSON object with exactly these keys:
- "target_role": the specific job role
- "current_skills": list of relevant skills the user already possesses
- "missing_skills": prioritized list of technical skills and tools required for this role but missing from the user's profile
- "recommendations": action-oriented advice on how to bridge these gaps (e.g., "Build a project using X", "Get certified in Y")

IMPORTANT: Return ONLY valid JSON. Do not include markdown code fences."""


class SkillGapAgent(BaseAgent):
    def detect_gaps(self, skills: list[str], target_role: str) -> Dict[str, Any]:
        """Compare user skills against industry standards for the target role."""
        user_msg = f"User skills: {', '.join(skills)}\nTarget role: {target_role}"
        response = self._call_llm(SYSTEM_PROMPT, user_msg)
        return self._parse_json(response)
