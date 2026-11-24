import React, { useRef } from "react";
import { UploadCloud, FileCheck, X, File } from "lucide-react";

export default function ResumeUpload({ file, onFileSelect, onFileRemove }) {
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const validExtensions = [".pdf", ".docx", ".doc", ".txt"];
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase();
    if (validExtensions.includes(ext)) {
      onFileSelect(selectedFile);
    } else {
      alert("Please upload a valid PDF or DOCX file.");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="card resume-upload-card">
      <div className="card-header">
        <div className="card-title-group">
          <UploadCloud className="icon text-primary" size={20} />
          <h2 className="card-title">2. Candidate Resume</h2>
        </div>
      </div>

      <p className="card-subtitle">
        Upload your resume in <strong>PDF</strong> or <strong>DOCX</strong> format.
      </p>

      {!file ? (
        <div
          className="dropzone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".pdf,.docx,.doc,.txt"
            style={{ display: "none" }}
          />
          <div className="dropzone-icon">
            <UploadCloud size={36} />
          </div>
          <p className="dropzone-title">Click to upload or drag & drop</p>
          <p className="dropzone-hint">PDF or DOCX (Max 10MB)</p>
        </div>
      ) : (
        <div className="file-preview-card">
          <div className="file-info">
            <div className="file-icon-wrapper">
              <FileCheck size={28} className="text-success" />
            </div>
            <div className="file-details">
              <span className="file-name">{file.name}</span>
              <span className="file-size">{formatFileSize(file.size)}</span>
            </div>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onFileRemove}
            title="Remove uploaded resume"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
