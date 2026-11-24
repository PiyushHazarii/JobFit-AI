import React from "react";
import { FileText, Trash2 } from "lucide-react";

export default function JobInput({ value, onChange, onClear }) {
  return (
    <div className="card job-input-card">
      <div className="card-header">
        <div className="card-title-group">
          <FileText className="icon text-primary" size={20} />
          <h2 className="card-title">1. Job Description</h2>
        </div>
        {value && (
          <button
            type="button"
            className="btn-icon"
            onClick={onClear}
            title="Clear Job Description"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <p className="card-subtitle">
        Paste the target job description or requirements here.
      </p>

      <textarea
        className="textarea-input"
        placeholder="Paste full job description here (e.g. responsibilities, required skills, preferred qualifications, experience requirements)..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={9}
      />

      <div className="character-count">
        {value.trim().length > 0 ? (
          <span>{value.trim().split(/\s+/).length} words ({value.length} characters)</span>
        ) : (
          <span>Paste at least a few job requirements</span>
        )}
      </div>
    </div>
  );
}
