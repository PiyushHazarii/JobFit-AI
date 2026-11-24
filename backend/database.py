import sqlite3
import json
from pathlib import Path
from typing import List, Dict, Any, Optional

# Database path in the backend directory
DB_PATH = Path(__file__).parent / "jobfit.sqlite3"

def get_connection():
    """Get a SQLite database connection with row factory enabled."""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the SQLite database schema if not already present."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS resume_analyses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL,
                file_type TEXT NOT NULL,
                resume_text TEXT NOT NULL,
                job_description TEXT NOT NULL,
                score REAL NOT NULL,
                analysis_json TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()

def save_analysis(
    filename: str,
    file_type: str,
    resume_text: str,
    job_description: str,
    score: float,
    analysis_data: Dict[str, Any]
) -> int:
    """Save an uploaded resume and its structured analysis into SQLite."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO resume_analyses 
            (filename, file_type, resume_text, job_description, score, analysis_json)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            filename,
            file_type,
            resume_text,
            job_description,
            score,
            json.dumps(analysis_data, ensure_ascii=False)
        ))
        conn.commit()
        return cursor.lastrowid

def get_recent_analyses(limit: int = 10) -> List[Dict[str, Any]]:
    """Retrieve recent analyses from the database."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, filename, file_type, score, created_at, analysis_json
            FROM resume_analyses
            ORDER BY id DESC
            LIMIT ?
        """, (limit,))
        rows = cursor.fetchall()
        results = []
        for r in rows:
            results.append({
                "id": r["id"],
                "filename": r["filename"],
                "file_type": r["file_type"],
                "score": r["score"],
                "created_at": r["created_at"],
                "analysis": json.loads(r["analysis_json"])
            })
        return results
