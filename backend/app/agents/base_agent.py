"""
Base agent class with shared LLM initialization and prompt helpers.
"""
import json
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from app.config import settings


class BaseAgent:
    """Base class for all AI agents."""

    def __init__(self, model: str = "gpt-3.5-turbo", temperature: float = 0.3):
        self.llm = ChatOpenAI(
            model=model,
            temperature=temperature,
            api_key=settings.OPENAI_API_KEY,  # type: ignore
        )

    def _call_llm(self, system_prompt: str, user_message: str) -> str:
        """Send a prompt to the LLM and return the raw response text."""
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}"),
        ])
        chain = prompt | self.llm
        response = chain.invoke({"input": user_message})
        return str(response.content)

    def _parse_json(self, text: str) -> dict:
        """Best-effort parse of JSON from LLM response."""
        import re
        
        # Try to extract JSON content between curly braces
        match = re.search(r'(\{.*\})', text, re.DOTALL)
        if match:
            cleaned = match.group(1)
        else:
            # Fallback to stripping markdown code fences
            cleaned = text.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.split("\n", 1)[-1]
                cleaned = cleaned.rsplit("```", 1)[0]
                cleaned = cleaned.strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # If parsing fails, return a wrapper with the raw text
            return {
                "error": "Failed to parse AI response as JSON",
                "raw_response": text
            }
