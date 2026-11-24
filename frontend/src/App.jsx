import React, { useState } from "react";
import { Sparkles, Loader2, RefreshCw, History, ShieldAlert } from "lucide-react";
import JobInput from "./components/JobInput";
import ResumeUpload from "./components/ResumeUpload";
import AnalysisResult from "./components/AnalysisResult";
import HistoryModal from "./components/HistoryModal";
import "./App.css";

// Backend API URL (Default to FastAPI port 8000)
const API_BASE_URL = "http://localhost:8000";

function App() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // History state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyRecords, setHistoryRecords] = useState([]);

  // Handle Form Submission / Analyze Button Click
  const handleAnalyzeJobFit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!jobDescription.trim()) {
      setErrorMessage("Please enter or paste the target Job Description.");
      return;
    }

    if (!resumeFile) {
      setErrorMessage("Please upload a candidate resume (.pdf or .docx).");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("job_description", jobDescription);
      formData.append("resume", resumeFile);

      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error("Error analyzing job fit:", err);
      setErrorMessage(
        err.message || "Failed to analyze resume. Make sure the FastAPI backend is running on port 8000."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch SQLite history
  const handleOpenHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/history`);
      if (res.ok) {
        const data = await res.json();
        setHistoryRecords(data.records || []);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
    setIsHistoryOpen(true);
  };

  const handleReset = () => {
    setJobDescription("");
    setResumeFile(null);
    setAnalysisResult(null);
    setErrorMessage("");
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-logo">
            <Sparkles size={24} className="sparkle-icon" />
          </div>
          <div>
            <h1 className="brand-title">JobFit AI</h1>
            <p className="brand-tagline">AI-Powered Resume Matcher & ATS Optimizer</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleOpenHistory}
            title="View Previous Analyses saved in SQLite"
          >
            <History size={16} />
            <span>History</span>
          </button>
          {(jobDescription || resumeFile || analysisResult) && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleReset}
              title="Reset all fields"
            >
              <RefreshCw size={15} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Error notification */}
        {errorMessage && (
          <div className="alert-box">
            <ShieldAlert size={20} className="alert-icon" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleAnalyzeJobFit}>
          <div className="input-grid">
            {/* Step 1: Job Description */}
            <JobInput
              value={jobDescription}
              onChange={setJobDescription}
              onClear={() => setJobDescription("")}
            />

            {/* Step 2: Resume Upload */}
            <ResumeUpload
              file={resumeFile}
              onFileSelect={setResumeFile}
              onFileRemove={() => setResumeFile(null)}
            />
          </div>

          {/* Action Button: Analyze Job Fit */}
          <div className="action-row">
            <button
              type="submit"
              className="btn-primary analyze-button"
              disabled={isLoading || !jobDescription.trim() || !resumeFile}
            >
              {isLoading ? (
                <>
                  <Loader2 className="spinner" size={20} />
                  <span>Analyzing Resume with Groq AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Analyze Job Fit</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Structured Results Display */}
        {analysisResult && (
          <div className="results-wrapper">
            <div className="results-header-divider">
              <span className="results-heading">Analysis Report</span>
            </div>
            <AnalysisResult result={analysisResult} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>JobFit AI • Powered by FastAPI, SQLite & Groq AI</p>
      </footer>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        records={historyRecords}
        onSelectRecord={(item) => setAnalysisResult({ filename: item.filename, analysis: item.analysis })}
      />
    </div>
  );
}

export default App;
