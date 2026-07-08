from pydantic import BaseModel, Field


class TextRequest(BaseModel):
    text: str = Field(default="", max_length=200_000)


class MatchRequest(BaseModel):
    resume_text: str = Field(default="", max_length=200_000)
    job_description: str = Field(default="", max_length=200_000)


class ResumeAnalysisRequest(BaseModel):
    resume_text: str | None = Field(default=None, max_length=200_000)
    job_description: str = Field(default="", max_length=200_000)
    file_name: str | None = Field(default=None, max_length=255)
    content_type: str | None = Field(default=None, max_length=255)
    file_content_base64: str | None = None


class SkillExtractionResponse(BaseModel):
    skills: list[str]


class DomainPredictionResponse(BaseModel):
    domain: str


class KeywordResponse(BaseModel):
    keywords: list[str]


class MatchResponse(BaseModel):
    similarity_percent: float
    matched_keywords: list[str]
    missing_keywords: list[str]
    resume_keywords: list[str]
    job_description_keywords: list[str]


class SuggestionResponse(BaseModel):
    suggestions: list[str]
    feedback: str


class ResumeAnalysisResponse(BaseModel):
    success: bool
    resume_text: str
    resume_domain: str
    job_description_domain: str
    similarity_percent: float
    skill_score: int
    domain_score: int
    ats_score: int
    resume_skills: list[str]
    job_description_skills: list[str]
    matched_skills: list[str]
    missing_skills: list[str]
    resume_keywords: list[str]
    job_description_keywords: list[str]
    suggestions: list[str]
    feedback: str
    warnings: list[str] = []
