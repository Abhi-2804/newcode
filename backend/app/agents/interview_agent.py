"""Mock Interview Agent — generates questions and evaluates answers."""
from typing import Dict, Any
from app.agents.base_agent import BaseAgent

QUESTION_PROMPT = """You are a mock interview AI agent.
Generate {num_questions} interview questions for the role: {job_role}.
Return a JSON object with key "questions" containing a list of objects,
each with "question" and "category" (e.g., "technical", "behavioral", "situational").

Return ONLY valid JSON, no extra text."""

EVALUATION_PROMPT = """You are an interview evaluation AI agent.
Evaluate the candidate's answer to an interview question for the role: {job_role}.

Question: {question}
Answer: {answer}

Return a JSON object with these keys:
- "communication_score": integer 1-10
- "confidence_score": integer 1-10
- "accuracy_score": integer 1-10
- "feedback": brief overall feedback string
- "suggestions": list of improvement suggestions

Return ONLY valid JSON, no extra text."""


class MockInterviewAgent(BaseAgent):
    def generate_questions(self, job_role: str, num_questions: int = 5) -> Dict[str, Any]:
        """Generate interview questions for a specific job role."""
        prompt = QUESTION_PROMPT.format(job_role=job_role, num_questions=num_questions)
        response = self._call_llm(prompt, f"Generate questions for {job_role}")
        return self._parse_json(response)

    def evaluate_answer(self, job_role: str, question: str, answer: str) -> Dict[str, Any]:
        """Evaluate a candidate's answer and return scores + feedback."""
        prompt = EVALUATION_PROMPT.format(job_role=job_role, question=question, answer=answer)
        response = self._call_llm(prompt, f"Evaluate: Q: {question}\nA: {answer}")
        return self._parse_json(response)
