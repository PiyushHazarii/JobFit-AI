import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  Briefcase,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default function AnalysisResult({ result }) {
  if (!result || !result.analysis) return null;

  const { analysis, filename } = result;
  const score = analysis.score ?? 0; // Score out of 10
  const matchPercentage = analysis.match_percentage ?? Math.round(score * 10);

  // Determine color theme based on score out of 10
  const getScoreBadgeClass = () => {
    if (score >= 8.0) return "score-high";
    if (score >= 5.5) return "score-medium";
    return "score-low";
  };

  return (
    <div className="result-container">
      {/* Top Banner / Scorecard */}
      <div className={`score-banner ${getScoreBadgeClass()}`}>
        <div className="score-details">
          <span className="candidate-badge">
            Candidate: <strong>{analysis.candidate_name || "Applicant"}</strong>
          </span>
          <h2 className="verdict-title">{analysis.verdict}</h2>
          <p className="summary-text">{analysis.summary}</p>
        </div>

        <div className="score-display">
          <div className="score-circle">
            <span className="score-number">{score}</span>
            <span className="score-max">/ 10</span>
          </div>
          <span className="match-tag">{matchPercentage}% Match</span>
        </div>
      </div>

      <div className="analysis-grid">
        {/* Missing Keywords Box - CRITICAL for editing resume */}
        <div className="card highlight-card danger-border">
          <div className="card-header">
            <div className="card-title-group">
              <AlertTriangle className="text-danger" size={20} />
              <h3 className="card-title">Missing Keywords & Skills</h3>
            </div>
            <span className="badge-count danger-badge">
              {analysis.missing_keywords?.length || 0} missing
            </span>
          </div>
          <p className="section-instruction">
            These terms appear in the job requirements but are missing from the resume. Add them to pass ATS scans:
          </p>
          <div className="tags-container">
            {analysis.missing_keywords && analysis.missing_keywords.length > 0 ? (
              analysis.missing_keywords.map((kw, idx) => (
                <span key={idx} className="tag tag-missing">
                  + {kw}
                </span>
              ))
            ) : (
              <p className="empty-text">No critical keywords missing!</p>
            )}
          </div>
        </div>

        {/* Matching Skills Box */}
        <div className="card highlight-card success-border">
          <div className="card-header">
            <div className="card-title-group">
              <CheckCircle2 className="text-success" size={20} />
              <h3 className="card-title">Matched Skills & Qualifications</h3>
            </div>
            <span className="badge-count success-badge">
              {analysis.matching_skills?.length || 0} matched
            </span>
          </div>
          <p className="section-instruction">
            Qualifications confirmed in both the resume and the job description:
          </p>
          <div className="tags-container">
            {analysis.matching_skills && analysis.matching_skills.length > 0 ? (
              analysis.matching_skills.map((skill, idx) => (
                <span key={idx} className="tag tag-match">
                  ✓ {skill}
                </span>
              ))
            ) : (
              <p className="empty-text">No direct skills matched yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Experience Analysis */}
      {analysis.experience_analysis && (
        <div className="card experience-card">
          <div className="card-header">
            <div className="card-title-group">
              <Briefcase className="text-primary" size={20} />
              <h3 className="card-title">Experience & Requirements Match</h3>
            </div>
            <span
              className={`status-pill ${
                analysis.experience_analysis.is_requirement_met
                  ? "pill-success"
                  : "pill-warning"
              }`}
            >
              {analysis.experience_analysis.is_requirement_met
                ? "Requirement Met"
                : "Experience Gap"}
            </span>
          </div>

          <div className="experience-stats">
            <div className="stat-box">
              <span className="stat-label">Candidate Experience:</span>
              <span className="stat-value">
                {analysis.experience_analysis.candidate_years != null
                  ? `${analysis.experience_analysis.candidate_years} Years`
                  : "Not specified"}
              </span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Job Requirement:</span>
              <span className="stat-value">
                {analysis.experience_analysis.required_years != null
                  ? `${analysis.experience_analysis.required_years} Years`
                  : "Not specified"}
              </span>
            </div>
          </div>
          <p className="experience-details">
            {analysis.experience_analysis.details}
          </p>
        </div>
      )}

      {/* Actionable Suggestions on What to Edit in Resume */}
      <div className="card suggestions-card">
        <div className="card-header">
          <div className="card-title-group">
            <Lightbulb className="text-accent" size={22} />
            <h3 className="card-title">Recommended Edits to Boost Resume</h3>
          </div>
        </div>
        <p className="section-instruction">
          Follow these specific edits to optimize your resume for this exact role:
        </p>

        <ul className="suggestions-list">
          {analysis.suggestions_for_resume &&
            analysis.suggestions_for_resume.map((item, idx) => (
              <li key={idx} className="suggestion-item">
                <span className="suggestion-number">{idx + 1}</span>
                <span className="suggestion-text">{item}</span>
              </li>
            ))}
        </ul>
      </div>

      {/* Key Strengths */}
      {analysis.key_strengths && analysis.key_strengths.length > 0 && (
        <div className="card strengths-card">
          <div className="card-header">
            <div className="card-title-group">
              <Award className="text-primary" size={20} />
              <h3 className="card-title">Candidate Strengths for this Role</h3>
            </div>
          </div>
          <ul className="strengths-list">
            {analysis.key_strengths.map((strength, idx) => (
              <li key={idx} className="strength-item">
                <ArrowUpRight size={16} className="text-primary" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
