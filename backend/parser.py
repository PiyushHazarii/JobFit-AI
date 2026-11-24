from pathlib import Path
from pypdf import PdfReader
from docx import Document

def read_pdf(file_path) -> str:
    """
    Extract text from a PDF file using pypdf.
    Iterates over all pages and collects non-empty text.
    """
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text.strip()

def read_docx(file_path) -> str:
    """
    Extract text from a DOCX file using python-docx.
    Reads paragraphs as well as tables.
    """
    document = Document(file_path)
    text = ""
    for paragraph in document.paragraphs:
        if paragraph.text.strip():
            text += paragraph.text + "\n"
    
    for table in document.tables:
        for row in table.rows:
            for cell in row.cells:
                if cell.text.strip():
                    text += cell.text + "\n"
    return text.strip()

def extract_resume_text(file_path: Path) -> str:
    """
    Dispatcher to read resume text based on file extension (.pdf or .docx).
    """
    extension = file_path.suffix.lower()
    if extension == ".pdf":
        return read_pdf(file_path)
    elif extension in [".docx", ".doc"]:
        return read_docx(file_path)
    elif extension == ".txt":
        return file_path.read_text(encoding="utf-8", errors="ignore").strip()
    else:
        raise ValueError(f"Unsupported file format '{extension}'. Please upload a PDF or DOCX file.")
