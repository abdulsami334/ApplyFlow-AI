import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException

from app.analyzer import ResumeAnalyzer
from app.models import (
    DomainPredictionResponse,
    KeywordResponse,
    MatchRequest,
    MatchResponse,
    ResumeAnalysisRequest,
    ResumeAnalysisResponse,
    SkillExtractionResponse,
    SuggestionResponse,
    TextRequest,
)
from app.text_processing import clean_text, extract_skills

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

analyzer = ResumeAnalyzer(Path(__file__).resolve().parent.parent / "models")


@asynccontextmanager
async def lifespan(app: FastAPI):
    analyzer.load()
    yield


app = FastAPI(
    title="ApplyFlow AI Service",
    version="1.0.0",
    description="Resume parsing, ATS scoring, skill extraction, domain prediction, and keyword matching service.",
    lifespan=lifespan,
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "healthy"}


@app.post("/api/resume-analysis", response_model=ResumeAnalysisResponse)
def analyze_resume(request: ResumeAnalysisRequest) -> ResumeAnalysisResponse:
    try:
        return analyzer.analyze(
            resume_text=request.resume_text,
            job_description=request.job_description,
            file_content_base64=request.file_content_base64,
            content_type=request.content_type,
            file_name=request.file_name,
        )
    except Exception as exc:
        logger.exception("Resume analysis failed")
        raise HTTPException(status_code=500, detail="Resume analysis failed.") from exc


@app.post("/api/ats-score", response_model=ResumeAnalysisResponse)
def ats_score(request: ResumeAnalysisRequest) -> ResumeAnalysisResponse:
    return analyze_resume(request)


@app.post("/api/match", response_model=MatchResponse)
def match_resume(request: MatchRequest) -> MatchResponse:
    result = analyzer.match(request.resume_text, request.job_description)
    return MatchResponse(**result)


@app.post("/api/skills", response_model=SkillExtractionResponse)
def extract_resume_skills(request: TextRequest) -> SkillExtractionResponse:
    return SkillExtractionResponse(skills=extract_skills(clean_text(request.text)))


@app.post("/api/domain", response_model=DomainPredictionResponse)
def predict_domain(request: TextRequest) -> DomainPredictionResponse:
    try:
        return DomainPredictionResponse(domain=analyzer.predict_domain(request.text))
    except Exception as exc:
        logger.exception("Domain prediction failed")
        raise HTTPException(status_code=500, detail="Domain prediction failed.") from exc


@app.post("/api/keywords", response_model=KeywordResponse)
def extract_keywords(request: TextRequest) -> KeywordResponse:
    return KeywordResponse(keywords=analyzer.keywords(request.text))


@app.post("/api/suggestions", response_model=SuggestionResponse)
def suggestions(request: ResumeAnalysisRequest) -> SuggestionResponse:
    analysis = analyze_resume(request)
    return SuggestionResponse(suggestions=analysis.suggestions, feedback=analysis.feedback)
