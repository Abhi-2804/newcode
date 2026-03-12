from pydantic import BaseModel


class InterviewRequest(BaseModel):
    job_role: str
    num_questions: int = 5


class InterviewQuestion(BaseModel):
    question: str
    category: str = ""


class AnswerEvaluation(BaseModel):
    question: str
    answer: str
    communication_score: int = 0
    confidence_score: int = 0
    accuracy_score: int = 0
    feedback: str = ""
    suggestions: list[str] = []


class EvaluateRequest(BaseModel):
    job_role: str
    question: str
    answer: str
