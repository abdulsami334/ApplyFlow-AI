import base64
import io
import re
from collections.abc import Iterable

from docx import Document
from pypdf import PdfReader


SKILLS = [
    "javascript",
    "typescript",
    "react",
    "node.js",
    "node",
    "express",
    "mongodb",
    "sql",
    "postgresql",
    "postgres",
    "python",
    "django",
    "flask",
    "fastapi",
    "machine learning",
    "ai",
    "docker",
    "kubernetes",
    "git",
    "github",
    "rest api",
    "api",
    "html",
    "css",
    "c#",
    ".net",
    "asp.net",
    "entity framework",
    "playwright",
    "jira",
]


def clean_text(text: str | None) -> str:
    if not text:
        return ""

    normalized = text.replace("\r", "")
    normalized = re.sub(r"\n{2,}", "\n", normalized)
    normalized = re.sub(r"[ \t]+", " ", normalized)
    return normalized.strip()


def normalize_terms(values: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        item = value.strip().lower()
        if not item or item in seen:
            continue
        seen.add(item)
        result.append(item)
    return result


def extract_skills(text: str) -> list[str]:
    lower_text = f" {text.lower()} "
    skills: list[str] = []

    for skill in SKILLS:
        pattern = re.escape(skill.lower()).replace(r"\ ", r"\s+")
        if re.search(rf"(?<![a-z0-9+#.]){pattern}(?![a-z0-9+#.])", lower_text):
            skills.append(skill)

    return normalize_terms(skills)


def parse_resume_file(file_content_base64: str | None, content_type: str | None, file_name: str | None) -> tuple[str, list[str]]:
    warnings: list[str] = []
    if not file_content_base64:
        return "", ["Resume file content was not provided."]

    try:
        raw = base64.b64decode(file_content_base64)
    except Exception:
        return "", ["Resume file content was not valid base64."]

    extension = (file_name or "").lower().rsplit(".", 1)[-1] if file_name and "." in file_name else ""
    mime = (content_type or "").lower()

    try:
        if mime == "text/plain" or extension == "txt":
            return raw.decode("utf-8", errors="ignore"), warnings

        if mime == "application/pdf" or extension == "pdf":
            reader = PdfReader(io.BytesIO(raw))
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
            return text, warnings

        if (
            mime == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            or extension == "docx"
        ):
            document = Document(io.BytesIO(raw))
            return "\n".join(paragraph.text for paragraph in document.paragraphs), warnings

        warnings.append(f"Unsupported resume content type: {content_type or file_name or 'unknown'}.")
        return "", warnings
    except Exception as exc:
        warnings.append(f"Resume parsing failed: {exc}")
        return "", warnings
