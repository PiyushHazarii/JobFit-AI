import os
import sys
import shutil
from pathlib import Path
from tempfile import NamedTemporaryFile
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Ensure imports work whether launched from project root or inside backend directory
CURRENT_DIR = Path(__file__).resolve().parent
ROOT_DIR = CURRENT_DIR.parent
for p in [str(CURRENT_DIR), str(ROOT_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from database import init_db, save_analysis, get_recent_analyses
    from parser import extract_resume_text
    from ai_service import analyze_job_fit
except ImportError:
    from backend.database import init_db, save_analysis, get_recent_analyses
    from backend.parser import extract_resume_text
    from backend.ai_service import analyze_job_fit


# Initialize SQLite database
init_db()

app = FastAPI(
    title="JobFit AI Backend",
    description="FastAPI service for parsing resumes, comparing with job descriptions, and generating AI insights.",
    version="1.0.0"
)

# Enable CORS for React frontend (default Vite dev port 5173, 3000, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    """Health check endpoint to verify backend status."""
    return {"status": "ok", "service": "JobFit AI"}

@app.post("/api/analyze")
async def analyze_resume_endpoint(
    job_description: str = Form(..., description="Job description text"),
    resume: UploadFile = File(..., description="Resume file (PDF or DOCX)")
):
    """
    Main endpoint:
    1. Receives job description string and resume file (PDF/DOCX)
    2. Extracts text using pypdf or docx
    3. Calls Groq AI to generate structured Job Fit insights & score out of 10
    4. Persists the resume text, job description, score, and results to SQLite
    5. Returns structured JSON output
    """
    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    filename = resume.filename or "resume.pdf"
    suffix = Path(filename).suffix.lower()

    if suffix not in [".pdf", ".docx", ".doc", ".txt"]:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{suffix}'. Please upload a .pdf or .docx file."
        )

    # Save uploaded file temporarily to extract text cleanly
    try:
        with NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            shutil.copyfileobj(resume.file, temp_file)
            temp_path = Path(temp_file.name)

        # Extract text using parser (pypdf / python-docx)
        resume_text = extract_resume_text(temp_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read file: {str(e)}")
    finally:
        # Clean up temporary file
        if 'temp_path' in locals() and temp_path.exists():
            temp_path.unlink()

    if not resume_text or len(resume_text.strip()) < 20:
        raise HTTPException(
            status_code=400,
            detail="Could not extract readable text from the uploaded resume. Please verify the file content."
        )

    # Call AI service with Groq
    try:
        analysis = analyze_job_fit(job_description=job_description, resume_text=resume_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    # Store into SQLite database
    try:
        record_id = save_analysis(
            filename=filename,
            file_type=suffix.replace(".", ""),
            resume_text=resume_text,
            job_description=job_description,
            score=analysis.score,
            analysis_data=analysis.model_dump()
        )
    except Exception as e:
        # If DB save fails, still return analysis but log warning
        record_id = None
        print(f"[Warning] SQLite save error: {e}")

    return {
        "id": record_id,
        "filename": filename,
        "analysis": analysis.model_dump()
    }

@app.get("/api/history")
def get_analysis_history():
    """Returns recent resume analyses saved in SQLite."""
    try:
        records = get_recent_analyses(limit=10)
        return {"records": records}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    app_target = "backend.main:app" if Path.cwd().name != "backend" else "main:app"
    uvicorn.run(app_target, host="127.0.0.1", port=8000, reload=True)


