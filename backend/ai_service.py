import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq

# Support execution from both root and backend directory
CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

try:
    from schemas import JobFitAnalysis
except ImportError:
    from backend.schemas import JobFitAnalysis


# Look for .env in current or parent directory
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    # Also check local backend .env
    load_dotenv()
    api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY is not set in .env file!")

# Initialize Groq client
client = Groq(api_key=api_key)
MODEL_NAME = "openai/gpt-oss-120b"

def analyze_job_fit(job_description: str, resume_text: str) -> JobFitAnalysis:
    """
    Sends the job description and candidate resume to Groq AI
    and returns a structured JobFitAnalysis object.
    """
    json_schema = JobFitAnalysis.model_json_schema()

    system_prompt = f"""
You are an expert AI Technical Recruiter and Career Coach specializing in Applicant Tracking Systems (ATS) and resume evaluation.

Your task is to analyze the provided Job Description and Candidate Resume, evaluate how well they fit, and provide actionable advice to the candidate.

EVALUATION CRITERIA:
1. Candidate Name: Extract candidate's full name if found.
2. Score: Rate candidate fit strictly out of 10.0 (e.g. 8.5/10).
3. Match Percentage: 0 to 100.
4. Matching Skills: Skills present in both job description and resume.
5. Missing Keywords: Critical skills, tools, or certifications mentioned in the job description that are missing in the resume.
6. Experience Analysis: Compare candidate's years and depth of experience with job requirements.
7. Key Strengths: Top candidate highlights that make them a good fit.
8. Suggestions for Resume: Actionable, specific edits the candidate should make to their resume to drastically increase their interview callback chances for this role.

Return ONLY a valid JSON object strictly matching this schema:
{json.dumps(json_schema, indent=2)}

DO NOT include markdown code fences, comments, or extra text outside the JSON.
"""

    user_prompt = f"""
=== JOB DESCRIPTION ===
{job_description}

=== CANDIDATE RESUME ===
{resume_text}
"""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages,
        response_format={"type": "json_object"},
        temperature=0.2
    )

    raw_content = response.choices[0].message.content
    data = json.loads(raw_content)

    # Validate with Pydantic
    analysis = JobFitAnalysis(**data)
    
    # Ensure score is clamped between 0 and 10
    if analysis.score > 10:
        analysis.score = round(analysis.score / 10.0, 1)
    else:
        analysis.score = round(float(analysis.score), 1)

    return analysis
