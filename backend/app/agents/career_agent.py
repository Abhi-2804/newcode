"""Career Path Recommendation Agent — suggests career paths and upskilling roadmaps."""
from typing import Dict, Any
from app.agents.base_agent import BaseAgent

SYSTEM_PROMPT = """You are a senior career advisor AI agent.
Given the user's resume data, suggest high-potential career paths and a detailed upskilling roadmap.
Return a JSON object with exactly these keys:
- "current_profile": a concise professional profile of the candidate
- "recommended_paths": list of 2-3 objects with "role", "description" (how their current skills fit), and "match_score" (1-100)
- "upskilling_plan": list of 4-6 objects with "skill", "resource" (specific course or site), and "priority" ("High", "Medium", "Low")
- "transferable_skills": list of core skills that will serve them well in any of the recommended paths

IMPORTANT: Return ONLY valid JSON. Do not include markdown code fences."""


class CareerAdvisorAgent(BaseAgent):
    def recommend(self, resume_text: str) -> Dict[str, Any]:
        """Generate career recommendations based on resume data."""
        response = self._call_llm(SYSTEM_PROMPT, f"Resume:\n\n{resume_text}")
        return self._parse_json(response)
