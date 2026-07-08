import logging
from pathlib import Path

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.models import ResumeAnalysisResponse
from app.text_processing import clean_text, extract_skills, normalize_terms, parse_resume_file

logger = logging.getLogger(__name__)


class ResumeAnalyzer:
    def __init__(self, model_dir: Path) -> None:
        self.model_dir = model_dir
        self.model = None
        self.vectorizer = None

    def load(self) -> None:
        model_path = self.model_dir / "resume_model.pkl"
        vectorizer_path = self.model_dir / "resume_vectorizer.pkl"

        logger.info("Loading resume domain model from %s", model_path)
        self.model = joblib.load(model_path)
        logger.info("Loading resume vectorizer from %s", vectorizer_path)
        self.vectorizer = joblib.load(vectorizer_path)

    def predict_domain(self, text: str) -> str:
        cleaned = clean_text(text)
        if not cleaned:
            return "Unknown"

        if self.model is None or self.vectorizer is None:
            raise RuntimeError("Model artifacts are not loaded.")

        features = self.vectorizer.transform([cleaned])
        prediction = self.model.predict(features)[0]
        return str(prediction)

    def keywords(self, text: str, max_features: int = 15) -> list[str]:
        cleaned = clean_text(text)
        if not cleaned:
            return []

        vectorizer = TfidfVectorizer(stop_words="english", max_features=max_features)
        vectorizer.fit_transform([cleaned])
        return normalize_terms(vectorizer.get_feature_names_out())

    def similarity_percent(self, resume_text: str, job_description: str) -> float:
        cleaned_resume = clean_text(resume_text)
        cleaned_job = clean_text(job_description)
        if not cleaned_resume or not cleaned_job:
            return 0.0

        vectorizer = TfidfVectorizer(stop_words="english")
        vectors = vectorizer.fit_transform([cleaned_resume, cleaned_job])
        score = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
        return round(float(score) * 100, 2)

    def match(self, resume_text: str, job_description: str) -> dict:
        resume_keywords = self.keywords(resume_text)
        job_keywords = self.keywords(job_description)
        resume_keyword_set = set(resume_keywords)

        matched = [keyword for keyword in job_keywords if keyword in resume_keyword_set]
        missing = [keyword for keyword in job_keywords if keyword not in resume_keyword_set]

        return {
            "similarity_percent": self.similarity_percent(resume_text, job_description),
            "matched_keywords": matched,
            "missing_keywords": missing,
            "resume_keywords": resume_keywords,
            "job_description_keywords": job_keywords,
        }

    def suggestions(self, ats_score: int, resume_domain: str, job_domain: str, missing_skills: list[str]) -> tuple[list[str], str]:
        suggestions: list[str] = []

        if missing_skills:
            suggestions.extend(
                f"Add credible evidence for '{skill}' if it matches your real experience."
                for skill in missing_skills[:6]
            )

        if resume_domain != "Unknown" and job_domain != "Unknown" and resume_domain != job_domain:
            suggestions.append(
                f"Reframe summary and project bullets toward the {job_domain} domain."
            )

        if ats_score < 60:
            suggestions.append("Use clearer role-specific keywords from the job description.")
            suggestions.append("Add measurable impact statements under relevant experience.")

        if not suggestions:
            suggestions.append("The resume already covers the strongest detected job keywords.")

        feedback = (
            "This resume shows strong alignment with the job description."
            if ats_score >= 80
            else "This resume has reasonable alignment, but targeted keyword and domain improvements would help."
            if ats_score >= 60
            else "This resume has weak ATS alignment and should be tailored more closely to the job description."
        )

        if resume_domain == job_domain and resume_domain != "Unknown":
            feedback += f" The predicted domain matches the target role: {job_domain}."
        elif job_domain != "Unknown":
            feedback += f" The job description appears aligned with {job_domain}; update resume positioning accordingly."

        if missing_skills:
            feedback += f" Missing skills to consider: {', '.join(missing_skills[:8])}."

        feedback += " Keep formatting simple, use clear headings, and tailor each submission."

        return suggestions, feedback

    def analyze(
        self,
        resume_text: str | None,
        job_description: str,
        file_content_base64: str | None = None,
        content_type: str | None = None,
        file_name: str | None = None,
    ) -> ResumeAnalysisResponse:
        warnings: list[str] = []
        parsed_text = resume_text or ""

        if not clean_text(parsed_text) and file_content_base64:
            parsed_text, parsing_warnings = parse_resume_file(file_content_base64, content_type, file_name)
            warnings.extend(parsing_warnings)

        cleaned_resume = clean_text(parsed_text)
        cleaned_job = clean_text(job_description)

        if not cleaned_resume:
            warnings.append("Resume text could not be extracted.")
        if not cleaned_job:
            warnings.append("Job description is empty.")

        resume_domain = self.predict_domain(cleaned_resume) if cleaned_resume else "Unknown"
        job_domain = self.predict_domain(cleaned_job) if cleaned_job else "Unknown"
        match_result = self.match(cleaned_resume, cleaned_job)

        resume_skills = extract_skills(cleaned_resume)
        job_skills = extract_skills(cleaned_job)
        resume_skill_set = set(resume_skills)
        matched_skills = [skill for skill in job_skills if skill in resume_skill_set]
        missing_skills = [skill for skill in job_skills if skill not in resume_skill_set]

        skill_score = 0 if not job_skills else round(len(matched_skills) / len(job_skills) * 100)
        domain_score = 100 if resume_domain == job_domain and resume_domain != "Unknown" else 40
        similarity = match_result["similarity_percent"]
        ats_score = round(similarity * 0.45 + domain_score * 0.25 + skill_score * 0.30)
        ats_score = max(0, min(100, ats_score))

        suggestions, feedback = self.suggestions(ats_score, resume_domain, job_domain, missing_skills)
        if not cleaned_resume:
            suggestions = [
                "Resume text extraction is not available yet. Please add extracted text support or upload a text-readable file."
            ] + suggestions

        return ResumeAnalysisResponse(
            success=True,
            resume_text=cleaned_resume,
            resume_domain=resume_domain,
            job_description_domain=job_domain,
            similarity_percent=similarity,
            skill_score=skill_score,
            domain_score=domain_score,
            ats_score=ats_score,
            resume_skills=resume_skills,
            job_description_skills=job_skills,
            matched_skills=matched_skills or match_result["matched_keywords"],
            missing_skills=missing_skills or match_result["missing_keywords"],
            resume_keywords=match_result["resume_keywords"],
            job_description_keywords=match_result["job_description_keywords"],
            suggestions=suggestions,
            feedback=feedback,
            warnings=warnings,
        )
