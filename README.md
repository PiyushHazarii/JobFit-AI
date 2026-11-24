# JobFit AI - Resume Matcher & ATS Optimizer 🚀

JobFit AI is a modern, structured full-stack application that analyzes candidate resumes against job descriptions using Groq AI. It provides an ATS compatibility score out of 10, highlights matching qualifications, identifies critical missing keywords, compares experience requirements, and offers actionable resume edit suggestions.

---

## 📁 Project Structure

```text
JobFit AI/
├── .env                       # Environment variables (GROQ_API_KEY)
├── resume_parser.py           # Original script reference
│
├── backend/                   # FastAPI Backend
│   ├── main.py                # FastAPI endpoints (/api/analyze, /api/history, /api/health)
│   ├── ai_service.py          # Groq LLM integration & Pydantic structured schema prompting
│   ├── schemas.py             # Pydantic data models for structured output & scoring
│   ├── parser.py              # Resume text extraction using pypdf (PDF) & python-docx (DOCX)
│   ├── database.py            # SQLite database helper (stores resumes & analysis history)
│   ├── jobfit.sqlite3         # SQLite database file (auto-generated)
│   └── requirements.txt       # Backend Python dependencies
│
└── frontend/                  # React Frontend (Vite)
    ├── index.html             # Application entry point
    ├── package.json           # Frontend dependencies & scripts
    ├── vite.config.js         # Vite configuration
    └── src/
        ├── App.jsx            # Main application layout & API orchestration
        ├── App.css            # Clean, modern UI styling
        ├── main.jsx           # React root renderer
        ├── index.css          # CSS reset & base styles
        └── components/
            ├── JobInput.jsx       # 1. Job Description paste & word counter
            ├── ResumeUpload.jsx   # 2. Resume PDF/DOCX drag-and-drop & file selector
            ├── AnalysisResult.jsx # 3. Score out of 10, missing keywords, suggestions
            └── HistoryModal.jsx   # View previous SQLite-stored analyses
```

---

## ⚡ How It Works

1. **Job Description & Resume Upload**:
   - The user pastes a job description string and uploads their resume (`.pdf` or `.docx`).
2. **Text Extraction**:
   - `backend/parser.py` extracts text using `pypdf.PdfReader` for PDFs and `docx.Document` for DOCX files.
3. **Groq AI Analysis**:
   - `backend/ai_service.py` sends the extracted text and job description to Groq AI using structured output schemas (`Pydantic`).
   - The AI evaluates:
     - **Job Fit Score**: Strictly rated out of 10.0 (e.g., 8.5/10)
     - **Match Percentage**: 0% - 100%
     - **Missing Keywords**: Critical technical and soft skills absent from the resume
     - **Matched Skills**: Directly confirmed skills
     - **Experience & Education**: Gap analysis
     - **Actionable Edit Suggestions**: Concrete recommendations on what to edit in the resume
4. **SQLite Persistence**:
   - `backend/database.py` stores the resume text, job description, score, and complete JSON analysis into SQLite for auditing and history review.
5. **Interactive UI**:
   - Visual score card, color-coded badges, and clear lists for the candidate.

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- A Groq API Key (already placed in `.env` as `GROQ_API_KEY`)

---

### 2. Run the Backend (FastAPI)

You can run the backend either from the **root directory** or from inside the **backend directory**:

**Option A (From inside `backend` folder):**
```bash
cd backend
uvicorn main:app --reload --port 8000
```
*Or directly with Python:*
```bash
python main.py
```

**Option B (From project root):**
```bash
python -m uvicorn backend.main:app --reload --port 8000
```
- Backend will be available at: `http://localhost:8000`
- Interactive API Docs (Swagger): `http://localhost:8000/docs`

---

### 3. Run the Frontend (React + Vite)

Open a new terminal window:
```bash
cd frontend

# Install dependencies (already installed during setup):
npm install

# Start the development server:
npm run dev
```
- Open `http://localhost:5173` in your browser.

---

## 🔌 API Endpoints

- `POST /api/analyze`:
  - **Form Data**:
    - `job_description` (string)
    - `resume` (file upload: `.pdf` or `.docx`)
  - **Returns**: Structured JSON with score out of 10, missing keywords, and resume recommendations.
- `GET /api/history`:
  - Returns recent analyzed resumes saved in the SQLite database.
- `GET /api/health`:
  - Health check endpoint.
