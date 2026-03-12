import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from app.config import settings


class BaseAgent:
    """Base class for all AI agents."""

    def __init__(self, temperature: float = 0.3):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=temperature,
            google_api_key=settings.GEMINI_API_KEY,
        )

    def _call_llm(self, system_prompt: str, user_message: str) -> str:
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}")
        ])

        chain = prompt | self.llm
        response = chain.invoke({"input": user_message})
        return str(response.content)

    def _parse_json(self, text: str) -> dict:
        import re

        match = re.search(r'(\{.*\})', text, re.DOTALL)
        if match:
            cleaned = match.group(1)
        else:
            cleaned = text.strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            return {
                "error": "Failed to parse AI response as JSON",
                "raw_response": text
            }